import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext"; // just AuthProvider here
import RoutesWrapper from "./components/RoutesWrapper";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="pt-16">
          <RoutesWrapper />
        </div>
        <ToastContainer autoClose={3000} />
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
