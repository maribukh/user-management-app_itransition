import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
