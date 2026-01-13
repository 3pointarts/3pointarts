import { useState, useEffect, useMemo } from 'react';
import './admin.css';
import useAdminAuthStore from '../../state/admin/AdminAuthStore';
import { Status } from '../../core/enum/Status';
import { CustomerViewModal } from '../../components/admin/CustomerViewModal';
import { CustomerEditModal } from '../../components/admin/CustomerEditModal';
import { UserModel } from '../../data/model/UserModel';

export default function AdminCustomers() {
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const { customers, listCustomers, listCustomersStatus } = useAdminAuthStore();

    const [selectedCustomer, setSelectedCustomer] = useState<UserModel | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        listCustomers();
    }, [listCustomers]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            // Search filter
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                customer.name.toLowerCase().includes(searchLower) ||
                customer.email.toLowerCase().includes(searchLower) ||
                customer.phone.toLowerCase().includes(searchLower);

            // Date filter
            let matchesDate = true;
            if (dateRange.start) {
                matchesDate = matchesDate && new Date(customer.createdAt) >= new Date(dateRange.start);
            }
            if (dateRange.end) {
                // Set end date to end of day
                const endDate = new Date(dateRange.end);
                endDate.setHours(23, 59, 59, 999);
                matchesDate = matchesDate && new Date(customer.createdAt) <= endDate;
            }

            return matchesSearch && matchesDate;
        });
    }, [customers, searchTerm, dateRange]);

    if (listCustomersStatus === Status.loading) {
        return <div className="loading">Loading customers...</div>;
    }

    return (
        <div className="customers-view">
            <div className="actions-bar" style={{ gap: '10px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search customers..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                    <button
                        className="btn-secondary"
                        onClick={() => {
                            setSearchTerm('');
                            setDateRange({ start: '', end: '' });
                        }}
                    >
                        Reset
                    </button>
                </div>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Join Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                No customers found.
                            </td>
                        </tr>
                    ) : (
                        filteredCustomers.map((customer) => (
                            <tr key={customer.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className="img-placeholder" style={{ borderRadius: '50%' }}>
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span>{customer.name}</span>
                                    </div>
                                </td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn-small"
                                        onClick={() => {
                                            setSelectedCustomer(customer);
                                            setIsViewModalOpen(true);
                                        }}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="btn-small"
                                        style={{ marginLeft: '5px' }}
                                        onClick={() => {
                                            setSelectedCustomer(customer);
                                            setIsEditModalOpen(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <CustomerViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                customer={selectedCustomer}
            />

            <CustomerEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                customer={selectedCustomer}
            />
        </div>
    );
}
