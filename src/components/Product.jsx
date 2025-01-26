// import React from 'react'
// import s from "../css/Home.module.css";

const Product = ({ product, addToCart }) => {
    // console.log(product);

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <div className="product">
            <div className="product-img">
                <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
                <div className="product-text ">{product.title}</div>
                {/* <div className="product-text description">{product.description}</div> */}
                <div className="product-text price">Price: ${product.price}</div>
                <div
                    className="btn btn-danger btn-md cart-btn"
                    onClick={handleAddToCart}
                >
                    Add to cart
                </div>
            </div>
        </div>
    );
};

export default Product;
