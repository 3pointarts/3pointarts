import { useEffect, useState } from 'react';
import useAdminCouponStore from '../../state/admin/AdminCouponStore';
import { CouponType } from '../../core/enum/CouponType';
import { CouponCondition } from '../../core/enum/CouponCondition';
import { Status } from '../../core/enum/Status';
import './admin.css';

export default function AdminCoupons() {
    const {
        coupons,
        status,
        saveStatus,
        loadCoupons,
        deleteCoupon,
        saveCoupon,
        resetForm,
        setFormFromModel,
        formCode, setFormCode,
        formValue, setFormValue,
        formEndDate, setFormEndDate,
        formActive, setFormActive,
        formType, setFormType,
        formCondition, setFormCondition,
        formConditionValue, setFormConditionValue,
        formId
    } = useAdminCouponStore();

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadCoupons();
    }, []);

    const handleAdd = () => {
        resetForm();
        setShowModal(true);
    };

    const handleEdit = (coupon: any) => {
        setFormFromModel(coupon);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        await deleteCoupon(id);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await saveCoupon();
        if (success) {
            setShowModal(false);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="coupons-view">
            <div className="actions-bar">
                <input type="text" placeholder="Search coupons..." className="search-input" />
                <button className="btn-primary" style={{ width: 'max-content' }} onClick={handleAdd}>Add Coupon</button>
            </div>

            {status === Status.loading && <div className="loading">Loading coupons...</div>}

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Value</th>
                        <th>Type</th>
                        <th>Condition</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.map((coupon) => (
                        <tr key={coupon.id}>
                            <td>{coupon.code}</td>
                            <td>
                                {coupon.type === CouponType.percentage ? `${coupon.value}%` : `$${coupon.value}`}
                            </td>
                            <td><span className="badge">{coupon.type}</span></td>
                            <td>{coupon.condition || '-'}</td>
                            <td>{formatDate(coupon.endDate)}</td>
                            <td>
                                <span className={`status-badge ${coupon.active ? 'new' : 'shipped'}`}>
                                    {coupon.active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td>
                                <button
                                    className="btn-small"
                                    style={{ color: 'blue', borderColor: 'blue' }}
                                    onClick={() => handleEdit(coupon)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn-small"
                                    style={{ marginLeft: '5px', color: 'red', borderColor: 'red' }}
                                    onClick={() => handleDelete(coupon.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {coupons.length === 0 && status !== Status.loading && (
                        <tr>
                            <td colSpan={7} style={{ textAlign: 'center' }}>No coupons found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{formId ? 'Edit Coupon' : 'New Coupon'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Coupon Code</label>
                                <input
                                    type="text"
                                    value={formCode}
                                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                                    placeholder="e.g. SUMMER2024"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type</label>
                                    <select
                                        value={formType}
                                        onChange={(e) => setFormType(e.target.value as CouponType)}
                                    >
                                        {Object.values(CouponType).map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Value {formType === CouponType.percentage ? '(%)' : '($)'}</label>
                                    <input
                                        type="number"
                                        value={formValue}
                                        onChange={(e) => setFormValue(Number(e.target.value))}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Condition</label>
                                    <select
                                        value={formCondition || ''}
                                        onChange={(e) => setFormCondition(e.target.value ? e.target.value as CouponCondition : null)}
                                    >
                                        <option value="">None</option>
                                        {Object.values(CouponCondition).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                {formCondition && (
                                    <div className="form-group">
                                        <label>Condition Value</label>
                                        <input
                                            type="number"
                                            value={formConditionValue ?? ''}
                                            onChange={(e) => setFormConditionValue(e.target.value === '' ? null : Number(e.target.value))}
                                            placeholder="Value"
                                            min="0"
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Expiry Date</label>
                                    <input
                                        type="date"
                                        value={formEndDate ? new Date(formEndDate).toISOString().split('T')[0] : ''}
                                        onChange={(e) => setFormEndDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formActive}
                                        onChange={(e) => setFormActive(e.target.checked)}
                                    />
                                    Active
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={saveStatus === Status.loading}
                                >
                                    {saveStatus === Status.loading ? 'Saving...' : 'Save Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
