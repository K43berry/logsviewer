import serviceSql from '../service/service.sql';

const signin = (user, pass) => {
    const loginJSON = {
        user: user,
        pass: pass
    }


    return serviceSql.signin(loginJSON)
    .then((response) => {
        if (response.data.accessToken) {
            localStorage.setItem("user", JSON.stringify(response.data))
        }
        return response.data
    });

}

const signup = (user, pass, email) => {
    const signupJSON = {
        user: user,
        pass: pass,
        email: email
    }

    return serviceSql.signup(signupJSON)
}

const logout = () => {
    localStorage.removeItem("user")
}

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"))
}

const loginService = {
    signin,
    signup,
    logout,
    getCurrentUser
}

export default loginService