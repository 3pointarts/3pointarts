import React, { useState, useEffect } from 'react';
import { CommonModal } from '../CommonModal';
import { UserModel } from '../../data/model/UserModel';
import useAdminAuthStore from '../../state/admin/AdminAuthStore';

interface CustomerEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: UserModel | null;
}

export const CustomerEditModal: React.FC<CustomerEditModalProps> = ({ isOpen, onClose, customer }) => {
    const { updateCustomer } = useAdminAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (customer) {
            setName(customer.name);
            setEmail(customer.email);
            setPhone(customer.phone);
        }
    }, [customer]);

    const handleSubmit = async () => {
        if (!customer) return;
        setLoading(true);
        await updateCustomer(customer.id, { name, email, phone });
        setLoading(false);
        onClose();
    };

    if (!customer) return null;

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Customer"
            footer={
                <>
                    <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </>
            }
        >
            <div className="modal-form-group">
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Customer Name"
                />
            </div>
            <div className="modal-form-group">
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                />
            </div>
            <div className="modal-form-group">
                <label>Phone</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                />
            </div>
        </CommonModal>
    );
};
