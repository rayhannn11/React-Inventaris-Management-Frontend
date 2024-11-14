import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import $ from "jquery";
import { useNavigate } from "react-router-dom";

const ModalProduct = ({ show, handleClose, product }) => {
  const [formData, setFormData] = useState({
    kode_produk: "",
    nama_produk: "",
    foto_produk: null,
    id_kategori: "",
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Update formData whenever product changes
  useEffect(() => {
    console.log(product, "cek product modal");
    if (product) {
      // Find the category ID based on the product category name
      const category = categories.find(
        (cat) => cat.nama_kategori === product.category
      );
      setFormData({
        kode_produk: product.code || "",
        nama_produk: product.name || "",
        foto_produk: product.photo || null,
        id_kategori: category ? category.id_kategori : "", // Set to category ID
      });
    }
  }, [product, categories]);

  useEffect(() => {
    $.ajax({
      url: "http://localhost:8080/category",
      method: "GET",
      success: function (response) {
        setCategories(
          response.length > 0
            ? response
            : [{ id_kategori: "", nama_kategori: "No Category" }]
        );
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "foto_produk" ? files[0] : value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.kode_produk ||
      !formData.nama_produk ||
      !formData.foto_produk ||
      !formData.id_kategori
    ) {
      setError(
        "All fields must be filled (If No Category, Please crate category first)."
      );
      return false;
    }

    // Check if form data is identical to the current product data
    if (
      product &&
      (formData.kode_produk === product.code ||
        formData.nama_produk === product.name ||
        formData.id_kategori ===
          categories.find((cat) => cat.nama_kategori === product.category)
            ?.id_kategori ||
        (typeof formData.foto_produk === "string"
          ? formData.foto_produk
          : formData.foto_produk.name) === product.photo)
    ) {
      setError("All fields must be changed before updating.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const method = "POST";
    const urlProduct = product
      ? `http://localhost:8080/product/update/${product.id}`
      : "http://localhost:8080/product";

    const formDataToSend = new FormData();
    formDataToSend.append("kode_produk", formData.kode_produk);
    formDataToSend.append("nama_produk", formData.nama_produk);
    formDataToSend.append("foto_produk", formData.foto_produk);
    formDataToSend.append("id_kategori", formData.id_kategori);

    console.log(formDataToSend);
    $.ajax({
      url: urlProduct,
      method,
      data: formDataToSend,
      processData: false,
      contentType: false,
      success: function (productResponse) {
        console.log("Product added/updated:", productResponse);

        navigate(0);
      },
      error: function (xhr, status, error) {
        console.error("Error adding/updating product:", error);
      },
    });
  };

  const imageUrl =
    typeof formData.foto_produk === "string"
      ? `http://localhost:8080/products/${formData.foto_produk}`
      : formData.foto_produk && URL.createObjectURL(formData.foto_produk);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{product ? "Update Product" : "Add Product"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group controlId="kodeProduk">
                <Form.Label>Product Code</Form.Label>
                <Form.Control
                  type="text"
                  name="kode_produk"
                  value={formData.kode_produk}
                  onChange={handleChange}
                  placeholder="Enter product code"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="namaProduk">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="nama_produk"
                  value={formData.nama_produk}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group controlId="fotoProduk">
                <Form.Label>Product Photo</Form.Label>
                <Form.Control
                  type="file"
                  name="foto_produk"
                  onChange={handleChange}
                  accept="image/*"
                />
                {formData.foto_produk && (
                  <img
                    src={imageUrl}
                    alt="Product"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="kategoriProduk">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="id_kategori"
                  value={formData.id_kategori}
                  onChange={handleChange}
                >
                  {[
                    ...new Map(
                      categories.map((category) => [
                        category.nama_kategori,
                        category,
                      ])
                    ).values(),
                  ].map((category) => (
                    <option
                      key={category.id_kategori}
                      value={category.id_kategori}
                    >
                      {category.nama_kategori}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {product ? "Update Product" : "Add Product"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalProduct;
