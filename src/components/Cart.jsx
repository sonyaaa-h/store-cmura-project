// import React from 'react'

import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { auth, db } from "../config/Config";
import { onAuthStateChanged } from "firebase/auth";
import {
    doc,
    getDoc,
    collection,
    onSnapshot,
    setDoc,
} from "firebase/firestore";
import CartProducts from "./CartProducts";
import StripeCheckout from "react-stripe-checkout";

const Cart = () => {
    const [user, setUser] = useState(null);

    const [totalProducts, setTotalProducts] = useState(0);

    const [cartProducts, setCartProducts] = useState([]);
    let Product;

    useEffect(() => {
        // Викликаємо onAuthStateChanged для перевірки стану авторизації
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // Отримуємо дані користувача з Firestore
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUser(userDoc.data().name); // Зберігаємо ім'я користувача
                    } else {
                        console.log("User document not found!");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setUser(null); // Якщо користувач не авторизований
            }
        });

        // Відписка при анмаунті компонента
        return () => unsubscribe();
    }, []); // Запуск лише один раз при монтуванні компонента

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Використовуємо doc() для створення правильного посилання на колекцію
                const cartRef = collection(db, "Cart", user.uid, "items");

                // Слухаємо зміни в колекції Cart для конкретного користувача
                onSnapshot(cartRef, (snapshot) => {
                    const newCartProducts = snapshot.docs.map((doc) => ({
                        ID: doc.id,
                        ...doc.data(),
                    }));
                    setCartProducts(newCartProducts); // Оновлюємо стани з новими даними
                });
            } else {
                console.log("User is not logged in.");
            }
        });
    }, []);

    // console.log(cartProducts);

    //cart +

    const cartProductIncrease = (product) => {
        // console.log(product);
        Product = product;
        Product.qty += 1;
        Product.TotalPrice = Product.price * Product.qty;

        onAuthStateChanged(auth, (user) => {
            if (user) {
                const cartRef = doc(db, "Cart", user.uid, "items", product.ID);
                setDoc(cartRef, Product).then(() => {
                    console.log("Product added to cart");
                });
            } else {
                console.log("User is not logged in.");
            }
        });
    };

    //cart -

    const cartProductDecrease = (product) => {
        Product = product;
        if (Product.qty > 1) {
            Product.qty -= 1;
            Product.TotalPrice = Product.price * Product.qty;

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const cartRef = doc(db, "Cart", user.uid, "items", product.ID);
                    setDoc(cartRef, Product).then(() => {
                        console.log("Product decreased to cart");
                    });
                } else {
                    console.log("User is not logged in.");
                }
            });
        }
    };

    //qty

    const qty = cartProducts.map((product) => product.qty);

    const reduceQty = (acc, num) => acc + num;
    const totalQty = qty.reduce(reduceQty, 0);
    console.log(totalQty);

    // totalPrice

    const price = cartProducts.map((product) => product.TotalPrice);

    const reducePrice = (acc, num) => acc + num;
    const totalPrice = price.reduce(reducePrice, 0);
    console.log(totalPrice);

    //totalProducts

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const cartRef = collection(db, "Cart", user.uid, "items");

                // Слухаємо зміни в колекції Cart
                const unsubscribeSnapshot = onSnapshot(cartRef, (snapshot) => {
                    const qty = snapshot.docs.length; // Кількість документів у кошику
                    setTotalProducts(qty); // Оновлюємо кількість продуктів
                });

                // Повертаємо функцію для відписки від onSnapshot
                return () => unsubscribeSnapshot();
            }
        });

        // Повертаємо функцію для відписки від onAuthStateChanged
        return () => unsubscribe();
    }, []);

    //token

    const handleToken = (token) => {
        console.log(token);
    };

    return (
        <div>
            <Navbar user={user} totalProducts={totalProducts} />
            <br />
            {cartProducts.length > 0 && (
                <div className="container-fluid">
                    <h1 className="text-center">Cart</h1>
                    <div className="products-box">
                        <CartProducts
                            cartProducts={cartProducts}
                            cartProductIncrease={cartProductIncrease}
                            cartProductDecrease={cartProductDecrease}
                        />
                    </div>
                    <div className="summary-box">
                        <h5>Cart summary</h5>
                        <br />
                        <div>
                            Total number of products: <span>{totalQty}</span>
                        </div>
                        <div>
                            Total price to Pay: <span>$ {totalPrice}</span>
                        </div>
                        <br />
                        <StripeCheckout 
                        stripeKey="pk_test_51QlGCrCKppE6f0Vf7FPcC7wEVhiSGAE5ucQWIZz1c75tpUBQNmHoIcGRAQREVAwABv1J4qHt3WXTGQQMMDtRhn5q00dSF2P1YQ" 
                        token={handleToken}
                        billingAddress
                        shippingAddress
                        name='All products'
                        amount={totalPrice * 100}
                        />
                    </div>
                </div>
            )}
            {cartProducts.length < 1 && (
                <div className="container-fluid">No products in cart</div>
            )}
        </div>
    );
};

export default Cart;
