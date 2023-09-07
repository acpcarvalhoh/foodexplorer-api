const { Router } = require("express")
const router = Router();
const userRoutes = require("./users.routes")

router.use("/users", userRoutes);

module.exports = exports = router;