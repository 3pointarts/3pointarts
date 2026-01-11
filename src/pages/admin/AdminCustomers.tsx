import { useState } from 'react';
import './admin.css';

export default function AdminCustomers() {
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    return (
        <div className="customers-view">
            <div className="actions-bar" style={{ gap: '10px', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Search customers..." className="search-input" />
                <div className="filters" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="date"
                        className="search-input"
                        style={{ width: 'auto' }}
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    />
                    <span>to</span>
                    <input
                        type="date"
                        className="search-input"
                        style={{ width: 'auto' }}
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    />
                    <button className="btn-primary">Filter</button>
                </div>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Orders</th>
                        <th>Total Spent</th>
                        <th>Join Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="img-placeholder" style={{ borderRadius: '50%' }}></div>
                                <span>Alex Doe</span>
                            </div>
                        </td>
                        <td>alex.doe@example.com</td>
                        <td>+1 234 567 890</td>
                        <td>12</td>
                        <td>$1,240.00</td>
                        <td>Jan 15, 2025</td>
                        <td>
                            <button className="btn-small">View</button>
                            <button className="btn-small" style={{ marginLeft: '5px' }}>Edit</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="img-placeholder" style={{ borderRadius: '50%' }}></div>
                                <span>Sarah Smith</span>
                            </div>
                        </td>
                        <td>sarah.smith@example.com</td>
                        <td>+1 987 654 321</td>
                        <td>5</td>
                        <td>$450.50</td>
                        <td>Feb 20, 2025</td>
                        <td>
                            <button className="btn-small">View</button>
                            <button className="btn-small" style={{ marginLeft: '5px' }}>Edit</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="img-placeholder" style={{ borderRadius: '50%' }}></div>
                                <span>John Brown</span>
                            </div>
                        </td>
                        <td>john.brown@example.com</td>
                        <td>+1 555 123 456</td>
                        <td>1</td>
                        <td>$299.99</td>
                        <td>Mar 10, 2025</td>
                        <td>
                            <button className="btn-small">View</button>
                            <button className="btn-small" style={{ marginLeft: '5px' }}>Edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
