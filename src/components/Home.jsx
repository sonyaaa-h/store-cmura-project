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

    const [filterProducts, setFilterProducts] = useState([]); // Стейт для фільтруваних продуктів
    const [active, setActive] = useState(""); // Стан для активної категорії
    const [category, setCategory] = useState(""); // Стан для збереження вибраної категорії

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

    const handleClick = (event) => {
        const selectedCategory = event.target.id; // ID обраної категорії
        setActive(selectedCategory);
        setCategory(event.target.textContent); // Текст обраної категорії
        filterFunction(selectedCategory); // Передаємо ID як ключ категорії
    };

    const filterFunction = (category) => {
        if (products.length > 0) {
            // Фільтруємо продукти за категорією
            const filtered = products.filter(
                (product) => product.category === category
            );

            if (filtered.length > 0) {
                setFilterProducts(filtered); // Зберігаємо фільтровані продукти
            } else {
                console.log("No products found for this category");
                setFilterProducts([]); // Очищуємо список, якщо нічого не знайдено
            }
        } else {
            console.log("No products available to filter");
        }
    };

    const returntoAllProducts = () => {
        setActive("");
        setCategory("");
        setFilterProducts([]);
    };

    return (
        <div className={s.wrapper}>
            <Navbar user={user} totalProducts={totalProducts} />
            <br />
            <div className="filter-main-box">
                <div className="filter-box">
                    <h6>Choose a category</h6>
                    <span
                        id="electronics"
                        onClick={handleClick}
                        className={active === "electronics" ? "active" : ""}
                    >
                        Electronics
                    </span>
                    <span
                        id="fashion"
                        onClick={handleClick}
                        className={active === "fashion" ? "active" : ""}
                    >
                        Fashion
                    </span>
                    <span
                        id="home-appliances"
                        onClick={handleClick}
                        className={active === "homeappliances" ? "active" : ""}
                    >
                        Home appliances
                    </span>
                    <span
                        id="books"
                        onClick={handleClick}
                        className={active === "books" ? "active" : ""}
                    >
                        Books
                    </span>
                    <span
                        id="toys"
                        onClick={handleClick}
                        className={active === "toys" ? "active" : ""}
                    >
                        Toys
                    </span>
                </div>

                {filterProducts.length > 0 && (
                    <div className="my-products">
                        <h1 className="text-center">{category}</h1>
                        <a href="#" onClick={returntoAllProducts}>
                            Go to all Products
                        </a>
                        <div className="products-box">
                            {filterProducts.map(
                                (product) => (
                                    (
                                        <FilteredProducts
                                            key={product.ID}
                                            product={product}
                                            addToCart={addToCart}
                                        />
                                    )
                                )
                            )}
                        </div>
                    </div>
                )}
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
