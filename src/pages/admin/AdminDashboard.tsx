import { useState } from 'react';
import './admin.css';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminCoupons from './AdminCoupons';
import AdminSales from './AdminSales';
import AdminCustomers from './AdminCustomers';
import useAdminAuthStore from '../../state/admin/AdminAuthStore';
import useAdminProductStore from '../../state/admin/AdminProductStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminOrderStore from '../../state/admin/AdminOrderStore';
export default function AdminDashboard() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('dashboard');
    const admin = useAdminAuthStore((state) => state.admin);
    const orderStore = useAdminOrderStore((state) => state);
    const init = useAdminProductStore((state) => state.init);
    const products = useAdminProductStore((state) => state.products);
    const customers = useAdminAuthStore((state) => state.customers);
    const logout = useAdminAuthStore((state) => state.logout);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="dashboard-overview">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">🛍️</div>
                                <div className="stat-info">
                                    <h3>Sales</h3>
                                    <div className="value">{orderStore.totalSale.toFixed(2)}</div>
                                    <div className="trend up">↗ 43.7%</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🆕</div>
                                <div className="stat-info">
                                    <h3>New Orders</h3>
                                    <div className="value">{orderStore.newOrders.length}</div>
                                    <div className="trend up">↗ 12%</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🏗️</div>
                                <div className="stat-info">
                                    <h3>Building Orders</h3>
                                    <div className="value">{orderStore.buildingOrders.length}</div>
                                    <div className="trend normal">− 2%</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">✅</div>
                                <div className="stat-info">
                                    <h3>Completed Orders</h3>
                                    <div className="value">{orderStore.completedOrders.length}</div>
                                    <div className="trend up">↗ 25%</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-info">
                                    <h3>Customers</h3>
                                    <div className="value">{customers.length}</div>
                                    <div className="trend up">↗ 15%</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🏷️</div>
                                <div className="stat-info">
                                    <h3>Products</h3>
                                    <div className="value">{products.length}</div>
                                    <div className="trend normal">− 0%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'orders':
                return <AdminOrders />;
            case 'product':
                return <AdminProducts />;
            case 'coupon':
                return <AdminCoupons />;
            case 'sales':
                return <AdminSales />;
            case 'customers':
                return <AdminCustomers />;
            default:
                return null;
        }
    };

    useEffect(() => {
        init();
        if (!admin) {
            navigate('/admin/login');
        }
    }, []);

    return (
        <div className="admin-dashboard-page">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <img height={50} src="/assets/images/logo.png" alt="3 Point Arts" />
                    <img height={50} src="/assets/images/name_logo.png" alt="3 Point Arts" />

                </div>
                <nav className="sidebar-nav">
                    {[
                        { id: 'dashboard', icon: '⚡', label: 'Dashboard' },
                        { id: 'orders', icon: '📦', label: 'Orders' },
                        { id: 'product', icon: '🏷️', label: 'Product' },
                        { id: 'customers', icon: '👥', label: 'Customers' },
                        { id: 'coupon', icon: '🎫', label: 'Coupon' },
                        { id: 'sales', icon: '📈', label: 'Sales' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <span className="icon">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>
            <main className="main-content">
                <header className="top-header">
                    <h1>Good Morning, {admin?.name || 'Admin'}!</h1>
                    <div className="header-actions">
                        <input type="text" placeholder="Search..." className="search-bar" />
                        <div className="user-profile d-flex align-items-center">
                            <div className="avatar">AD</div>
                            <i className="fa fa-sign-out ms-3 text-danger" style={{ cursor: 'pointer', fontSize: '24px' }} onClick={() => {
                                if (confirm('Are you sure you want to log out?')) {
                                    navigate('/admin/login');
                                    logout();
                                }
                            }}></i>
                        </div>
                    </div>
                </header>
                <div className="content-area">
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}
