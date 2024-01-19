import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { RoomProvider } from "./context/RoomContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <AuthProvider>
        <RoomProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </RoomProvider>
      </AuthProvider>
    </NextUIProvider>
  </React.StrictMode>
);
