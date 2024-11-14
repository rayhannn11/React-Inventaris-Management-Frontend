import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import $ from "jquery";
import { useNavigate } from "react-router-dom";

const ModalStock = ({ show, handleClose, selectedProduct }) => {
  const [newQuantity, setNewQuantity] = useState(
    selectedProduct ? selectedProduct.quantity : ""
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedProduct) {
      setNewQuantity(selectedProduct.quantity || ""); // Fall back to empty if quantity is undefined
    }
  }, [selectedProduct]);

  const handleUpdateQuantity = () => {
    console.log(selectedProduct);
    $.ajax({
      url: `http://localhost:8080/stock/update/${selectedProduct?.id}`,
      method: "POST",
      data: { jumlah_barang: newQuantity },
      success: function (response) {
        console.log("Quantity updated successfully:", response);
        // Update state, refresh data table if necessary
        handleClose(); // Tutup modal setelah update berhasil
        navigate(0);
      },
      error: function (error) {
        console.error("Error updating quantity:", error);
      },
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Quantity for {selectedProduct?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdateQuantity}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalStock;
