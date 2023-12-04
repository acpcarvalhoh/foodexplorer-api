const { Router } = require("express")
const UserRolesController = require("../controllers/UserRolesController")
const SessionsValidateController = require("../controllers/SessionsValidateController")
const  userRolesController = new UserRolesController()
const  sessionsValidateController = new SessionsValidateController()

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const userRouter = Router();

userRouter.post("/", userRolesController.create);
userRouter.get("/validated", ensureAuthenticated, sessionsValidateController.create);

module.exports = userRouter;