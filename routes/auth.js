const express = require("express");
const { register, login, logout, currentUser } = require("../controllers/auth");
const { requireSignIn } = require("../middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignIn, currentUser);

module.exports = router;
