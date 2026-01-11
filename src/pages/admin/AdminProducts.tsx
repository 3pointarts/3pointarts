import { useState } from 'react';
import './admin.css';
import useAdminProductStore from '../../state/admin/AdminProductStore';
export default function AdminProducts() {
    const [productTab, setProductTab] = useState('product');
    const products = useAdminProductStore((state) => state.products);
    const categories = useAdminProductStore((state) => state.categories);

    return (
        <div className="products-view">
            <div className="tabs-header">
                {['category', 'product'].map((tab) => (
                    <button
                        key={tab}
                        className={`tab-btn ${productTab === tab ? 'active' : ''}`}
                        onClick={() => setProductTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {productTab === 'product' ? (
                    <>
                        <div className="actions-bar">
                            <input type="text" placeholder="Search products..." className="search-input" />
                            <button className="btn-primary" style={{ width: 'max-content' }}>Add Product</button>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    products.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.images.length > 0 ? <img src={product.images[0]} alt={product.title} className="product-img" style={{ width: '50px', height: '50px', objectFit: 'contain' }} /> : <div className="img-placeholder"></div>}</td>
                                            <td>{product.title}</td>
                                            <td>{categories.find((category) => category.id === product.categoryId)?.name}</td>
                                            <td>${product.price}</td>
                                            <td>{product.stock}</td>
                                            <td>
                                                <button className="btn-small" style={{ color: 'blue', borderColor: 'blue' }}>Edit</button>
                                                <button className="btn-small" style={{ marginLeft: '5px', color: 'red', borderColor: 'red' }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </>
                ) : (
                    <>
                        <div className="actions-bar">
                            <input type="text" placeholder="Search coupons..." className="search-input" />
                            <button className="btn-primary" style={{ width: 'max-content' }}>Add Category</button>
                        </div>
                        <div className="categories-grid">
                            {categories.map((category) => (
                                <div className="category-card" key={category.id}>
                                    {category.image != "" ? <img src={category.image} alt={category.name} className="category-img" style={{ width: '100px', height: '100px', objectFit: 'contain' }} /> : <div className="category-img-placeholder"></div>}
                                    <h3>{category.name}</h3>
                                    <div className="category-actions">
                                        <button className="btn-small" style={{ color: 'blue', borderColor: 'blue' }}>Edit</button>
                                        <button className="btn-small" style={{ marginLeft: '5px', color: 'red', borderColor: 'red' }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
