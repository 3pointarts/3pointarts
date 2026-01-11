import { useState } from 'react';
import './admin.css';

export default function AdminProducts() {
    const [productTab, setProductTab] = useState('product');

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
                                    <th>Sold</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><div className="img-placeholder"></div></td>
                                    <td>iPhone 13 Pro Max</td>
                                    <td>Electronics</td>
                                    <td>$1,099</td>
                                    <td>120</td>
                                    <td>50</td>
                                    <td>
                                        <button className="btn-small" style={{ color: 'blue', borderColor: 'blue' }}>Edit</button>
                                        <button className="btn-small" style={{ marginLeft: '5px', color: 'red', borderColor: 'red' }}>Delete</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><div className="img-placeholder"></div></td>
                                    <td>Sony WH-1000XM4</td>
                                    <td>Electronics</td>
                                    <td>$349</td>
                                    <td>45</td>
                                    <td>100</td>
                                    <td>
                                        <button className="btn-small" style={{ color: 'blue', borderColor: 'blue' }}>Edit</button>
                                        <button className="btn-small" style={{ marginLeft: '5px', color: 'red', borderColor: 'red' }}>Delete</button>
                                    </td>
                                </tr>
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
                            {['Electronics', 'Fashion', 'Home & Garden', 'Toys'].map((category) => (
                                <div className="category-card" key={category}>
                                    <div className="category-img-placeholder"></div>
                                    <h3>{category}</h3>
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
