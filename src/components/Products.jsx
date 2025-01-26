// import React from 'react'
import Product from "./Product";

const Products = ({products, addToCart}) => {
// console.log(products);


    return products.map((product) => (
        <Product key={product.ID} product={product} addToCart={addToCart}/>
    ) )
};

export default Products;
