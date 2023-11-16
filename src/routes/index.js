const { Router } = require("express")
const router = Router();
const userRoutes = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const dishRoutes = require("./dishes.routes");
const  favoritesRoutes = require("./favorites.routes")

router.use("/users", userRoutes);
router.use("/sessions", sessionsRoutes);
router.use("/dishes", dishRoutes);
router.use("/favorites", favoritesRoutes);


module.exports = exports = router;