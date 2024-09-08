var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const sqlDatabase = require('../middleware/middleware.sql');
const axios = require('axios')

require('dotenv').config();

getEmail = async (user) => {
    try {
        const result = await sqlDatabase.all('SELECT email FROM userinfo WHERE user = ?', [user]);
        if (result.length > 0) {
            return result[0].email;
        } else {
            throw new Error(`Email not found for user: ${user}`);
        }
    } catch (error) {
        throw new Error(`Error getting email for user: ${user}. ${error.message}`);c
    }
}

exports.signup = async (req, res) => {
    try {
        const user = req.body.user
        const password = req.body.pass
        const email = req.body.email

        // Validate the user and password
        if (!user || !password || !email) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // Check if user already exists
        const queryUser = 'SELECT user FROM userinfo WHERE user = ?';
        const resultUser = await sqlDatabase.all(queryUser, [user]);

        if (resultUser.length > 0) {
            return res.status(400).json({ message: 'Username is already taken.' });
        }

        const queryEmail = 'SELECT email FROM userinfo WHERE email = ?';
        const resultEmail = await sqlDatabase.all(queryEmail, [email]);

        if (resultEmail.length > 0) {
            return res.status(400).json({ message: 'Email is already taken.' });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Insert the new user into the database
        const insertQuery = 'INSERT INTO userinfo (user, password, email) VALUES (?, ?, ?)';
        await sqlDatabase.run(insertQuery, [user, hashedPassword, email]);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.signin = async (req, res) => {
    try {
        const user = req.body.user
        const password = req.body.pass

        // Validate the user and password
        if (!user || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // Query the database for the user
        const query = 'SELECT * FROM userinfo WHERE user = ?';
        const result = await sqlDatabase.all(query, [user]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userRecord = result[0];

        // Check if the password is valid
        const passwordIsValid = bcrypt.compareSync(password, userRecord.password);

        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: 'Invalid password!'
            });
        }

        // Generate a token
        const token = jwt.sign({ user: userRecord.user }, process.env.ENCRYPT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).json({
            user: userRecord.user,
            accessToken: token
        });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};


exports.discordCallback = async (req, res) => {
    try {
      const code = req.query.code; // Extract the authorization code from the query parameters
  
      if (!code) {
        return res.status(400).send({ message: "Missing authorization code" });
      }
  
      const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code, // Use the extracted authorization code
        redirect_uri: process.env.DISCORD_REDIRECT_URI // Ensure this matches the one used in OAuth2 authorization URL
      });
  
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
  
      // Exchange the authorization code for an access token
      const response = await axios.post('https://discord.com/api/oauth2/token', params.toString(), { headers });
  
      if (!response.data || !response.data.access_token) {
        throw new Error('No access token received from Discord');
      }
  
      const accessToken = response.data.access_token;
  
      // Fetch user information using the access token
      const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      const { id, username, avatar, email } = userResponse.data;


      const insertQuery = 'INSERT OR IGNORE INTO userinfo (user, email, avatar, id) VALUES (?, ?, ?, ?)';
      await sqlDatabase.run(insertQuery, [username, email, avatar, id]);
      

      const token = jwt.sign({ user: username }, process.env.ENCRYPT_SECRET, {
        expiresIn: 86400 // 24 hours
    });

      res.redirect(process.env.FRONTEND_LINK + `/disc?user=${encodeURIComponent(username)}&token=${encodeURIComponent(token)}`);
    
      
    } catch (error) {
      console.error("Error during Discord OAuth2 callback:", error.response ? error.response.data : error.message);
      res.status(500).send({
        message: "Error during Discord OAuth2 callback",
        error: error.response ? error.response.data : error.message
      });
    }
  };

// Verify token function
exports.verifyToken = async (req, res, next) => {
    // Retrieve token from the request header
    let token = await req.headers["x-access-token"];
    
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    // Verify the token
    jwt.verify(token, process.env.ENCRYPT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }  

        req.user = decoded.user

        next(); // Passes control to the next middleware or route handler
    });
};
