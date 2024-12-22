import Iform from "/Iform_black.png"
import { Link } from "react-router"
const Home = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <img src={Iform} alt="react logo" className="w-20 h-20 animate-bounce" />

            <h1>Home</h1>
            <p>Home Page</p>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
        </div>
    )
}

export default Home