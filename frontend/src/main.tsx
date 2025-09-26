import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Rooms from "./routes/Rooms";
import RoomCall from "./routes/RoomCall";
import { StreamProvider } from "./contexts/stream";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StreamProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/rooms" replace />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomCall />} />
        </Routes>
      </BrowserRouter>
    </StreamProvider>
  </StrictMode>,
);
