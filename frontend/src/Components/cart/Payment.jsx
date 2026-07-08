import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign, faLock } from "@fortawesome/free-solid-svg-icons";
import { payment } from "../../redux/actions/orderActions";
import "./Payment.css";

const DELIVERY_FEE = 40;
const TAX_RATE = 0.05; // 5%

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, restaurant } = useSelector((state) => state.cart);

  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.foodItem.price,
    0
  );
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + DELIVERY_FEE + taxes;
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handlePay = () => {
    dispatch(payment(cartItems, restaurant));
  };

  const paymentMethods = [
    {
      id: "upi",
      label: "UPI",
      subtitle: "Pay via Google Pay, PhonePe, Paytm and more",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="#2d7a50" strokeWidth="1.5" fill="none"/>
          <line x1="2" y1="9" x2="22" y2="9" stroke="#2d7a50" strokeWidth="1.5"/>
          <line x1="6" y1="13" x2="10" y2="13" stroke="#2d7a50" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: "card",
      label: "Credit / debit card",
      subtitle: "Visa, Mastercard, RuPay accepted",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="#555" strokeWidth="1.5" fill="none"/>
          <line x1="2" y1="9" x2="22" y2="9" stroke="#555" strokeWidth="1.5"/>
          <rect x="5" y="12" width="5" height="3" rx="1" fill="#555"/>
        </svg>
      ),
    },
    {
      id: "netbanking",
      label: "Net banking",
      subtitle: "Pay directly from your bank account",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: "wallet",
      label: "Wallet",
      subtitle: "Amazon Pay, Mobikwik and other wallets",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="14" rx="2" stroke="#555" strokeWidth="1.5" fill="none"/>
          <path d="M16 13a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" fill="#555"/>
          <path d="M2 10h20" stroke="#555" strokeWidth="1.5"/>
          <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" stroke="#555" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      id: "cod",
      label: "Cash on delivery",
      subtitle: "Pay in cash when your order arrives",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#555" strokeWidth="1.5" fill="none"/>
          <path d="M12 7v1m0 8v1M9.5 9.5C9.5 8.7 10.6 8 12 8s2.5.7 2.5 1.5-1.1 1.3-2.5 1.5c-1.4.2-2.5.8-2.5 1.5S10.6 14 12 14s2.5-.7 2.5-1.5" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  if (cartItems.length === 0) {
    return (
      <div className="payment-empty">
        <h2>Your cart is empty</h2>
        <button className="payment-back-btn" onClick={() => navigate("/")}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <h1 className="payment-title">Payment method</h1>
      <p className="payment-subtitle">Choose how you'd like to pay for your order.</p>

      <p className="payment-select-label">Select a payment method</p>

      <div className="payment-methods">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-method-card ${selectedMethod === method.id ? "selected" : ""}`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <div className="payment-method-left">
              <span className="payment-method-icon">{method.icon}</span>
              <div className="payment-method-info">
                <span className="payment-method-label">{method.label}</span>
                <span className="payment-method-sub">{method.subtitle}</span>
              </div>
            </div>
            <div
              className={`payment-radio ${selectedMethod === method.id ? "radio-active" : ""}`}
            />

            {/* UPI input — shown only when UPI is selected */}
            {method.id === "upi" && selectedMethod === "upi" && (
              <div className="upi-input-wrapper">
                <input
                  type="text"
                  className="upi-input"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="payment-summary-card">
        <h3 className="summary-title">Order summary</h3>

        <div className="summary-row">
          <span>Items ({itemCount})</span>
          <span>
            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" /> {subtotal.toFixed(0)}
          </span>
        </div>

        <div className="summary-row">
          <span>Delivery</span>
          <span>
            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" /> {DELIVERY_FEE}
          </span>
        </div>

        <div className="summary-row">
          <span>Taxes</span>
          <span>
            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" /> {taxes}
          </span>
        </div>

        <div className="summary-divider" />

        <div className="summary-row summary-total">
          <span>Total</span>
          <span>
            <FontAwesomeIcon icon={faIndianRupeeSign} size="sm" /> {total}
          </span>
        </div>

        <button className="pay-btn" onClick={handlePay}>
          Pay ₹ {total}
        </button>

        <p className="payment-secure-note">
          <FontAwesomeIcon icon={faLock} size="xs" /> Payments are encrypted and secure
        </p>
      </div>
    </div>
  );
};

export default Payment;
