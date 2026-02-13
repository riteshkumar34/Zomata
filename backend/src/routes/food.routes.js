const express = require("express");
const foodController = require("../controllers/food.controller");
const foodPartnerController = require("../controllers/food-partner.controller");
const { authFoodPartnerMiddleware, authUserMiddleware } = require("../middlewares/authFoodPartner.middleware");
const router = express.Router();
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
});

router.post('/', authFoodPartnerMiddleware, upload.single("video"), foodController.createFood);

router.get("/", authUserMiddleware, foodController.getFoodItems);

router.get(
  "/food-partner/:id",
  authUserMiddleware,
  foodPartnerController.getFoodPartnerById
);


router.post('/like',authUserMiddleware,foodController.likeFood)

router.post('/save',authUserMiddleware,foodController.saveFood)

router.get('/save',authUserMiddleware,foodController.getSavedFood)

module.exports = router;
