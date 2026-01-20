import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import useAdminProductStore from '../../state/admin/AdminProductStore';
// import { ProductModal } from '../../components/admin/ProductModal'; // No longer used
import { CategoryModal } from '../../components/admin/CategoryModal';
import { ConfirmModal } from '../../components/ConfirmModal';

export default function AdminProducts() {
    const navigate = useNavigate();
    const [productTab, setProductTab] = useState('product');
    const [searchProduct, setSearchProduct] = useState('');
    const [searchCategory, setSearchCategory] = useState('');

    const products = useAdminProductStore((state) => state.products);
    const categories = useAdminProductStore((state) => state.categories);
    const deleteProduct = useAdminProductStore((state) => state.deleteProduct);
    const deleteCategory = useAdminProductStore((state) => state.deleteCategory);
    const init = useAdminProductStore((state) => state.init);
    // Modal States
    // const [showProductModal, setShowProductModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Edit/Delete State
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [confirmAction, setConfirmAction] = useState<() => void>(() => { });
    const [confirmMessage, setConfirmMessage] = useState('');

    // --- Product Handlers ---
    const handleAddProduct = () => {
        navigate('/admin/products/add');
    };

    const handleEditProduct = (id: number) => {
        navigate(`/admin/products/edit/${id}`);
    };

    const handleDeleteProduct = (id: number) => {
        setConfirmMessage('Are you sure you want to delete this product? This action cannot be undone.');
        setConfirmAction(() => () => deleteProduct(id));
        setShowConfirmModal(true);
    };

    // --- Category Handlers ---
    const handleAddCategory = () => {
        setIsEdit(false);
        setSelectedId(null);
        setShowCategoryModal(true);
    };

    const handleEditCategory = (id: number) => {
        setIsEdit(true);
        setSelectedId(id);
        setShowCategoryModal(true);
    };

    const handleDeleteCategory = (id: number) => {
        setConfirmMessage('Are you sure you want to delete this category? Products in this category might be affected.');
        setConfirmAction(() => () => deleteCategory(id));
        setShowConfirmModal(true);
    };

    useEffect(() => {
        init();
    }, [init]);

    return (
        <div className="products-view">
            <div className="tabs-header">
                {['category', 'product'].map((tab) => (
                    <button
                        key={tab}
                        className={`tab-btn ${productTab === tab ? 'active' : ''}`}
                        onClick={() => setProductTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {productTab === 'product' ? (
                    <>
                        <div className="actions-bar">
                            <input type="text" placeholder="Search products..." className="search-input" value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} />
                            <button className="btn-primary" style={{ width: 'max-content' }} onClick={handleAddProduct}>Add Product</button>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    products.filter((product) => product.title.toLowerCase().includes(searchProduct.toLowerCase())).map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.productVariants.length > 0 && product.productVariants[0].images.length > 0 ? <img src={product.productVariants[0].images[0]} alt={product.title} className="product-img" style={{ width: '50px', height: '50px', objectFit: 'contain' }} /> : <div className="img-placeholder"></div>}</td>
                                            <td>{product.title}</td>
                                            <td>{product.productCategories.reduce((acc, category) => acc + category.categories.name + ', ', '')}</td>
                                            <td>{product.productVariants.reduce((acc, variant) => acc + '₹' + variant.price + ', ', '').toLocaleString()}</td>
                                            <td>{product.productVariants.reduce((acc, variant) => acc + variant.stock, 0)}</td>
                                            <td>
                                                <button className="btn-small" style={{ color: 'blue', borderColor: 'blue' }} onClick={() => handleEditProduct(product.id)}>Edit</button>
                                                <button className="btn-small" style={{ marginLeft: '5px', color: 'red', borderColor: 'red' }} onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </>
                ) : (
                    <>
                        <div className="actions-bar">
                            <input type="text" placeholder="Search categories..." className="search-input" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} />
                            <button className="btn-primary" style={{ width: 'max-content' }} onClick={handleAddCategory}>Add Category</button>
                        </div>
                        <div className="categories-grid">
                            {categories.filter((category) => category.name.toLowerCase().includes(searchCategory.toLowerCase())).map((category) => (
                                <div className="category-card" key={category.id}>
                                    {category.image != "" ? <img src={category.image} alt={category.name} className="category-img" style={{ width: '100px', height: '100px', objectFit: 'contain' }} /> : <div className="category-img-placeholder"></div>}
                                    <h3>{category.name}</h3>
                                    <div className="category-actions">
                                        <button className="btn-small" style={{ color: 'blue', borderColor: 'blue' }} onClick={() => handleEditCategory(category.id)}>Edit</button>
                                        <button className="btn-small" style={{ marginLeft: '5px', color: 'red', borderColor: 'red' }} onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {/* <ProductModal
                isOpen={showProductModal}
                onClose={() => setShowProductModal(false)}
                isEdit={isEdit}
                editId={selectedId || undefined}
            /> */}
            <CategoryModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                isEdit={isEdit}
                editId={selectedId || undefined}
            />
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmAction}
                title="Confirm Delete"
                message={confirmMessage}
                confirmText="Delete"
                isDestructive={true}
            />
        </div>
    );
}
