import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import $ from "jquery";

const ModalCategory = ({ show, handleClose, category }) => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!show) {
      setError("");
    }
  }, [show]);

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    } else {
      setCategoryName("");
    }
  }, [category]);

  useEffect(() => {
    console.log("Current category:", category); // Debug log untuk memastikan category kosong saat menambahkan
    if (show && category) {
      setCategoryName(category.categoryName);
    } else {
      setCategoryName(""); // Reset saat category kosong (untuk Add Category)
    }
  }, [show, category]);

  const handleSubmit = () => {
    if (categoryName.trim() === "") {
      setError("Category name cannot be empty");
      return;
    }
    setError("");

    const url = category
      ? `http://localhost:8080/category/update/${category.id}`
      : "http://localhost:8080/category";
    const method = "POST";

    const formDataToSend = new FormData();
    formDataToSend.append("nama_kategori", categoryName);

    $.ajax({
      url,
      method,
      processData: false,
      contentType: false,
      data: formDataToSend,
      success: function (response) {
        console.log(response);
        handleClose();
        window.location.reload();
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
        setError("Failed to save category. Please try again.");
      },
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {category ? "Update Category" : "Create Category"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {category ? "Update Category" : "Add Category"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCategory;
