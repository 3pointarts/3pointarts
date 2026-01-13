import React from 'react';
import { CommonModal } from '../CommonModal';
import { UserModel } from '../../data/model/UserModel';

interface CustomerViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: UserModel | null;
}

export const CustomerViewModal: React.FC<CustomerViewModalProps> = ({ isOpen, onClose, customer }) => {
    if (!customer) return null;

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title="Customer Details"
            footer={
                <button className="btn-secondary" onClick={onClose}>Close</button>
            }
        >
            <div className="customer-details">
                <div className="detail-group">
                    <label>ID</label>
                    <p>#{customer.id}</p>
                </div>
                <div className="detail-group">
                    <label>Name</label>
                    <p>{customer.name}</p>
                </div>
                <div className="detail-group">
                    <label>Email</label>
                    <p>{customer.email}</p>
                </div>
                <div className="detail-group">
                    <label>Phone</label>
                    <p>{customer.phone || 'N/A'}</p>
                </div>
                <div className="detail-group">
                    <label>Role</label>
                    <p>{customer.role}</p>
                </div>
                <div className="detail-group">
                    <label>Joined Date</label>
                    <p>{new Date(customer.createdAt).toLocaleDateString()} {new Date(customer.createdAt).toLocaleTimeString()}</p>
                </div>
            </div>
            <style>{`
                .customer-details {
                    display: grid;
                    gap: 15px;
                }
                .detail-group label {
                    font-weight: 600;
                    font-size: 0.9em;
                    color: #666;
                    display: block;
                    margin-bottom: 4px;
                }
                .detail-group p {
                    margin: 0;
                    font-size: 1.1em;
                }
            `}</style>
        </CommonModal>
    );
};
