import http from "../http-common"


const getToken = () => {
  try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user ? user.accessToken : '';
  } catch {
      console.log("no token found")
  }
}

const token = getToken()


////////////////////////////////

const getAll = () => {
  return http.get("/getAll", {
    headers: { 'x-access-token': token }
  });
};

const getNumberOfLogs = () => {
  return http.get('/getNumberOfLogs')
}

const sendAll = (data) => {
  return http.post("/all", data, {
    headers: { 'x-access-token': token },
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });
};

//////////////////////////////////////

const signin = (data) => {
  return http.post("/signin", data);
};

const signup = (data) => {
  return http.post("/signup", data);
};

//////////////////////////////////////////////

const friendsCreate = (data) => {
  return http.post("/friends/create", data, {headers: { 'x-access-token': token } });
}

const friendsRemoveShared = (data) => {
  return http.post("/friends/removeFriendShared", data, {headers: { 'x-access-token': token } } );
}

const friendsRemoveReceived = (data) => {
  return http.post("/friends/removeFriendReceived", data, {headers: { 'x-access-token': token } } );
}

const friendsGetAllReceived = () => {
  return http.get("/friends/getAllReceived", {headers: { 'x-access-token': token } });
}

const friendsGetAllShared = () => {
  return http.get("/friends/getAllShared", {headers: { 'x-access-token': token } });
}

const friendsCheckShared = (data) => {
  return http.post("/friends/checkShared", data, {headers: { 'x-access-token': token } });
}

const friendsCheckReceived = (data) => {
  return http.post("/friends/checkReceived", data, {headers: { 'x-access-token': token } });
}

const friendsGetDb = (data) => {
  return http.post("/friends/getFriendsDb", data, {headers: { 'x-access-token': token } });
}

/////////////////////////////////

const getRecap = () => {
  return http.get("/getRecap", {headers: { 'x-access-token': token } })
}

const sendToLeaderboard = (data) => {
  return http.post("/sendToLeaderboard", data, {headers: { 'x-access-token': token } } )
}

const getAllLeaderboard = () => {
  return http.get("/getAllLeaderboard", {headers: { 'x-access-token': token } } )
}

const DataService = {
    sendAll,
    signin,
    signup,
    getAll,
    getNumberOfLogs,
    friendsCreate,
    friendsGetAllReceived,
    friendsGetAllShared,
    friendsRemoveReceived,
    friendsRemoveShared,
    friendsCheckReceived,
    friendsCheckShared,
    friendsGetDb,
    getRecap,
    sendToLeaderboard,
    getAllLeaderboard,
}

export default DataService;