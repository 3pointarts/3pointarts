import { useState } from 'react';
import './admin.css';

export default function AdminCoupons() {
    return (
        <div className="coupons-view">
            <div className="actions-bar">
                <input type="text" placeholder="Search coupons..." className="search-input" />
                <button className="btn-primary" style={{ width: 'max-content' }}>Add Coupon</button>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Discount</th>
                        <th>Type</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>SUMMER2025</td>
                        <td>20%</td>
                        <td>Percentage</td>
                        <td>Aug 31, 2025</td>
                        <td><span className="status-badge new">Active</span></td>
                        <td>
                            <button className="btn-small" style={{ color: 'blue', borderColor: 'blue' }}>Edit</button>
                            <button className="btn-small" style={{ marginLeft: '5px', color: 'red', borderColor: 'red' }}>Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>WELCOME10</td>
                        <td>$10.00</td>
                        <td>Fixed Amount</td>
                        <td>Dec 31, 2025</td>
                        <td><span className="status-badge new">Active</span></td>
                        <td>
                            <button className="btn-small" style={{ color: 'blue', borderColor: 'blue' }}>Edit</button>
                            <button className="btn-small" style={{ marginLeft: '5px', color: 'red', borderColor: 'red' }}>Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>FLASH50</td>
                        <td>50%</td>
                        <td>Percentage</td>
                        <td>Oct 24, 2024</td>
                        <td><span className="status-badge shipped">Expired</span></td>
                        <td>
                            <button className="btn-small" style={{ color: 'blue', borderColor: 'blue' }}>Edit</button>
                            <button className="btn-small" style={{ marginLeft: '5px', color: 'red', borderColor: 'red' }}>Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
