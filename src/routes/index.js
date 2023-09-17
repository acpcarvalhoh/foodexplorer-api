const { Router } = require("express")
const router = Router();
const userRoutes = require("./users.routes")
const disheRoutes = require("./dishes.routes")

router.use("/users", userRoutes);
router.use("/dishes", disheRoutes);


module.exports = exports = router;