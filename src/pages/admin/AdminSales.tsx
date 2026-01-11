import { useState } from 'react';
import './admin.css';

export default function AdminSales() {
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [statusFilter, setStatusFilter] = useState('all');

    return (
        <div className="sales-view">
            <div className="actions-bar" style={{ gap: '10px', flexWrap: 'wrap' }}>
                <div className="filters" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="text" placeholder="Search sales..." className="search-input" />
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
                    <select
                        className="search-input"
                        style={{ width: 'auto' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="refunded">Refunded</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Sale ID</th>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#SL-8832</td>
                        <td>#ORD-001</td>
                        <td>Alex Doe</td>
                        <td>$124.00</td>
                        <td>Oct 24, 2025</td>
                        <td><span className="status-badge delivered">Completed</span></td>
                        <td><button className="btn-small">View</button></td>
                    </tr>
                    <tr>
                        <td>#SL-8831</td>
                        <td>#ORD-002</td>
                        <td>Sarah Smith</td>
                        <td>$45.50</td>
                        <td>Oct 23, 2025</td>
                        <td><span className="status-badge delivered">Completed</span></td>
                        <td><button className="btn-small">View</button></td>
                    </tr>
                    <tr>
                        <td>#SL-8830</td>
                        <td>#ORD-003</td>
                        <td>John Brown</td>
                        <td>$299.99</td>
                        <td>Oct 22, 2025</td>
                        <td><span className="status-badge shipped">Pending</span></td>
                        <td><button className="btn-small">View</button></td>
                    </tr>
                    <tr>
                        <td>#SL-8829</td>
                        <td>#ORD-004</td>
                        <td>Emily White</td>
                        <td>$89.00</td>
                        <td>Oct 21, 2025</td>
                        <td><span className="status-badge building">Refunded</span></td>
                        <td><button className="btn-small">View</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
