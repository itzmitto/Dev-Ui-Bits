import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/geist/latin-400.css";
import "@fontsource/geist/latin-500.css";
import "@fontsource/geist/latin-600.css";
import "./styles.css";
import "./effects/effects.css";
import "./effects/advanced.css";
import "./catalog.css";
import App from "./App";
import { ThemeProvider } from "./theme";
import { MotionConfig } from "motion/react";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider><MotionConfig reducedMotion="user"><App /></MotionConfig></ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
