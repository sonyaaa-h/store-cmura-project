// import React from 'react'

// import { Button } from "react-bootstrap";
import { useState } from "react";
import { storage, db } from "../config/Config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import e from "cors";

const AddProducts = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    const [imageError, setImageError] = useState("");

    const [successMsg, setSuccessMsg] = useState("");
    const [uploadError, setUploadError] = useState("");

    const types = ["image/png", "image/jpeg", "image/jpg", "image/PNG"];

    const handleProductImg = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile && types.includes(selectedFile.type)) {
                setImage(selectedFile);
                setImageError("");
            } else {
                setImage(null);
                setImageError("Please select an image file (png or jpeg)");
            }
        } else {
            console.log("Please select an image file (png or jpeg)");
        }
    };

    const handleAddProducts = (e) => {
        e.preventDefault();
    
        if (!title || !price || !description || !image) {
            setUploadError("All fields are required, including an image.");
            return;
        }
    
        // Референс до файлу у Firebase Storage
        const storageRef = ref(storage, `product-images/${image.name}`);
    
        // Завантаження файлу
        const uploadTask = uploadBytesResumable(storageRef, image);
    
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                console.log(`Upload progress: ${progress}%`);
            },
            (error) => {
                setUploadError(`Upload error: ${error.message}`);
            },
            async () => {
                // Отримуємо URL завантаженого файлу
                try {
                    const url = await getDownloadURL(storageRef);
    
                    // Додаємо продукт у Firestore
                    await addDoc(collection(db, "products"), {
                        title,
                        price,
                        description,
                        image: url,
                    });
    
                    setSuccessMsg("Product uploaded successfully!");
                    setTitle("");
                    setPrice(0);
                    setDescription("");
                    document.getElementById("file").value = ""; // Очищення файлу
                    setImage(null);
                    setImageError("");
                    setUploadError("");
    
                    setTimeout(() => {
                        setSuccessMsg("");
                    }, 2000);
                } catch (error) {
                    setUploadError(`Error adding product: ${error.message}`);
                }
            }
        );
    };

    return (
        <div className="container">
            <br></br>
            <br></br>
            <h1>Add Products</h1>
            <hr></hr>
            {successMsg && (
                <>
                    <div className="success-msg">{successMsg}</div>
                    <br></br>
                </>
            )}
            <form
                autoComplete="off"
                className="form-group"
                onSubmit={handleAddProducts}
            >
                <label>Product Title</label>
                <input
                    type="text"
                    className="form-control"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                ></input>
                <br></br>
                <label>Product Description</label>
                <input
                    type="text"
                    className="form-control"
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                ></input>
                <br></br>
                <label>Product Price</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                ></input>
                <br></br>
                <label>Upload Product Image</label>
                <input
                    type="file"
                    id="file"
                    className="form-control"
                    required
                    onChange={handleProductImg}
                ></input>

                {imageError && (
                    <>
                        <br></br>
                        <div className="error-msg">{imageError}</div>
                    </>
                )}
                <br></br>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="btn btn-success btn-md">
                        SUBMIT
                    </button>
                </div>
            </form>
            {uploadError && (
                <>
                    <br></br>
                    <div className="error-msg">{uploadError}</div>
                </>
            )}
        </div>
    );
};

export default AddProducts;
