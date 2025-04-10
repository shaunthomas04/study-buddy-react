import Navbar from '../Navbar/Navbar';
import "./Redirect.css";
import logo from "./logo.png";


const Redirect = () => {
    return (
        <>
        <Navbar />
            <div className="redirect-container">
                <img
                    className="logo"
                    src={logo}
                    alt="Logo"
                />
                <h1 className="redirect-message">Add classes in profile page to get started!</h1>
            </div>
        </>
    );
}

export default Redirect;