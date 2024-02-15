"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VandorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.VandorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + '_' + file.originalname);
    }
});
const images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
const coverimages = (0, multer_1.default)({ storage: imageStorage }).array('coverimages', 10);
router.post('/login', controller_1.VandorLogin);
router.use(middleware_1.Authenticate);
router.get('/profile', controller_1.GetVandorProfile);
router.patch('/profile', controller_1.UpdateVandorProfile);
router.put('/coverimage', coverimages, controller_1.UpdateVandorCoverImage);
router.patch('/service', controller_1.UpdateVandorService);
router.post('/food', images, controller_1.AddFood);
router.get('/foods', controller_1.GetFoods);
// order
router.get('/orders', controller_1.GetCurrentOrders);
router.put('/order/:id/process', controller_1.ProcessOrder);
router.get('/order/:id', controller_1.GetOrdersDetails);
// offers
router.get('/offers', controller_1.GetOffers);
router.post('/offer', controller_1.AddOffer);
router.put('/offer/:id', controller_1.EditOffer);
//# sourceMappingURL=VandorRoute.js.map