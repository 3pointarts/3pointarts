import React, { useEffect } from 'react';
import { CommonModal } from '../CommonModal';
import useAdminProductStore from '../../state/admin/AdminProductStore';
import { Status } from '../../core/enum/Status';
import { showError } from '../../core/message';

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
            store.setProductCategoryIds([]);
            store.setProductVariants([]);
        }
    }, [isOpen, isEdit]);

    // Load data when opening in edit mode
    useEffect(() => {
        if (isOpen && isEdit && editId) {
            const product = store.products.find(p => p.id === editId);
            if (product) {
                store.setProductTitle(product.title);
                store.setProductAbout(product.about);
                store.setProductPrice(product.basePrice);
                store.setProductCategoryIds(product.productCategories.map(c => c.categories.id));
                store.setProductVariants(product.productVariants.map(v => ({
                    id: v.id,
                    color: v.color,
                    colorHex: v.colorHex,
                    price: v.price,
                    stock: v.stock,
                    images: v.images.join(',')
                })));
            }
        }
    }, [isOpen, isEdit, editId]);

    const handleSubmit = async () => {
        if (store.productVariants.length > 0) {

            if (isEdit && editId) {
                await store.updateProduct(editId);
            } else {
                await store.addProduct();
            }
            if (useAdminProductStore.getState().productSubmitStatus === Status.success) {
                onClose();
            }
        } else {
            showError('Please add at least one variant.');
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
                <label>About</label>
                <textarea
                    value={store.productAbout}
                    onChange={(e) => store.setProductAbout(e.target.value)}
                    placeholder="Product description..."
                />
            </div>

            <div className="modal-form-group">
                <label>Base Price</label>
                <input
                    type="number"
                    value={store.productPrice}
                    onChange={(e) => store.setProductPrice(Number(e.target.value))}
                    placeholder="0.00"
                />
            </div>

            <div className="modal-form-group">
                <label>Categories</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {store.categories.map(cat => (
                        <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input
                                type="checkbox"
                                checked={store.productCategoryIds.includes(cat.id)}
                                onChange={() => store.toggleProductCategoryId(cat.id)}
                            />
                            {cat.name}
                        </label>
                    ))}
                </div>
            </div>

            <div className="modal-form-group">
                <label>Variants</label>
                {store.productVariants.map((variant, index) => (
                    <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
                        <div className="row">
                            <div className="col-6 modal-form-group">
                                <label>Color Name</label>
                                <input
                                    type="text"
                                    value={variant.color}
                                    onChange={(e) => store.updateProductVariant(index, 'color', e.target.value)}
                                    placeholder="Red"
                                />
                            </div>
                            <div className="col-6 modal-form-group">
                                <label>Color Hex</label>
                                <input
                                    type="color"
                                    value={variant.colorHex}
                                    onChange={(e) => store.updateProductVariant(index, 'colorHex', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 modal-form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    value={variant.price}
                                    onChange={(e) => store.updateProductVariant(index, 'price', Number(e.target.value))}
                                />
                            </div>
                            <div className="col-6 modal-form-group">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) => store.updateProductVariant(index, 'stock', Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="modal-form-group">
                            <label>Images (Comma separated URLs)</label>
                            <textarea
                                value={variant.images}
                                onChange={(e) => store.updateProductVariant(index, 'images', e.target.value)}
                                placeholder="http://example.com/img1.jpg,http://example.com/img2.jpg"
                            />
                        </div>
                        <button className="btn-secondary" onClick={() => store.removeProductVariant(index)}>Remove Variant</button>
                    </div>
                ))}
                <button className="btn-primary" onClick={store.addProductVariant}>Add Variant</button>
            </div>
        </CommonModal>
    );
};
