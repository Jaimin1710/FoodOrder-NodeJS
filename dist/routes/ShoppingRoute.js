"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const ShoppingController_1 = require("../controller/ShoppingController");
const router = express_1.default.Router();
exports.ShoppingRoute = router;
// food availablity
router.get("/:pincode", ShoppingController_1.GetFoodAvailability);
// top restaurant
router.get("/top-restaurant/:pincode", ShoppingController_1.GetTopRestaurants);
// food available in 30 min
router.get("/food-in-30-min/:pincode", ShoppingController_1.GetFoodsIn30Min);
//search food
router.get("/search/:pincode", ShoppingController_1.SearchFoods);
//search restaurant by id
router.get("/restaurant/:id", ShoppingController_1.GetRestaurantByID);
//get offers
router.get("/offers/:pincode", ShoppingController_1.GetAvailableOffers);
//# sourceMappingURL=ShoppingRoute.js.map