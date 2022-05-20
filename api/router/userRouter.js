const Router = require("express").Router;
const { getUser, createUser, changeUserProfile, changeUserEmail, changeUserPassword, deleteUser, getUserOrders, getUserPreferences } = require("../controller/userController");


const router = new Router();

router.get("/:userId", getUser);
router.post("/", createUser);
router.patch("/profile", changeUserProfile);
router.patch("/email", changeUserEmail);
router.patch("/password", changeUserPassword);
router.delete("/:userId", deleteUser);

module.exports = router;