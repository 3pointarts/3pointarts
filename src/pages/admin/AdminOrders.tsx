import { useState, useEffect } from 'react';
import './admin.css';
import useAdminOrderStore from '../../state/admin/AdminOrderStore';
import { OrderStatus } from '../../core/enum/OrderStatus';
import { Status } from '../../core/enum/Status';
import { Link } from 'react-router-dom';
import { OrderViewModal } from '../../components/admin/OrderViewModal';
import { OrderModel } from '../../data/model/OrderModel';

export default function AdminOrders() {
    const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.new);
    const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const {
        init,
        initStatus,
        updateOrderStatus,
        newOrders,
        buildingOrders,
        shippedOrders,
        completedOrders
    } = useAdminOrderStore();

    useEffect(() => {
        init();
    }, [init]);

    const getOrders = () => {
        switch (activeTab) {
            case OrderStatus.new: return newOrders;
            case OrderStatus.building: return buildingOrders;
            case OrderStatus.shipped: return shippedOrders;
            case OrderStatus.delivered: return completedOrders;
            default: return [];
        }
    };

    const handleAction = async (id: number) => {
        let nextStatus: OrderStatus | null = null;
        switch (activeTab) {
            case OrderStatus.new: nextStatus = OrderStatus.building; break;
            case OrderStatus.building: nextStatus = OrderStatus.shipped; break;
            case OrderStatus.shipped: nextStatus = OrderStatus.delivered; break;
        }

        if (nextStatus) {
            await updateOrderStatus(id, nextStatus);
        }
    };

    const getActionButtonText = () => {
        switch (activeTab) {
            case OrderStatus.new: return 'Build';
            case OrderStatus.building: return 'Pack & Ship';
            case OrderStatus.shipped: return 'Mark Delivered';
            default: return '';
        }
    };

    if (initStatus === Status.loading) {
        return <div className="loading">Loading orders...</div>;
    }

    return (
        <div className="orders-view">
            <div className="tabs-header">
                {[OrderStatus.new, OrderStatus.building, OrderStatus.shipped, OrderStatus.delivered].map((status) => (
                    <button
                        key={status}
                        className={`tab-btn ${activeTab === status ? 'active' : ''}`}
                        onClick={() => setActiveTab(status)}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders</h3>
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
                        {getOrders().length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No orders found in this category.
                                </td>
                            </tr>
                        ) : (
                            getOrders().map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>
                                        <div>{order.contactName}</div>
                                        <div style={{ fontSize: '0.8em', color: '#666' }}>{order.contactPhone}</div>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>₹{order.total.toLocaleString()}</td>
                                    <td><span className={`status-badge ${activeTab}`}>{activeTab}</span></td>
                                    <td>
                                        <button
                                            className="btn-small"
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setIsViewModalOpen(true);
                                            }}
                                        >
                                            View
                                        </button>
                                        <Link to={`/order/${order.id}`} target="_blank" className="btn-small" style={{ marginLeft: '5px' }}>Invoice</Link>
                                        {activeTab !== OrderStatus.delivered && (
                                            <button
                                                className="btn-small"
                                                style={{ marginLeft: '5px', backgroundColor: '#e7f3ff', color: '#0066c0' }}
                                                onClick={() => handleAction(order.id)}
                                            >
                                                {getActionButtonText()}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <OrderViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    );
}
