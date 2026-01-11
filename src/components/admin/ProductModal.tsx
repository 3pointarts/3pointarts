import React, { useEffect } from 'react';
import { CommonModal } from '../CommonModal';
import useAdminProductStore from '../../state/admin/AdminProductStore';
import { Status } from '../../core/enum/Status';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEdit?: boolean;
    editId?: number;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, isEdit = false, editId }) => {
    const store = useAdminProductStore();

    // Reset form when opening in add mode
    useEffect(() => {
        if (isOpen && !isEdit) {
            store.setProductTitle('');
            store.setProductAbout('');
            store.setProductPrice(0);
            store.setProductStock(0);
            store.setProductCategoryId(store.categories.length > 0 ? store.categories[0].id : 0);
            store.setProductImage('');
        }
    }, [isOpen, isEdit]);

    // Load data when opening in edit mode
    useEffect(() => {
        if (isOpen && isEdit && editId) {
            const product = store.products.find(p => p.id === editId);
            if (product) {
                store.setProductTitle(product.title);
                store.setProductAbout(product.about);
                store.setProductPrice(product.price);
                store.setProductStock(product.stock);
                store.setProductCategoryId(product.categoryId);
                store.setProductImage(product.images.join(','));
            }
        }
    }, [isOpen, isEdit, editId]);

    const handleSubmit = async () => {
        if (isEdit && editId) {
            await store.updateProduct(editId);
        } else {
            await store.addProduct();
        }
        if (useAdminProductStore.getState().productSubmitStatus === Status.success) {
            onClose();
        }
    };

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Product" : "Add Product"}
            footer={
                <>
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={store.productSubmitStatus === Status.loading}>
                        {store.productSubmitStatus === Status.loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                    </button>
                </>
            }
        >   
            <div className="modal-form-group">
                <label>Title</label>
                <input
                    type="text"
                    value={store.productTitle}
                    onChange={(e) => store.setProductTitle(e.target.value)}
                    placeholder="Product Name"
                />
            </div>
            <div className="modal-form-group">
                <label>Category</label>
                <select
                    value={store.productCategoryId}
                    onChange={(e) => store.setProductCategoryId(Number(e.target.value))}
                >
                    <option value={0} disabled>Select Category</option>
                    {store.categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <div className='row'>
                <div className="col-6 modal-form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        value={store.productPrice}
                        onChange={(e) => store.setProductPrice(Number(e.target.value))}
                        placeholder="0.00"
                    />
                </div>
                <div className="col-6 modal-form-group">
                    <label>Stock</label>
                    <input
                        type="number"
                        value={store.productStock}
                        onChange={(e) => store.setProductStock(Number(e.target.value))}
                        placeholder="0"
                    />
                </div></div>

            <div className="modal-form-group">
                <label>Images (Comma separated URLs)</label>
                <input
                    type="text"
                    value={store.productImage}
                    onChange={(e) => store.setProductImage(e.target.value)}
                    placeholder="http://example.com/img1.jpg, http://example.com/img2.jpg"
                />
            </div>
            <div className="modal-form-group">
                <label>About</label>
                <textarea
                    value={store.productAbout}
                    onChange={(e) => store.setProductAbout(e.target.value)}
                    placeholder="Product description..."
                />
            </div>
        </CommonModal>
    );
};
