import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAdminProductStore from '../../state/admin/AdminProductStore';
import { Status } from '../../core/enum/Status';
import { showError } from '../../core/message';
import './admin.css'; // Ensure styles are available

export default function AdminProductForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const store = useAdminProductStore();
    const isEdit = Boolean(id);
    const editId = id ? Number(id) : undefined;

    // Reset form when opening in add mode
    useEffect(() => {
        if (!isEdit) {
            store.setProductTitle('');
            store.setProductAbout('');
            store.setProductPrice(0);
            store.setProductCategoryIds([]);
            store.setProductVariants([]);
        }
    }, [isEdit]);

    // Load data when opening in edit mode
    useEffect(() => {
        if (isEdit && editId) {
            // Ensure products are loaded if refreshing the page directly
            if (store.products.length === 0) {
                store.init().then(() => {
                    loadProductData(editId);
                });
            } else {
                loadProductData(editId);
            }
        }
    }, [isEdit, editId, store.products.length]);

    const loadProductData = (productId: number) => {
        const product = store.products.find(p => p.id === productId);
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
    };

    const handleSubmit = async () => {
        if (store.productVariants.length > 0) {
            if (isEdit && editId) {
                await store.updateProduct(editId);
            } else {
                await store.addProduct();
            }
            if (useAdminProductStore.getState().productSubmitStatus === Status.success) {
                navigate('/admin/dashboard?tab=product');
            }
        } else {
            showError('Please add at least one variant.');
        }
    };

    return (
        <div className="admin-page-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>
                <button className="btn-secondary" onClick={() => navigate('/admin/dashboard?tab=product')}>Back to Dashboard</button>
            </div>

            <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div className="form-group mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={store.productTitle}
                        onChange={(e) => store.setProductTitle(e.target.value)}
                        placeholder="Product Name"
                    />
                </div>

                <div className="form-group mb-3">
                    <label className="form-label">About</label>
                    <textarea
                        className="form-control"
                        rows={4}
                        value={store.productAbout}
                        onChange={(e) => store.setProductAbout(e.target.value)}
                        placeholder="Product description..."
                    />
                </div>

                <div className="form-group mb-3">
                    <label className="form-label">Base Price</label>
                    <input
                        type="number"
                        className="form-control"
                        value={store.productPrice}
                        onChange={(e) => store.setProductPrice(Number(e.target.value))}
                        placeholder="0.00"
                    />
                </div>

                <div className="form-group mb-3">
                    <label className="form-label">Categories</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px' }}>
                        {store.categories.map(cat => (
                            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', border: '1px solid #eee', padding: '5px 10px', borderRadius: '20px' }}>
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

                <div className="form-group mb-3">
                    <label className="form-label" style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Variants</label>
                    {store.productVariants.map((variant, index) => (
                        <div key={index} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                            <div className="row mb-2">
                                <div className="col-md-6 mb-2">
                                    <label className="form-label small">Color Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={variant.color}
                                        onChange={(e) => store.updateProductVariant(index, 'color', e.target.value)}
                                        placeholder="Red"
                                    />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label small">Color Hex</label>
                                    <input
                                        type="color"
                                        className="form-control form-control-color"
                                        value={variant.colorHex}
                                        onChange={(e) => store.updateProductVariant(index, 'colorHex', e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-6 mb-2">
                                    <label className="form-label small">Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={variant.price}
                                        onChange={(e) => store.updateProductVariant(index, 'price', Number(e.target.value))}
                                    />
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label small">Stock</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={variant.stock}
                                        onChange={(e) => store.updateProductVariant(index, 'stock', Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="mb-2">
                                <label className="form-label small">Images (Comma separated URLs)</label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    value={variant.images}
                                    onChange={(e) => store.updateProductVariant(index, 'images', e.target.value)}
                                    placeholder="http://example.com/img1.jpg,http://example.com/img2.jpg"
                                />
                            </div>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => store.removeProductVariant(index)}>Remove Variant</button>
                        </div>
                    ))}
                    <button className="btn btn-outline-primary w-100" onClick={store.addProductVariant}>+ Add Variant</button>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button className="btn-secondary" onClick={() => navigate('/admin/dashboard?tab=product')}>Cancel</button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={store.productSubmitStatus === Status.loading}>
                        {store.productSubmitStatus === Status.loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
                    </button>
                </div>
            </div>
        </div>
    );
};
