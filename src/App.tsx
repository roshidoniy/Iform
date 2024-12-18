import Home from "./pages/Home";
import Login from "./pages/Login";
import { Route, Routes } from "react-router"

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;