// import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../config/Config";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const history = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // console.log(email, password);

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                // console.log(res);
                setSuccess("Login successful.");
                setEmail("");
                setPassword("");
                setError("");
                setTimeout(() => {
                    setSuccess("");
                    history("/");
                }, 1000);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <div className="container">
            <br />
            <br />
            <h1>Login</h1>
            <hr />
            {success && (
                <>
                    <div className="success-msg">{success}</div>
                    <br />
                </>
            )}
            <form className="form-group" autoComplete="off" onSubmit={handleLogin}>
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
                        Dont have an account - Sign up
                        <Link to="/signup" className="link">
                            {" "}
                            here
                        </Link>
                    </span>
                    <button type="submit" className="btn btn-success btn-md">
                        Login
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

export default Login;
