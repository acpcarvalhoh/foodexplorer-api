const { Router } = require("express")
const UserRolesController = require("../controllers/UserRolesController")
const  userRolesController = new UserRolesController()
const userRouter = Router();

userRouter.post("/", userRolesController.create);

module.exports = userRouter;