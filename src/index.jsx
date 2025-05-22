import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./reduxtool/store";
import { registerSW } from "virtual:pwa-register";

// PWA Service Worker registration
const updateSW = registerSW({
  onNeedRefresh() {
    if (
      confirm("Dev Music has been updated. Reload to get the latest version?")
    ) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App is ready for offline use");
  },
});

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
