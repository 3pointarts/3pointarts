import { useState } from 'react';
import './admin.css';

export default function AdminOrders() {
    const [orderStatus, setOrderStatus] = useState('new');

    return (
        <div className="orders-view">
            <div className="tabs-header">
                {['new', 'building', 'shipped', 'delivered'].map((status) => (
                    <button
                        key={status}
                        className={`tab-btn ${orderStatus === status ? 'active' : ''}`}
                        onClick={() => setOrderStatus(status)}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                <h3>{orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)} Orders</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#ORD-001</td>
                            <td>Alex Doe</td>
                            <td>Oct 24, 2025</td>
                            <td>$124.00</td>
                            <td><span className={`status-badge ${orderStatus}`}>{orderStatus}</span></td>
                            <td>
                                <button className="btn-small">View</button>
                                {orderStatus === 'new' && <button className="btn-small" style={{ marginLeft: '5px' }}>Build</button>}
                                {orderStatus === 'building' && <button className="btn-small" style={{ marginLeft: '5px' }}>Packed</button>}
                                {orderStatus === 'shipped' && <button className="btn-small" style={{ marginLeft: '5px' }}>Delivered</button>}
                            </td>
                        </tr>
                        {/* Mock data rows */}
                        <tr>
                            <td>#ORD-002</td>
                            <td>Sarah Smith</td>
                            <td>Oct 23, 2025</td>
                            <td>$45.50</td>
                            <td><span className={`status-badge ${orderStatus}`}>{orderStatus}</span></td>
                            <td>
                                <button className="btn-small">View</button>
                                {orderStatus === 'new' && <button className="btn-small" style={{ marginLeft: '5px' }}>Build</button>}
                                {orderStatus === 'building' && <button className="btn-small" style={{ marginLeft: '5px' }}>Packed</button>}
                                {orderStatus === 'shipped' && <button className="btn-small" style={{ marginLeft: '5px' }}>Delivered</button>}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
