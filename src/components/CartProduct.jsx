// import React from 'react'
import s from "../css/Home.module.css";
import { auth, db } from "../config/Config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore"; 

const CartProduct = ({ product, cartProductIncrease, cartProductDecrease }) => {
    const handleCartProductIncrease = () => {
        cartProductIncrease(product);
    };

    const handleCartProductDecrease = () => {
        cartProductDecrease(product);
    };

    const handleCartProductDelete = (product) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Створюємо посилання на документ продукту в колекції "Cart"
                    const productRef = doc(db, "Cart", user.uid, "items", product.ID);
                    await deleteDoc(productRef); // Видаляємо документ
                    console.log("Product deleted from cart");
                } catch (error) {
                    console.error("Error deleting product: ", error);
                }
            } else {
                console.log("User is not authenticated");
            }
        });
    };

    return (
        <div className="product-cart">
            <div className="product-img-cart">
                <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info-cart">
            <div className="product-text title-cart">{product.title}</div>
            {/* <div className="product-text description">{product.description}</div> */}
            <div className="product-text price-cart">Price: ${product.price}</div>
            </div>
            <span className="product-qty">Quantity:</span>
            <div className="product-text quantity-box">
                <div className="action-btns minus" onClick={handleCartProductDecrease}>
                    <img
                        className={s.icon}
                        src="https://img.icons8.com/pulsar-color/48/minus-math.png"
                        alt="minus-math"
                    />
                </div>
                <div>{product.qty}</div>
                <div className="action-btns plus" onClick={handleCartProductIncrease}>
                    <img
                        className={s.icon}
                        src="https://img.icons8.com/pulsar-color/48/plus-math.png"
                        alt="plus-math"
                    />
                </div>
            </div>
            <div className="product-text cart-price">Total price: ${product.TotalPrice}</div>
            <div
                className="btn btn-danger cart-btn delete"
                onClick={() => handleCartProductDelete(product)}
            >
                Delete
            </div>
        </div>
    );
};

export default CartProduct;
