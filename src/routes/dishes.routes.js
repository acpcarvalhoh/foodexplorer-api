const { Router } = require("express")
const DishesController = require("../controllers/DishesController")
const  dishesController = new DishesController()
const multer = require("multer");
const uploadsConfig = require("../configs/dishUloads");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");
const uploads = multer(uploadsConfig.MULTER);



const dishesRoutes = Router();
dishesRoutes.use(ensureAuthenticated);

dishesRoutes.post("/", verifyUserAuthorization("admin"), uploads.single("image"), dishesController.create);
dishesRoutes.put("/:dish_id", verifyUserAuthorization("admin"), uploads.single("image"), dishesController.update);
dishesRoutes.get("/", dishesController.index);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", verifyUserAuthorization("admin"), dishesController.delete);

module.exports = dishesRoutes;