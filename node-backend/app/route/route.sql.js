module.exports = app => {
    const logsRouter = require("../controller/controller.logs");
    const passRouter = require("../controller/controller.pass")
    const friendsRouter = require("../controller/controller.friends")
    const statsRouter = require('../controller/controller.stats')
  
    var router = require("express").Router();

    router.post("/all", [passRouter.verifyToken], logsRouter.uploadAll);

    router.delete("/deleteAll", logsRouter.deleteAll) //test command

    router.get("/getAll", [passRouter.verifyToken], logsRouter.getDb) //test command

    // router.get("/getClearPercent", [passRouter.verifyToken], logsRouter.getClearPercent) //test command

    // router.get("/getCA", [passRouter.verifyToken], logsRouter.getClearedWhenAlive) //kinda useless delete?

    /////////////////////////////////

    router.post("/signin", passRouter.signin)

    router.post("/signup", passRouter.signup)

    router.get("/getNumberOfLogs", logsRouter.getNumberOfLogs)

    router.get("/discord/auth", passRouter.discordCallback )

    /////////////////////////////////

    router.post("/friends/create", [passRouter.verifyToken], friendsRouter.createFriendship)

    router.get("/friends/getAllShared", [passRouter.verifyToken], friendsRouter.getAllSharedTo) //NO NEED OTHER USER

    router.get("/friends/getAllReceived", [passRouter.verifyToken], friendsRouter.getAllReceived) //NO NEED OTHER USER

    router.post("/friends/removeFriendShared", [passRouter.verifyToken], friendsRouter.removeFriendShared)

    router.post("/friends/removeFriendReceived", [passRouter.verifyToken], friendsRouter.removeFriendReceived)

    router.post("/friends/checkShared", [passRouter.verifyToken], friendsRouter.checkConnectionShared)
    
    router.post("/friends/checkReceived", [passRouter.verifyToken], friendsRouter.checkConnectionReceived)
    
    router.post("/friends/getFriendsDb", [passRouter.verifyToken], friendsRouter.getFriendsDb)

    /////////////////////////////////

    router.get("/getRecap", [passRouter.verifyToken], statsRouter.getRecap)

    router.post("/sendToLeaderboard", [passRouter.verifyToken], statsRouter.sendToLeaderboard)

    router.get("/getAllLeaderboard", statsRouter.getAllLeaderboard)
  
    app.use('/', router);
  };
