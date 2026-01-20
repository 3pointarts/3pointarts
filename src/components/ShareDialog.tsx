import { showSuccess } from '../core/message'

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  shareText: string;
}

export default function ShareDialog({ isOpen, onClose, shareUrl, shareText }: ShareDialogProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <div className="card p-3" style={{ minWidth: '300px', maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Share this product</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" value={shareUrl} readOnly onClick={(e) => e.currentTarget.select()} />
        </div>
        <div className="d-flex justify-content-around text-center">
          <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-success d-flex flex-column align-items-center" title="WhatsApp">
            <i className="fa fa-whatsapp fa-2x mb-1"></i>
            <span style={{ fontSize: '0.8rem' }}>WhatsApp</span>
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary d-flex flex-column align-items-center" title="Facebook">
            <i className="fa fa-facebook-official fa-2x mb-1"></i>
            <span style={{ fontSize: '0.8rem' }}>Facebook</span>
          </a>
          <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-info d-flex flex-column align-items-center" title="Telegram">
            <i className="fa fa-telegram fa-2x mb-1"></i>
            <span style={{ fontSize: '0.8rem' }}>Telegram</span>
          </a>
          <div onClick={() => {
            navigator.clipboard.writeText(shareUrl)
            showSuccess("Link copied to clipboard!")
            onClose()
          }} style={{ cursor: 'pointer' }} className="text-secondary d-flex flex-column align-items-center" title="Copy Link">
            <i className="fa fa-clone fa-2x mb-1"></i>
            <span style={{ fontSize: '0.8rem' }}>Copy</span>
          </div>
        </div>
      </div>
    </div>
  )
}
