import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/Config";
import { doc, setDoc } from "firebase/firestore"; // Імпортуємо необхідні функції Firestore

const Signup = () => {
    const history = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignup = (e) => {
        e.preventDefault();

        // Перевірка email та password перед реєстрацією
        console.log("Email:", email);
        console.log("Password:", password);

        // Створення нового користувача
        createUserWithEmailAndPassword(auth, email, password)
            .then((res) => {
                console.log("User created:", res);

                // Додаємо дані користувача в Firestore
                const userRef = doc(db, "users", res.user.uid); // Використовуємо doc() для створення документа
                setDoc(userRef, {
                    name,
                    email,
                    password,
                })
                    .then(() => {
                        setSuccess("User added to firestore.");
                        setName("");
                        setEmail("");
                        setPassword("");
                        setError("");
                        setTimeout(() => {
                            setSuccess("");
                            history("/login");
                        }, 1000);
                    })
                    .catch((error) => {
                        setError(error.message);
                    });
            })
            .catch((error) => {
                console.log("Error details:", error);
                setError(error.message);
            });
    };

    return (
        <div className="container">
            <br />
            <br />
            <h1>Sign up</h1>
            <hr />
            {success && (
                <>
                    <div className="success-msg">{success}</div>
                    <br />
                </>
            )}
            <form className="form-group" autoComplete="off" onSubmit={handleSignup}>
                <label>Name</label>
                <input
                    type="text"
                    className="form-control"
                    required
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <br />
                <label>Email</label>
                <input
                    type="email"
                    className="form-control"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <br />
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <br />
                <div className="btn-box">
                    <span>
                        Already have an account Login
                        <Link to="/login" className="link">
                            {" "}
                            here
                        </Link>
                    </span>
                    <button type="submit" className="btn btn-success btn-md">
                        Sign up
                    </button>
                </div>
            </form>
            {error && (
                <>
                    <br />
                    <div className="error-msg">{error}</div>
                </>
            )}
        </div>
    );
};

export default Signup;
