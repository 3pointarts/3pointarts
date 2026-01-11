import React from 'react';
import { CommonModal } from './CommonModal';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false
}) => {
    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <>
                    <button className="btn-secondary" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button
                        className={`btn-primary ${isDestructive ? 'btn-danger' : ''}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        style={isDestructive ? { backgroundColor: '#dc3545', borderColor: '#dc3545' } : {}}
                    >
                        {confirmText}
                    </button>
                </>
            }
        >
            <p>{message}</p>
        </CommonModal>
    );
};
