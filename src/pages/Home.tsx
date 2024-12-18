import react from "../assets/react.svg"
const Home = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            {/* tailwind css class */}
            <img src={react} alt="react logo" className="w-20 h-20 animate-bounce" />
            <h1>Home</h1>
            <p>Home Page</p>
        </div>
    )
}

export default Home