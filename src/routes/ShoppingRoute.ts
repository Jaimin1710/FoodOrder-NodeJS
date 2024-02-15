import express from "express";
import {
  GetAvailableOffers,
  GetFoodAvailability,
  GetFoodsIn30Min,
  GetRestaurantByID,
  GetTopRestaurants,
  SearchFoods,
} from "../controller/ShoppingController";

const router = express.Router();
// food availablity
router.get("/:pincode", GetFoodAvailability);
// top restaurant
router.get("/top-restaurant/:pincode", GetTopRestaurants);
// food available in 30 min
router.get("/food-in-30-min/:pincode", GetFoodsIn30Min);
//search food
router.get("/search/:pincode", SearchFoods);
//search restaurant by id
router.get("/restaurant/:id", GetRestaurantByID);

//get offers
router.get("/offers/:pincode", GetAvailableOffers);

export { router as ShoppingRoute };
