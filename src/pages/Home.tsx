import react from "../assets/react.svg"
import { Link } from "react-router"
const Home = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <img src={react} alt="react logo" className="w-20 h-20 animate-bounce" />

            <h1>Home</h1>
            <p>Home Page</p>
            <Link to="/login">Login</Link>
        </div>
    )
}

export default Home