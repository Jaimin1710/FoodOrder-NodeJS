import express from "express";
import { VandorLogin, GetVandorProfile, UpdateVandorProfile, UpdateVandorService, AddFood, GetFoods, UpdateVandorCoverImage, GetCurrentOrders, ProcessOrder, GetOrdersDetails, GetOffers, AddOffer, EditOffer } from "../controller";
import { Authenticate } from "../middleware";
import multer from "multer";

const router = express.Router();

const imageStorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'images');
    },
    filename:function(req,file,cb){
        cb(null,new Date().getTime()+'_'+file.originalname);
    }
});

const images = multer({storage:imageStorage}).array('images',10);
const coverimages = multer({storage:imageStorage}).array('coverimages',10);

router.post('/login',VandorLogin);

router.use(Authenticate);
router.get('/profile',GetVandorProfile);
router.patch('/profile',UpdateVandorProfile);
router.put('/coverimage',coverimages,UpdateVandorCoverImage);
router.patch('/service',UpdateVandorService);

router.post('/food',images,AddFood);
router.get('/foods',GetFoods);

// order
router.get('/orders',GetCurrentOrders);
router.put('/order/:id/process',ProcessOrder);
router.get('/order/:id',GetOrdersDetails);

// offers
router.get('/offers',GetOffers);
router.post('/offer',AddOffer);
router.put('/offer/:id',EditOffer);

export {router as VandorRoute};