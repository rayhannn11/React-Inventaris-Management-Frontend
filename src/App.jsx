import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import GuestRoute from "./components/GuestRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import Login from "./pages/Login.jsx";
import DashboardProducts from "./pages/DashboardProducts.jsx";
import DashboardCategories from "./pages/DashboardCategories.jsx";
import NotFound from "./pages/NotFound.jsx";

import DashboardLayout from "./layouts/DashboardLayout.jsx";
import { useEffect, useState } from "react";
import Loading from "./components/Loading.jsx";
import DashboardWidget from "./components/DashboardWidget.jsx";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Cleanup timer
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/" element={<Login />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardWidget />} />
            <Route path="/dashboard/products" element={<DashboardProducts />} />
            <Route
              path="/dashboard/categories"
              element={<DashboardCategories />}
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
