import { useEffect, useState } from "react";
import $ from "jquery";
// import DataTable from "datatables.net-react";
// import DT from "datatables.net-dt";
import DataTable from "react-data-table-component";

import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import ModalCategory from "../components/modals/ModalCategory";

const CategoryPage = () => {
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // UseEffect Get Categories
  useEffect(() => {
    // Mengambil data awal saat komponen pertama kali di-mount
    $.ajax({
      url: "http://localhost:8080/category",
      method: "GET",
      success: function (response) {
        setTableData(
          response.map((item) => ({
            id: item.id_kategori,
            key: `${item.kode_produk}-${Math.random()}`,
            categoryName: item.nama_kategori,
            productName: item.nama_produk,
            quantity: item.jumlah_barang,
            lastUpdated: item.tgl_update,
          }))
        );
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  }, []);

  // Fungsi untuk Search Category
  const handleSearchCategory = (e) => {
    const value = e.target.value;
    setSearch(value);

    // AJAX untuk pencarian
    $.ajax({
      url: `http://localhost:8080/category?search=${value}`,
      method: "GET",
      success: function (response) {
        setTableData(
          response.map((item) => ({
            id: item.id_kategori,
            key: `${item.kode_produk}-${Math.random()}`,
            categoryName: item.nama_kategori,
            productName: item.nama_produk,
            quantity: item.jumlah_barang,
            lastUpdated: item.tgl_update,
          }))
        );
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  };
  // Fungsi untuk membuka dan menutup modal
  const handleShowModal = (category = null) => {
    console.log("Data yang dikirim ke modal:", category); // Debug log untuk melihat isi row

    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null); // Reset selectedCategory saat modal ditutup
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    {
      name: "Category Name",
      selector: (row) => row.categoryName,
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.productName,
      sortable: true,
    },
    { name: "Quantity", selector: (row) => row.quantity, sortable: true },
    {
      name: "Last Updated",
      selector: (row) => row.lastUpdated,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button variant="primary" onClick={() => handleShowModal(row)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Container fluid className="py-3 px-5">
      <ModalCategory
        show={showModal}
        handleClose={handleCloseModal}
        category={selectedCategory}
      />

      <Row className="mb-5 mt-3">
        <Col>
          <h2>Categories</h2>
        </Col>
        <Col className="text-end">
          <Button variant="warning" onClick={() => handleShowModal()}>
            Add Category
          </Button>
        </Col>
      </Row>
      <Row className="mt-5 mb-3">
        <Col md={3}>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Search Category"
              value={search}
              onChange={handleSearchCategory}
            />
            <InputGroup.Text>
              <FaSearch size={14} />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable
            keyField="key"
            columns={columns}
            data={tableData}
            pagination
            responsive
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryPage;
