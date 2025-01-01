import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router"
import Header from './components/Header';
import Settings from "./pages/Settings";
import SearchResults from "./pages/SearchResults";
import { AuthProvider } from './context/AuthContext';
import QuestionForm from "./components/QuestionForm";
import TemplateRouter from "./pages/TemplateRouter";

function App() {
    return (
        <div>
            <AuthProvider>
            <Header />
            <Routes>
                <Route index element={<Home />} />
                <Route path="template/:tid" element={<TemplateRouter />} />
                <Route path="template/:tid/edit" element={<QuestionForm />} />
                <Route path="template/:tid/view" element={<div>View</div>} />
                <Route path="search" element={<SearchResults /> } />
                <Route path="signup" element={<SignUp />} />
                <Route path="login" element={<Login />} />
                <Route path="settings" element={<Settings />} />
            </Routes>
        </AuthProvider>
        </div>
    );
}

export default App;