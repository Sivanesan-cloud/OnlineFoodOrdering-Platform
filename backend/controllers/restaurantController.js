import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import APIFeatures from "../utils/apiFeatures.js";
import Restaurant from "../models/restaurant.js";

// get all restaurants
export const getAllRestaurants = catchAsyncErrors(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Restaurant.find(), req.query).search().sort();

    const restaurants = await apiFeatures.query;
    res.status(200).json({
        status: "Success",
        count: restaurants.length,
        restaurant: restaurants
    });
});

// get restaurants by its id
export const getRestaurant = catchAsyncErrors(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.storeId);

    if (!restaurant) {
        return next(new ErrorHandler("No Restaurant found with the ID", 404));
    }

    res.status(200).json({
        status: "Success",
        data: restaurant
    });
});

// update
export const createRestaurant = catchAsyncErrors(async (req, res, next) => {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({
        status: "success",
        data: restaurant,
    });
});

export const deleteRestaurant = catchAsyncErrors(async (req, res, next) => {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.storeId);

    if (!restaurant)
        return next(new ErrorHandler("No document found with that ID", 404));

    res.status(204).json({
        status: "success",
    });
});