// import React from 'react'
// import { IoHomeOutline } from "react-icons/io5"; // Наприклад, інша іконка

import { Link, useNavigate } from "react-router-dom";
import s from "../css/Home.module.css";
import { auth } from "../config/Config";
import { signOut } from "firebase/auth";

const Navbar = ({ user, totalProducts }) => {
    const history = useNavigate();

    const handleLogout = () => {
        signOut(auth).then(() => {
            history("/login");
        });
    };

    return (
        <div className={s.navbox}>
            <div className={s.leftside}>
                <img
                    className={s.logo}
                    width="48"
                    height="48"
                    src="https://img.icons8.com/pulsar-color/48/shop.png"
                    alt="shop"
                />
            </div>
            <div className={s.rightside}>
                {!user && (
                    <>
                        <Link to="/signup" className={s.navlinks}>
                            SIGN UP
                        </Link>
                        <Link to="/login" className={s.navlinks}>
                            LOGIN
                        </Link>
                    </>
                )}

                {user && (
                    <>
                        <div>
                            <Link to="/" className={s.navlinks}>
                                {user}
                            </Link>
                        </div>
                        <div className="cart-menu-btn">
                            <Link to="/cart" className={s.navlinks}>
                                <img
                                    width="48"
                                    height="48"
                                    src="https://img.icons8.com/pulsar-color/48/add-shopping-cart.png"
                                    alt="add-shopping-cart"
                                />
                                <span className="no-of-products">{totalProducts}</span>
                            </Link>
                        </div>
                        <div className=" logout-btn" onClick={handleLogout}>
                            Logout
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
