//fetch cart
//Add items
//update quantity
//remove items
//handle loading and  errors

import api from "../../utils/api"
import {
     cartRequest,
    cartSuccess,
    cartFail,
    updateCartSuccess,
    removeCartSuccess,
} from "../slices/cartSlice"
import { toast } from "react-toastify";

//fetch cart items

export const fetchCartItems =() =>async(dispatch) =>{
    try{
       dispatch(cartRequest());

       const {data} = await api.get("/v1/eats/cart/get-cart");

       dispatch(cartSuccess(data.data))
       console.log("CART API", data.data)
    }catch(error){
            // If 404 (no cart yet), just set empty — don't treat as error
            if(error.response?.status === 404){
                dispatch(cartSuccess({ items: [], restaurant: {} }));
            } else {
                dispatch(cartFail(error.response?.data?.message))
            }
    }
}

//add cart items
export const addItemToCart =(foodItemId, restaurantId, quantity) =>async(dispatch) =>{
    try{
         dispatch(cartRequest());

         const{data} = await api.post("/v1/eats/cart/add-to-cart" ,{
            foodItemId,
            restaurantId,
            quantity
         })

         // API returns { cart: { items, restaurant, ... } }
         dispatch(cartSuccess(data.cart))
         toast.success("Item added to cart!");
    }catch(error){
        const errMsg = error.response?.data?.message || "Failed to add item to cart";
        dispatch(cartFail(errMsg))
        toast.error(errMsg);
    }
}

//update cart quantity

export const updateCartQuantity = (foodItemId,quantity) => async(dispatch) =>{
    try{
       const {data} = await api.post("/v1/eats/cart/update-cart-item", {
        foodItemId,
        quantity
       })

       dispatch(updateCartSuccess(data.cart))
    }catch(error){
          const errMsg = error.response?.data?.message || "Failed to update cart quantity";
          dispatch(cartFail(errMsg))
          toast.error(errMsg);
    }
}

//remove item from cart
export const removeItemFromCart = (foodItemId) => async(dispatch) =>{
    try{
        const {data} = await api.delete("/v1/eats/cart/delete-cart-item", {
            data:{ foodItemId }
        })

        dispatch(removeCartSuccess(data))
        toast.success("Item removed from cart!");
    }catch(error){
         const errMsg = error.response?.data?.message || "Failed to remove item from cart";
         dispatch(cartFail(errMsg))
         toast.error(errMsg);
    }
}
