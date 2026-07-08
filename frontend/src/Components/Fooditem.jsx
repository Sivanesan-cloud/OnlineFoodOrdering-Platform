import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, updateCartQuantity, removeItemFromCart } from "../redux/actions/cartActions";
import { toast } from "react-toastify";

const Fooditem = ({ fooditem, restaurant }) => {
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  // Find if this item is already in the cart
  const cartItem = cartItems.find((item) => {
    const itemFoodId = item.foodItem?._id || item.foodItem;
    return itemFoodId === fooditem._id;
  });

  const isItemInCart = !!cartItem;
  const currentQty = cartItem ? cartItem.quantity : 0;

  // Add button click — dispatch to backend
  const addToCartHandler = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to cart");
      return;
    }
    dispatch(addItemToCart(fooditem._id, restaurant, 1));
  };

  // Increase quantity — sync to backend
  const increaseQty = () => {
    if (currentQty < fooditem.stock) {
      dispatch(updateCartQuantity(fooditem._id, currentQty + 1));
    } else {
      toast.error("Exceeded stock limit");
    }
  };

  // Decrease quantity — sync to backend
  const decreaseQty = () => {
    if (currentQty > 1) {
      dispatch(updateCartQuantity(fooditem._id, currentQty - 1));
    } else {
      dispatch(removeItemFromCart(fooditem._id));
    }
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded">
        <img
          className="card-img-top mx-auto food-image"
          src={fooditem.images?.[0]?.url || "/images/placeholder.png"}
          alt={fooditem.name}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{fooditem.name}</h5>

          <p className="fooditem_des">{fooditem.description}</p>

          <p className="card-text">
            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
            {fooditem.price}
          </p>

          {/*BUTTON LOGIC */}
          {!isItemInCart ? (
            <button
              type="button"
              id="cart_btn"
              className="btn btn-primary mt-2"
              disabled={fooditem.stock === 0}
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
          ) : (
            <div className="stockCounter d-flex align-items-center mt-2">
              <button
                className="btn btn-danger"
                onClick={decreaseQty}
              >
                -
              </button>

              <input
                type="number"
                className="form-control text-center mx-2"
                value={currentQty}
                readOnly
                style={{ width: "60px" }}
              />

              <button
                className="btn btn-primary"
                onClick={increaseQty}
              >
                +
              </button>
            </div>
          )}

          <hr />

          <p>
            Status:{" "}
            <span
              className={
                fooditem.stock > 0 ? "greenColor" : "redColor"
              }
            >
              {fooditem.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Fooditem;