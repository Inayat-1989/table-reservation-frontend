import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import About from "./components/layout/About";
import Chefs from "./components/layout/Chefs";
import Contact from "./components/layout/Contact";
import Gallery from "./components/layout/Gallary";
import Hero from "./components/layout/Hero";
import Menu from "./components/layout/Menu";
import MyReservations from "./components/layout/MyReservations";
import BookingFlow from "./components/layout/BookingFlow";
import WhyUs from "./components/layout/WhyUs";

import Footer from "./components/navigation/Footer";
import Header from "./components/navigation/Header";

import AdminLayout from "./admin_portal/components/layout/AdminLayout";
import AdminLoginPage from "./admin_portal/pages/LoginPage";
import AdminOTPPage from "./admin_portal/pages/VerifyOTPPage";
import AdminDashboardPage from "./admin_portal/pages/DashboardPage";
import { AdminAuthProvider } from "./admin_portal/context/AdminAuthContext";
import ReservationsPage from "./admin_portal/pages/ReservationsPage";
import MenuItemsPage from "./admin_portal/pages/MenuItemsPage";
import MenuCategoriesPage from "./admin_portal/pages/MenuCategoriesPage";

import "./admin_portal/styles/admin.css";
import "./admin_portal/styles/reservations.css";
function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <WhyUs />
      <Menu />
      <Chefs />
      <BookingFlow />
      <Gallery />
      <Contact />
    </>
  );
}

function CustomerLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Customer website */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/my-reservations" element={<MyReservations />} />
        </Route>

        {/* Admin authentication pages */}
        <Route path="/admin_portal/login" element={<AdminLoginPage />} />

        <Route path="/admin_portal/verify-otp" element={<AdminOTPPage />} />

        {/* Admin portal layout and nested pages */}
        <Route path="/admin_portal" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="menu/items" element={<MenuItemsPage />} />
          <Route path="menu/categories" element={<MenuCategoriesPage />} />
          {/* We'll add more admin routes here. */}
        </Route>

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;
