const Router = require("express").Router;
const { getUser, createUser, changeUserProfile, changeUserEmail, changeUserPassword, deleteUser } = require("../controller/userController");


const router = new Router();

router.get("/:userId", getUser);
router.post("/", createUser);
router.put("/profile/:userId", changeUserProfile);
router.put("/email/:userId", changeUserEmail);
router.put("/password/:userId", changeUserPassword);
router.delete("/:userId", deleteUser);

module.exports = router;