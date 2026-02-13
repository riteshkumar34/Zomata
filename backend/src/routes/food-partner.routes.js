const express= require('express');
const foodPartnerController= require("../controllers/food-partner.controller");
const {authFoodPartnerMiddleware,authUserMiddleware}=require("../middlewares/authFoodPartner.middleware");

const router=express.Router();

router.get("/:id",authUserMiddleware,foodPartnerController.getFoodPartnerById)

module.exports=router;