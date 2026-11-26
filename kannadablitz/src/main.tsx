import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./ui/theme.css";
import App from "./App";
import { EngineProvider } from "./engine/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EngineProvider>
      <App />
    </EngineProvider>
  </StrictMode>,
);
