import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export default function ConfirmDialog({ open, title = 'Are you sure?', text, confirmLabel = 'Delete', loading, onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-muted">{text}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
