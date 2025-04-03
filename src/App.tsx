import Labs from "./Labs";
import Kambaz from "./Kambaz"
import store from "./Kambaz/store";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";

import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

if (import.meta.env.MODE !== "development") {
  const RENDER_URL = "https://kambaz-node-server-app-p33e.onrender.com";

  axios.get(RENDER_URL).catch((err) => {
    console.log("Initial wake ping failed:", err.message);
  });

  setInterval(() => {
    axios.get(RENDER_URL).catch((err) => {
      console.log("Keep-alive ping failed:", err.message);
    });
  }, 1000 * 60 * 5);
}

function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="Kambaz" />} />
            <Route path="/Labs/*" element={<Labs />} />
            <Route path="/Kambaz/*" element={<Kambaz />} />
          </Routes>
        </div>
      </Provider>
    </HashRouter>
  );
}

export default App;
