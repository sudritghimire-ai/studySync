import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Header } from "./components/Header";
import AdminDashboard from "./admin/Dashboard";
import Privacy from "./pages/privacy";
import AboutMe from "./pages/aboutme";

function App() {
  const { checkAuth, authUser, checkingAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return null;

  const hideHeaderRoutes = ["/privacy", "/admin/dashboard", "/about"];

  // Hide header if pathname matches hideHeaderRoutes OR starts with "/chat/"
  const shouldHideHeader =
    hideHeaderRoutes.includes(location.pathname) || location.pathname.startsWith("/chat/");

  return (
    <>
      {!shouldHideHeader && <Header />}

      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!authUser ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/chat/:id"
            element={authUser ? <ChatPage /> : <Navigate to="/auth" />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<AboutMe />} />
        </Routes>

        <Toaster
          position="top-center"
          toastOptions={{
            style: { marginTop: "80px" },
          }}
        />
      </div>
    </>
  );
}

export default App;
