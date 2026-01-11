import React, { useEffect } from 'react';
import { CommonModal } from '../CommonModal';
import useAdminProductStore from '../../state/admin/AdminProductStore';
import { Status } from '../../core/enum/Status';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEdit?: boolean;
    editId?: number;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, isEdit = false, editId }) => {
    const store = useAdminProductStore();

    // Reset form when opening in add mode
    useEffect(() => {
        if (isOpen && !isEdit) {
            store.setCategoryName('');
            store.setCategoryImage('');
        }
    }, [isOpen, isEdit]);

    // Load data when opening in edit mode
    useEffect(() => {
        if (isOpen && isEdit && editId) {
            const category = store.categories.find(c => c.id === editId);
            if (category) {
                store.setCategoryName(category.name);
                store.setCategoryImage(category.image);
            }
        }
    }, [isOpen, isEdit, editId]);

    const handleSubmit = async () => {
        if (isEdit && editId) {
            await store.updateCategory(editId);
        } else {
            await store.addCategory();
        }
        if (useAdminProductStore.getState().categorySubmitStatus === Status.success) {
            onClose();
        }
    };

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Category" : "Add Category"}
            footer={
                <>
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleSubmit} disabled={store.categorySubmitStatus === Status.loading}>
                        {store.categorySubmitStatus === Status.loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                    </button>
                </>
            }
        >
            <div className="modal-form-group">
                <label>Name</label>
                <input
                    type="text"
                    value={store.categoryName}
                    onChange={(e) => store.setCategoryName(e.target.value)}
                    placeholder="Category Name"
                />
            </div>
            <div className="modal-form-group">
                <label>Image URL</label>
                <input
                    type="text"
                    value={store.categoryImage}
                    onChange={(e) => store.setCategoryImage(e.target.value)}
                    placeholder="http://example.com/category.jpg"
                />
            </div>
        </CommonModal>
    );
};
