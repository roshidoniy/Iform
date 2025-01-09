import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { Route, Routes } from "react-router"
import Header from './components/Header';
import Settings from "./pages/Settings";
import SearchResults from "./pages/SearchResults";
import { AuthProvider } from './context/AuthContext';
import ManageForm from "./pages/templatePages/ManageForm";
import TemplateRouter from "./pages/templatePages/TemplateRouter";
import ViewForm from "./pages/templatePages/ViewForm";
import Results from "./pages/templatePages/Results";

function App() {
    return (
            <AuthProvider>
            <Header />
            <Routes>
                <Route index element={<Home />} />
                <Route path="template/:tid" element={<TemplateRouter />} />
                <Route path="template/:tid/edit" element={<ManageForm />} />
                <Route path="template/:tid/edit/results" element={<Results />} />
                <Route path="template/:tid/view" element={<ViewForm />} />
                <Route path="search" element={<SearchResults /> } />
                <Route path="signup" element={<SignUp />} />
                <Route path="login" element={<Login />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<div>404</div>} />
            </Routes>
        </AuthProvider>
    );
}

export default App;