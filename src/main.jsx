import "../src/assets/vendor/bootstrap/css/bootstrap.min.css"
import "../src/assets/vendor/bootstrap-icons/bootstrap-icons.css"

import "./assets/css/main.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { initializeCsrf } from "./api/client";
import App from "./App.jsx";

initializeCsrf();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);