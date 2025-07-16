import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// Import components and pages
import CheckAuth from "./components/check-auth.jsx";
import Tickets from "./pages/tickets.jsx";
import TicketDetailsPage from "./pages/ticket.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";


// Mount the root of the app
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Default Route: Redirect root URL to /signup */}
        <Route path="/" element={<Navigate to="/signup" replace />} />

        {/* ===========================
            ✅ Protected Routes (Require Auth)
           =========================== */}

        {/* Ticket list page */}
        <Route
          path="/tickets"
          element={
            <CheckAuth protected={true}>
              <Tickets />
            </CheckAuth>
          }
        />

        {/* Individual ticket details page */}
        <Route
          path="/tickets/:id"
          element={
            <CheckAuth protected={true}>
              <TicketDetailsPage />
            </CheckAuth>
          }
        />
        
        {/* ===========================
            🌐 Public Routes (No Auth Required)
           =========================== */}

        {/* Login page */}
        <Route
          path="/login"
          element={
            <CheckAuth protected={false}>
              <Login />
            </CheckAuth>
          }
        />

        {/* Signup page */}
        <Route
          path="/signup"
          element={
            <CheckAuth protected={false}>
              <Signup />
            </CheckAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
