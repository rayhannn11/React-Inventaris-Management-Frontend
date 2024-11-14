import { Modal, Button } from "react-bootstrap";

const ModalImage = ({ show, handleClose, imageUrl }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Image Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {imageUrl && (
          <img
            src={`http://localhost:8080/products/${imageUrl}`}
            alt="Product"
            style={{ width: "100%" }}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalImage;
