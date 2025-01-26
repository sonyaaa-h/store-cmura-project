import { useState } from "react";
import { storage, db } from "../config/Config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AddProducts = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(""); // Стан для категорії
    const [image, setImage] = useState(null);

    const [imageError, setImageError] = useState("");
    const [uploadError, setUploadError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const types = ["image/png", "image/jpeg", "image/jpg", "image/PNG"];

    const handleProductImg = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            if (types.includes(selectedFile.type)) {
                setImage(selectedFile);
                setImageError("");
            } else {
                setImage(null);
                setImageError("Please select an image file (png or jpeg)");
            }
        }
    };

    const handleAddProducts = (e) => {
        e.preventDefault();

        if (!title || !price || !description || !category || !image) {
            setUploadError("All fields are required, including an image and category.");
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
                        category, // Додаємо категорію
                        image: url,
                    });

                    setSuccessMsg("Product uploaded successfully!");
                    setTitle("");
                    setPrice(0);
                    setDescription("");
                    setCategory(""); // Скидаємо категорію
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
            <br />
            <br />
            <h1>Add Products</h1>
            <hr />
            {successMsg && (
                <>
                    <div className="success-msg">{successMsg}</div>
                    <br />
                </>
            )}
            <form autoComplete="off" className="form-group" onSubmit={handleAddProducts}>
                <label>Product Title</label>
                <input
                    type="text"
                    className="form-control"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <br />
                <label>Product Description</label>
                <input
                    type="text"
                    className="form-control"
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                />
                <br />
                <label>Product Price</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                />
                <br />
                <label>Product Category</label>
                <select
                    className="form-control"
                    required
                    onChange={(e) => setCategory(e.target.value)} // Додаємо обробку категорії
                    value={category}
                >
                    <option value="">Select a Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home-appliances">Home Appliances</option>
                    <option value="books">Books</option>
                    <option value="toys">Toys</option>
                </select>
                <br />
                <label>Upload Product Image</label>
                <input
                    type="file"
                    id="file"
                    className="form-control"
                    required
                    onChange={handleProductImg}
                />
                {imageError && (
                    <>
                        <br />
                        <div className="error-msg">{imageError}</div>
                    </>
                )}
                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-success btn-md">
                        SUBMIT
                    </button>
                </div>
            </form>
            {uploadError && (
                <>
                    <br />
                    <div className="error-msg">{uploadError}</div>
                </>
            )}
        </div>
    );
};

export default AddProducts;
