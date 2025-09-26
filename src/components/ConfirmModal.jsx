import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'


export default function ConfirmModal({ show, title = 'Confirm', body, onCancel, onConfirm }) {
return (
<Modal show={show} onHide={onCancel} centered>
<Modal.Header closeButton>
<Modal.Title>{title}</Modal.Title>
</Modal.Header>
<Modal.Body>{body}</Modal.Body>
<Modal.Footer>
<Button variant="secondary" onClick={onCancel}>Close</Button>
<Button variant="danger" onClick={onConfirm}>Confirm</Button>
</Modal.Footer>
</Modal>
)
}