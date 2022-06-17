const Router = require("express").Router;
const { getUser, createUser, changeUserProfile, changeUserEmail, changeUserPassword, deleteUser } = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");


const router = new Router();

router.get("/:userId", authMiddleware(), getUser);
router.post("/", authMiddleware(true), createUser);
router.put("/profile/:userId", authMiddleware(), changeUserProfile);
router.put("/email/:userId", authMiddleware(), changeUserEmail);
router.put("/password/:userId", authMiddleware(), changeUserPassword);
router.delete("/:userId", authMiddleware(), deleteUser);

module.exports = router;