const { Router } = require("express")
const DishesController = require("../controllers/DishesController")
const  dishesController = new DishesController()
const dishesRouter = Router();

dishesRouter.post("/", dishesController.create);
dishesRouter.put("/:dish_id", dishesController.update);
dishesRouter.get("/:id", dishesController.show);
dishesRouter.delete("/:id", dishesController.delete);

module.exports = dishesRouter;