import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Rooms from "./routes/Rooms";
import RoomCall from "./routes/RoomCall";
import { StreamProvider } from "./contexts/stream";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StreamProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomCall />} />
        </Routes>
      </BrowserRouter>
    </StreamProvider>
  </StrictMode>
);
