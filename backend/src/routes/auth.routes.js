const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout",authController.logout);


router.post('/food-partner/register',authController.registerFoodPartner)
router.post('/food-partner/login',authController.loginFoodPartner)
router.get('/food-partner/logout',authController.loginFoodPartner)

module.exports = router;
