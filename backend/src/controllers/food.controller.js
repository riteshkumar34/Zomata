const foodModel=require("../models/food.model");
const storageService=require("../services/storage.service");
const {v4:uuid}=require("uuid")
const likeModel=require("../models/likes.model")
const saveModel=require("../models/save.model")

async function createFood(req,res){
     console.log(req.foodPartner)

     console.log(req.body)
     console.log(req.file)

     const fileUploadResult=await storageService.uploadFile(req.file.buffer,uuid())

     const foodItem = await foodModel.create({
          name:req.body.name,
          description:req.body.description,
          video:fileUploadResult.url,
          foodPartner:req.foodPartner._id
     })

     res.status(201).json({
          message:"food created successfully",
          food:foodItem
     })
}

async function getFoodItems(req,res){
  const foodItems=await foodModel.find({})
  res.status(200).json({
     message:"Food items fetched successfully",
     foodItems
  })
}

async function likeFood(req, res) {
     try {
          const { foodId } = req.body;

          if (!req.user) {
               return res.status(401).json({
                    message: "User not authenticated"
               });
          }

          const user = req.user;

          if (!foodId) {
               return res.status(400).json({
                    message: "Food ID is required"
               });
          }

          const isAlreadyLiked = await likeModel.findOne({
               user: user._id,
               food: foodId
          });

          // 🔁 Unlike
          if (isAlreadyLiked) {
               await likeModel.deleteOne({
                    user: user._id,
                    food: foodId
               });

               await foodModel.findByIdAndUpdate(foodId, {
                    $inc: { likeCount: -1 }
               });

               return res.status(200).json({
                    like: false
               });
          }

          
          const like = await likeModel.create({
               user: user._id,
               food: foodId
          });

          await foodModel.findByIdAndUpdate(foodId, {
               $inc: { likeCount: 1 }
          });

          return res.status(201).json({
               like: true,
               like
          });

     } catch (error) {
          console.error("LIKE ERROR:", error);
          return res.status(500).json({
               message: "Internal server error"
          });
     }
}


async function saveFood(req, res) {
     try {
          const { foodId } = req.body;

          if (!req.user) {
               return res.status(401).json({
                    message: "User not authenticated"
               });
          }

          const user = req.user;

          if (!foodId) {
               return res.status(400).json({
                    message: "Food ID is required"
               });
          }

          const isAlreadySaved = await saveModel.findOne({
               user: user._id,
               food: foodId
          });

          
          if (isAlreadySaved) {
               await saveModel.deleteOne({
                    user: user._id,
                    food: foodId
               });

               return res.status(200).json({
                    save: false
               });
          }

          
          const save = await saveModel.create({
               user: user._id,
               food: foodId
          });

          return res.status(201).json({
               save: true,
               save
          });

     } catch (error) {
          console.error("SAVE ERROR:", error);
          return res.status(500).json({
               message: "Internal server error"
          });
     }
}



async function getSavedFood(req,res){

     const user=req.user;
     const savedFoods=await saveModel.find({user:user._id}).populate('food');

     if(!savedFoods||savedFoods.length==0){
          return res.status(404).json({message:"No saved foods found"});
     }

     res.status(200).json({
          message:"Saved foods retrieved successfully",
          savedFoods
     });

}
module.exports={createFood,getFoodItems,likeFood,saveFood,getSavedFood}