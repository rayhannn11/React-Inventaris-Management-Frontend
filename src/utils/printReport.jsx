import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export function generatePDF(products) {
  const doc = new jsPDF();
  doc.text("Laporan Products PT.Eureka", 105, 20, { align: "center" });

  // Define column headers
  const tableColumns = [
    "Kode Produk",
    "Nama Produk",
    "Kategori",
    "Foto",
    "Jumlah",
    "Tanggal Register",
  ];

  // Define rows of data
  const tableRows = products.map((product) => [
    product.code,
    product.name,
    product.category,
    product.photo,
    product.quantity,
    product.dateRegistered,
  ]);

  // Generate PDF table
  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: 30,
  });

  doc.save("products_report.pdf");
}

export function generateExcel(products) {
  const title = [["Laporan Products PT.Eureka"]];

  // Define the column headers
  const tableColumns = [
    [
      "Kode Produk",
      "Nama Produk",
      "Kategori",
      "Foto",
      "Jumlah",
      "Tanggal Register",
    ],
  ];

  // Define the rows of data
  const tableRows = products.map((product) => [
    product.code,
    product.name,
    product.category,
    product.photo,
    product.quantity,
    product.dateRegistered,
  ]);

  // Merge title, headers, and data into one sheet data array
  const sheetData = [...title, [], ...tableColumns, ...tableRows];

  // Create a new worksheet and workbook
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Produk");

  // Set column widths for better readability
  const columnWidths = [
    { wch: 15 }, // Kode Produk
    { wch: 25 }, // Nama Produk
    { wch: 20 }, // Kategori
    { wch: 20 }, // Foto
    { wch: 10 }, // Jumlah
    { wch: 20 }, // Tanggal Register
  ];
  worksheet["!cols"] = columnWidths;

  // Save the Excel file
  XLSX.writeFile(workbook, "products_report.xlsx");
}
