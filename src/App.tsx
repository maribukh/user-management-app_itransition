import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import UsersTable from "./components/UserTable";
import EmailVerification from "./page/EmailVerification"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<UsersTable />} />
        <Route path="/verify-email/:token" element={<EmailVerification />} />
      </Routes>
    </Router>
  );
}

export default App;
