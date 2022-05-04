const Router = require("express").Router;
const { getUser, createUser, changeUserProfile, changeUserEmail, changeUserPassword, deleteUser } = require("../controller/userController");


const router = new Router();

router.get("/", getUser);
router.post("/", createUser);
router.patch("/profile", changeUserProfile);
router.patch("/email", changeUserEmail);
router.patch("/password", changeUserPassword);
router.delete("/", deleteUser);

module.exports = router;