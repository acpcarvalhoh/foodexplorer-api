const { Router } = require("express")
const DishesController = require("../controllers/DishesController")
const  dishesController = new DishesController()
const dishesRouter = Router();

dishesRouter.post("/", dishesController.create);

module.exports = dishesRouter;