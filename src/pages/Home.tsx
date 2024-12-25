// import Iform from "/Iform_black.png"
import { Link } from "react-router"
import QuestionForm from "../components/QuestionForm"
const Home = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            {/* <img src={Iform} alt="Iform logo" className="w-20 h-20 animate-bounce" /> */}
            <QuestionForm />
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
        </div>
    )
}

export default Home