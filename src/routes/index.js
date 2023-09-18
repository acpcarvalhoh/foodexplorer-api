const { Router } = require("express")
const router = Router();
const userRoutes = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const disheRoutes = require("./dishes.routes");

router.use("/users", userRoutes);
router.use("/sessions", sessionsRoutes);
router.use("/dishes", disheRoutes);


module.exports = exports = router;