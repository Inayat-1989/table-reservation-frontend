import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { admin, isLoading, isAuthenticated, logout } = useAdminAuth();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/admin_portal/login", { replace: true });
    }
  }

  if (isLoading) {
    return <p>Checking admin session...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin_portal/login" replace />;
  }

  return (
    <div className="admin-portal">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Yummy</h2>
          <span>Admin Portal</span>
        </div>

        <nav className="admin-navigation">
          <NavLink to="/admin_portal" end>
            Dashboard
          </NavLink>

          <NavLink to="/admin_portal/reservations">Reservations</NavLink>

          <NavLink to="/admin_portal/menu/items">Menu Items</NavLink>

          <NavLink to="/admin_portal/menu/categories">Menu Categories</NavLink>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <span>Restaurant Management</span>

          <div className="admin-user">
            <span>
              {admin?.first_name + " " + admin?.last_name ||
                admin?.username ||
                "Admin"}
            </span>

            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
