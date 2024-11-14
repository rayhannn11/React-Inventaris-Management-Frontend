import { useEffect, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaThLarge, FaTags, FaBox, FaDoorOpen, FaHome } from "react-icons/fa"; // Import beberapa icon
import "./DashboardLayout.css"; // CSS tambahan untuk sidebar

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const currentAdmin = localStorage.getItem("user");

  // Detect mobile view on component mount and on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Force sidebar collapse on mobile view
  useEffect(() => {
    if (isMobile) setIsSidebarCollapsed(true);
  }, [isMobile]);

  const toggleSidebar = () => {
    if (!isMobile) setIsSidebarCollapsed((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate(0);
  };

  return (
    <div className="d-flex full-height">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!isSidebarCollapsed && <h5>{currentAdmin}</h5>}
          <button onClick={toggleSidebar} className="toggle-btn">
            {isMobile ? <FaHome /> : isSidebarCollapsed ? "→" : "←"}
          </button>
        </div>
        <Nav className="flex-column mt-4">
          <Nav.Link as={Link} to="/dashboard" className="nav-item gap-10">
            <FaThLarge /> {!isSidebarCollapsed && " Dashboard"}
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/dashboard/products"
            className="nav-item gap-10"
          >
            <FaBox /> {!isSidebarCollapsed && " Products"}
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/dashboard/categories"
            className="nav-item gap-10"
          >
            <FaTags /> {!isSidebarCollapsed && " Categories"}
          </Nav.Link>
          <Nav.Link
            as={Link}
            onClick={handleLogout}
            className="nav-item gap-10"
          >
            <FaDoorOpen /> {!isSidebarCollapsed && " Logout"}
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <Container fluid className="dashboard-content">
        <Outlet />
      </Container>
    </div>
  );
};

export default DashboardLayout;
