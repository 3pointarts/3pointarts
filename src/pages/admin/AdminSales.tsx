import { useState, useEffect, useMemo } from 'react';
import './admin.css';
import useAdminOrderStore from '../../state/admin/AdminOrderStore';
import { Status } from '../../core/enum/Status';
import { OrderStatus } from '../../core/enum/OrderStatus';
import { Link } from 'react-router-dom';

export default function AdminSales() {
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const {
        init,
        initStatus,
        newOrders,
        buildingOrders,
        shippedOrders,
        completedOrders
    } = useAdminOrderStore();

    useEffect(() => {
        init();
    }, [init]);

    const allOrders = useMemo(() => {
        return [
            ...newOrders,
            ...buildingOrders,
            ...shippedOrders,
            ...completedOrders
        ];
    }, [newOrders, buildingOrders, shippedOrders, completedOrders]);

    const filteredOrders = useMemo(() => {
        return allOrders.filter(order => {
            // Search filter
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                order.id.toString().includes(searchLower) ||
                (order.contactName && order.contactName.toLowerCase().includes(searchLower)) ||
                (order.customer?.name && order.customer.name.toLowerCase().includes(searchLower));

            // Status filter
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

            // Date filter
            let matchesDate = true;
            if (dateRange.start) {
                matchesDate = matchesDate && new Date(order.createdAt) >= new Date(dateRange.start);
            }
            if (dateRange.end) {
                const endDate = new Date(dateRange.end);
                endDate.setHours(23, 59, 59, 999);
                matchesDate = matchesDate && new Date(order.createdAt) <= endDate;
            }

            return matchesSearch && matchesStatus && matchesDate;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [allOrders, searchTerm, statusFilter, dateRange]);

    if (initStatus === Status.loading) {
        return <div className="loading">Loading sales data...</div>;
    }

    return (
        <div className="sales-view">
            <div className="actions-bar" style={{ gap: '10px', flexWrap: 'wrap' }}>
                <div className="filters" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search sales..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                        <option value={OrderStatus.new}>New</option>
                        <option value={OrderStatus.building}>Building</option>
                        <option value={OrderStatus.shipped}>Shipped</option>
                        <option value={OrderStatus.delivered}>Delivered</option>
                    </select>
                </div>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.length === 0 ? (
                        <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                                No sales found.
                            </td>
                        </tr>
                    ) : (
                        filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.contactName || order.customer?.name || 'Guest'}</td>
                                <td>₹{order.total.toFixed(2)}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={`status-badge ${order.status}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <Link to={`/admin/orders/${order.id}`} className="btn-small">View Bill</Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
