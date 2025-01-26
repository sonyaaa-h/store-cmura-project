// import React from 'react'

import CartProduct from "./CartProduct";

const CartProducts = ({ cartProducts, cartProductIncrease, cartProductDecrease }) => {
    return cartProducts.map((product) => (
        <CartProduct
            key={product.ID}
            product={product}
            cartProductIncrease={cartProductIncrease}
            cartProductDecrease={cartProductDecrease}
        />
    ));
};

export default CartProducts;
