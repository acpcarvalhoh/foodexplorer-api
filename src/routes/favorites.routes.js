const { Router } = require("express")
const FavoritesDishesController = require("../controllers/FavoritesDishesController")
const  favoritesDishesController = new FavoritesDishesController()
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const favoritesRouter = Router();

favoritesRouter.use(ensureAuthenticated);

favoritesRouter.post("/", favoritesDishesController.create);
favoritesRouter.delete("/:id", favoritesDishesController.delete);
favoritesRouter.get("/", favoritesDishesController.index);

module.exports = favoritesRouter;