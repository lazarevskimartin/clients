import React from 'react';

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, onClose, onConfirm, message }) => {
    if (!open) return null;
    return (
        <div className="modal-backdrop">
            <div className="modal">
                <p style={{ marginBottom: '1.5rem' }}>{message}</p>
                <div className="modal-actions">
                    <button type="button" onClick={onClose}>Откажи</button>
                    <button type="button" onClick={onConfirm} style={{ background: '#ff4d4f', color: '#fff' }}>Избриши</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
