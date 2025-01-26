// import React from 'react'

const FilteredProducts = ({product, addToCart}) => {
    const handleAddToCart=()=>{
        addToCart(product);
    }
    

    return (
        <div className='product'>
            <div className='product-img'>
                <img src={product.image} alt="product-img"/>
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
    )
}

export default FilteredProducts
