import Navbar from "./Navbar";
import Products from "./Products";
import s from "../css/Home.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/Config";
import { onAuthStateChanged } from "firebase/auth";
import {
    doc,
    getDoc,
    collection,
    getDocs,
    setDoc,
    onSnapshot,
} from "firebase/firestore"; // Імпортуємо модульні методи Firestore
import FilteredProducts from "./FilteredProducts";

const Home = () => {
    const [user, setUser] = useState(null); // Стан для збереження імені користувача
    const [products, setProducts] = useState([]);
    const [uid, setUid] = useState(null);

    const [totalProducts, setTotalProducts] = useState(0);

    const [filterProducts, setFilterProducts] = useState([]);

    const history = useNavigate();

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

    // console.log("Current user:", user); // Лог для перевірки

    const getProducts = async () => {
        try {
            const products = await getDocs(collection(db, "products"));
            const productList = products.docs.map((product) => {
                const data = product.data();
                return {
                    ...data,
                    ID: product.id,
                };
            });

            setProducts(productList); // Після обробки всіх продуктів
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const addToCart = (product) => {
        if (uid !== null) {
            const productUse = {
                ...product,
                qty: 1,
                TotalPrice: 1 * product.price,
            }; // додаємо кількість та підсумкову ціну

            // Створення посилання на документ в колекції "Cart" для конкретного користувача
            const cartRef = doc(db, "Cart", uid, "items", product.ID);

            setDoc(cartRef, productUse)
                .then(() => {
                    console.log("Product added to cart");
                })
                .catch((error) => {
                    console.error("Error adding product to cart: ", error);
                });
        } else {
            history("/login"); // Перехід на сторінку логіну
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
            } else {
                setUid(null); // Якщо користувач не авторизований
            }
        });

        return () => unsubscribe(); // Очищення підписки при відміні компонента
    }, []);

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

    return (
        <div className={s.wrapper}>
            <Navbar user={user} totalProducts={totalProducts} />
            <br />
            <div className="filter-main-box">
                <div>
                    <h6>Choose a category</h6>
                    <span>Electronics</span>
                    <span>Fashion</span>
                    <span>Home appliances</span>
                    <span>Books</span>
                    <span>Toys</span>
                </div>
                {filterProducts.length > 0 && <FilteredProducts />}
                {filterProducts.length < 1 && (
                    <>
                        {products.length > 0 && (
                            <div className="container-fluid">
                                <h1 className="text-center">All products</h1>
                                <div className="products-box">
                                    <Products products={products} addToCart={addToCart} />
                                </div>
                            </div>
                        )}
                        {products.length < 1 && (
                            <div className="container-fluid">
                                <h1 className="text-center">Please wait...</h1>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
