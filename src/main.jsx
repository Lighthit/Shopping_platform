import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Purchase from "./Purchase_pages/Purchase.jsx";
import ManageDiscount from "./ManageDiscount_Page/manageDiscount.jsx";
createRoot(document.getElementById('root')).render(
  <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Purchase" element={<Purchase />} />
        <Route path="/manage" element={<ManageDiscount />} />
      </Routes>
  </Router>
)
