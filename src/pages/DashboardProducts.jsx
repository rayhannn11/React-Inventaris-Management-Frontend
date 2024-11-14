import { useEffect, useState } from "react";
import $ from "jquery";
import DataTable from "react-data-table-component";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaSearch, FaFilePdf, FaFileExcel, FaEdit } from "react-icons/fa";

import ModalProduct from "../components/modals/ModalProduct";
import ModalImage from "../components/modals/ModalImage";
import { generateExcel, generatePDF } from "../utils/printReport";
import ModalStock from "../components/modals/ModalStock";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch product data
  useEffect(() => {
    $.ajax({
      url: "http://localhost:8080/product",
      method: "GET",
      success: function (response) {
        console.log(response);
        setProducts(
          response.map((item) => ({
            id: item.id_produk,
            key: `${item.kode_produk}-${Math.random()}`,
            code: item.kode_produk,
            name: item.nama_produk,
            category: item.nama_kategori,
            photo: item.foto_produk,
            quantity: item.jumlah_barang,
            dateRegistered: item.tgl_register,
          }))
        );
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  }, []);

  // Function to search for products
  const handleSearchProduct = (e) => {
    const value = e.target.value;
    console.log(value);
    setSearch(value);

    // AJAX request for product search
    $.ajax({
      url: `http://localhost:8080/product?search=${value}`,
      method: "GET",
      success: function (response) {
        setProducts(
          response.map((item) => ({
            id: item.id_produk,
            key: `${item.kode_produk}-${Math.random()}`,
            code: item.kode_produk,
            name: item.nama_produk,
            category: item.nama_kategori,
            photo: item.foto_produk,
            quantity: item.jumlah_barang,
            dateRegistered: item.tgl_register,
          }))
        );
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  };

  //  Handlers for Product Modal
  const handleShowProductModal = (product = null) => {
    console.log(product);
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    setShowProductModal(false);
  };

  //  Handlers for Stock Modal
  const handleShowStockModal = (product) => {
    console.log(product);
    setSelectedProduct(product);
    setShowStockModal(true);
  };

  const handleCloseStocktModal = () => {
    setSelectedProduct(null);
    setShowStockModal(false);
  };

  // Handlers for Image Modal
  const handleImageClick = (photo) => {
    setSelectedImage(photo);
    setShowImageModal(true);
  };
  const handleCloseImageModal = () => setShowImageModal(false);

  // Table columns
  const columns = [
    { name: "ID Produk", selector: (row) => row.id, sortable: true },
    { name: "Kode Produk", selector: (row) => row.code, sortable: true },
    { name: "Nama Produk", selector: (row) => row.name, sortable: true },
    { name: "Kategori", selector: (row) => row.category, sortable: true },
    {
      name: "Foto",
      cell: (row) => (
        <img
          src={`http://localhost:8080/products/${row.photo}`}
          alt={row.name}
          style={{ width: 50, height: 50, cursor: "pointer" }}
          onClick={() => handleImageClick(row.photo)}
        />
      ),
    },
    {
      name: "Jumlah Stok",
      selector: (row) => row.quantity,
      sortable: true,
      cell: (row) => (
        <div className="d-flex align-items-center justify-content-between">
          <span>{row.quantity}</span>
          <span
            onClick={() => handleShowStockModal(row)}
            style={{ cursor: "pointer", color: "#007bff" }}
            className="ms-2"
          >
            <FaEdit />
          </span>
        </div>
      ),
    },
    {
      name: "Tanggal Register",
      selector: (row) => row.dateRegistered,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button variant="primary" onClick={() => handleShowProductModal(row)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleDownloadPDF = () => {
    generatePDF(products);
  };

  const handleDownloadExcel = () => {
    generateExcel(products);
  };

  return (
    <Container fluid className="py-3 px-5">
      <ModalProduct
        show={showProductModal}
        handleClose={handleCloseProductModal}
        product={selectedProduct}
      />

      <ModalImage
        show={showImageModal}
        handleClose={handleCloseImageModal}
        imageUrl={selectedImage}
      />

      <ModalStock
        show={showStockModal}
        handleClose={handleCloseStocktModal}
        selectedProduct={selectedProduct}
      />

      <Row className="mb-3">
        <Col>
          <h2>Products</h2>
        </Col>
        <Col className="text-end">
          <Button variant="warning" onClick={() => handleShowProductModal()}>
            Add Product
          </Button>
        </Col>
      </Row>

      <Row className="mt-5 mb-3">
        <Col md={3}>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Search Product"
              value={search}
              onChange={handleSearchProduct}
            />
            <InputGroup.Text>
              <FaSearch size={14} />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col className="text-end">
          <FaFilePdf
            size={24}
            style={{ cursor: "pointer", marginRight: 10, color: "#FC0404" }}
            onClick={handleDownloadPDF}
          />
          <FaFileExcel
            size={24}
            style={{ cursor: "pointer", marginRight: 10, color: "#016F36" }}
            onClick={handleDownloadExcel}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <DataTable
            keyField="key"
            columns={columns}
            data={products}
            pagination
            responsive
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductsPage;
