import React from "react";
import { Link, useMatch } from "react-router-dom";
import Search from "./Search";
import "../../App.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/userActions";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  // Show search bar only on home page and search results page
  const isHome = useMatch("/");
  const isSearch = useMatch("/eats/stores/search/:keyword");
  const showSearch = isHome || isSearch;

  // Get live cart items and user state from Redux store
  const { cartItems } = useSelector((state) => state.cart);
  const { user, loading } = useSelector((state) => state.user);

  // Sum up all quantities of items in the cart for the cart count
  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
  };

  return (
    <>
      <nav className="navbar row sticky-top">
        {/* logo */}
        <div className="col-12 col-md-3">
          <Link to="/">
            <img src="/images/logo.webp" alt="logo" className="logo" />
          </Link>
        </div>

        {/* search bar — only on home/search pages */}
        <div className="col-12 col-md-6 mt-2 mt-md-0">
          {showSearch && <Search />}
        </div>

        {/* Login / User Profile Dropdown */}
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center d-flex align-items-center justify-content-center">
          <Link to="/cart" style={{ textDecoration: "none" }} className="d-flex align-items-center">
            <span className="ml-3" id="cart">
              Cart
            </span>
            <span className="ml-1" id="cart_count">
              {cartCount}
            </span>
          </Link>
          {user ? (
            <div className="ml-4 dropdown d-inline">
              <Link
                to="#!"
                className="btn dropdown-toggle text-white mr-4 d-flex align-items-center"
                type="button"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{ background: "transparent", border: "none", boxShadow: "none" }}
              >
                <figure className="avatar avatar-nav mb-0">
                  <img
                    src={user.avatar?.url || "/images/images.png"}
                    alt={user.name}
                    className="rounded-circle"
                  />
                </figure>
                <span className="text-white">{user.name}</span>
              </Link>
              <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">
                <Link className="dropdown-item" to="/users/me">
                  Profile
                </Link>
                <Link className="dropdown-item" to="/eats/orders/me/myOrders">
                  Orders
                </Link>
                <Link
                  className="dropdown-item text-danger"
                  to="/"
                  onClick={logoutHandler}
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            !loading && (
              <Link to="/users/login" className="material-symbols-outlined web_logo ml-4">
                account_circle
              </Link>
            )
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;