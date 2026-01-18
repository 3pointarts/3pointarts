import React from 'react';
import { CommonModal } from '../CommonModal';
import { OrderModel } from '../../data/model/OrderModel';

interface OrderViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderModel | null;
}

export const OrderViewModal: React.FC<OrderViewModalProps> = ({ isOpen, onClose, order }) => {
    if (!order) return null;

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Order Details #${order.id}`}
            footer={
                <button className="btn-secondary" onClick={onClose}>Close</button>
            }
        >
            <div className="order-details-grid">
                <div className="detail-section">
                    <h4>Bill To</h4>
                    <p>{order.billTo}</p>
                </div>

                <div className="detail-section">
                    <h4>Contact Info</h4>
                    <p><strong>Name:</strong> {order.contactName}</p>
                    <p><strong>Phone:</strong> {order.contactPhone}</p>
                    <p><strong>Address:</strong> {order.contactAddress}</p>
                </div>

                {order.note && (
                    <div className="detail-section full-width">
                        <h4>Note</h4>
                        <p className="note-text">{order.note}</p>
                    </div>
                )}

                <div className="detail-section full-width">
                    <h4>Products</h4>
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.productVariant?.images?.[0] && (
                                            <img
                                                src={item.productVariant.images[0]}
                                                alt={item.productVariant?.product?.title || 'Unknown Product'}
                                                className="product-thumb"
                                            />
                                        )}
                                    </td>
                                    <td>{item.productVariant?.product?.title + ' - ' + item.productVariant?.color || 'Unknown Product'}</td>
                                    <td>{item.qty}</td>
                                    <td>₹{item.productVariant?.price.toLocaleString()}</td>
                                    <td>₹{((item.productVariant?.price || 0) * item.qty).toLocaleString()}</td>
                                </tr>
                            ))}
                            <tr className="total-row">
                                <td colSpan={4} style={{ textAlign: 'right' }}><strong>Total:</strong></td>
                                <td><strong>₹{order.total.toLocaleString()}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .order-details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .detail-section {
                    background: #f9f9f9;
                    padding: 15px;
                    border-radius: 8px;
                }
                .detail-section h4 {
                    margin-top: 0;
                    margin-bottom: 10px;
                    color: #555;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 5px;
                }
                .detail-section p {
                    margin: 5px 0;
                    font-size: 0.95rem;
                }
                .full-width {
                    grid-column: span 2;
                }
                .note-text {
                    font-style: italic;
                    color: #666;
                }
                .products-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                .products-table th, .products-table td {
                    padding: 10px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }
                .products-table th {
                    background-color: #f1f1f1;
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                .product-thumb {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
                .total-row td {
                    border-top: 2px solid #ddd;
                    background-color: #fff;
                }
            `}</style>
        </CommonModal>
    );
};
