import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router"
import Header from './components/Header';
import Settings from "./pages/Settings";

function App() {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </div>
    );
}

export default App;