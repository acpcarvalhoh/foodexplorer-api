const { Router } = require("express")
const DishesController = require("../controllers/DishesController")
const  dishesController = new DishesController()
const multer = require("multer");
const uploadsConfig = require("../configs/dishUloads");

const uploads = multer(uploadsConfig.MULTER);

const dishesRoutes = Router();

dishesRoutes.post("/", uploads.single("image"), dishesController.create);
dishesRoutes.get("/", dishesController.index);
dishesRoutes.put("/:dish_id", dishesController.update);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", dishesController.delete);

module.exports = dishesRoutes;