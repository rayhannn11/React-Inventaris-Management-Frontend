import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import $ from "jquery";
import DataTable from "react-data-table-component";

function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);

  // Stats
  useEffect(() => {
    $.ajax({
      url: "http://localhost:8080/product",
      method: "GET",
      success: (data) => {
        const uniqueProducts = new Set(data?.map((item) => item.nama_produk))
          .size;
        setProductCount(uniqueProducts);
      },
      error: (err) => console.error("Error fetching product data:", err),
    });

    // Fetch category data and calculate unique category count
    $.ajax({
      url: "http://localhost:8080/category",
      method: "GET",
      success: (data) => {
        const uniqueCategories = new Set(
          data?.map((item) => item.nama_kategori)
        ).size;
        setCategoryCount(uniqueCategories);
      },
      error: (err) => console.error("Error fetching category data:", err),
    });

    // Fetch stock data and calculate total stock
    $.ajax({
      url: "http://localhost:8080/stock",
      method: "GET",
      success: (data) => {
        const totalStockCount = data?.reduce(
          (total, item) => total + parseInt(item.jumlah_barang, 10),
          0
        );
        setTotalStock(totalStockCount);
      },
      error: (err) => console.error("Error fetching stock data:", err),
    });

    // Fetch admin user count
    $.ajax({
      url: "http://localhost:8080/user/admin-count",
      method: "GET",
      success: (data) => setAdminCount(data?.admin_count),
      error: (err) => console.error("Error fetching admin count:", err),
    });
  }, []);

  // Get Data Table
  useEffect(() => {
    $.ajax({
      url: "http://localhost:8080/product",
      method: "GET",
      success: function (response) {
        // Sorting berdasarkan 'jumlah_barang' secara descending dan mengambil 5 teratas
        const topProducts = response
          .sort((a, b) => b.jumlah_barang - a.jumlah_barang)
          .slice(0, 5);

        setTopProducts(
          topProducts.map((item) => ({
            id: item.id_produk,
            key: `${item.kode_produk}-${Math.random()}`,
            code: item.kode_produk,
            name: item.nama_produk,
            category: item.nama_kategori,
            quantity: item.jumlah_barang,
            dateRegistered: item.tgl_register,
          }))
        );
      },
      error: function (xhr, status, error) {
        console.error("Error fetching product data:", error);
      },
    });
    $.ajax({
      url: "http://localhost:8080/category",
      method: "GET",
      success: function (response) {
        // Menghitung kemunculan setiap kategori
        const categoryCounts = response.reduce((acc, item) => {
          if (acc[item.nama_kategori]) {
            acc[item.nama_kategori].count += 1;
          } else {
            acc[item.nama_kategori] = {
              id: item.id_kategori,
              name: item.nama_kategori,
              count: 1,
            };
          }
          return acc;
        }, {});

        // Konversi ke array dan sortir berdasarkan 'count' secara descending, ambil 5 teratas
        const topCategories = Object.values(categoryCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Set data untuk DataTable
        setTopCategories(
          topCategories.map((category) => ({
            id: category.id,
            categoryName: category.name,
            productCount: category.count,
          }))
        );
      },
      error: function (xhr, status, error) {
        console.error("Error fetching category data:", error);
      },
    });
  }, []);

  const productColumns = [
    { name: "Kode Produk", selector: (row) => row.code, sortable: true },
    { name: "Nama Produk", selector: (row) => row.name, sortable: true },
    { name: "Kategori", selector: (row) => row.category, sortable: true },
    { name: "Jumlah", selector: (row) => row.quantity, sortable: true },
    {
      name: "Tanggal Register",
      selector: (row) => row.dateRegistered,
      sortable: true,
    },
  ];

  const categoryColumns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    {
      name: "Category Name",
      selector: (row) => row.categoryName,
      sortable: true,
    },
    {
      name: "Jumlah Produk",
      selector: (row) => row.productCount,
      sortable: true,
    },
  ];

  return (
    <Container fluid className="dashboard-content mt-3">
      <Row>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Jumlah Product</Card.Title>
              <Card.Text>{productCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Jumlah Category</Card.Title>
              <Card.Text>{categoryCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Jumlah Stock</Card.Title>
              <Card.Text>{totalStock}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Jumlah Admin</Card.Title>
              <Card.Text>{adminCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={6}>
          <h5>Top 5 Products by Stock</h5>
          <DataTable
            columns={productColumns}
            data={topProducts}
            pagination
            responsive
          />
        </Col>
        <Col md={6}>
          <h5>Top 5 Categories by Product Count</h5>
          <DataTable
            columns={categoryColumns}
            data={topCategories}
            pagination
            responsive
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
