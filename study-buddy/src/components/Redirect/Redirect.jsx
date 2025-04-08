import Navbar from '../Navbar/Navbar';
import "./Redirect.css";


const Redirect = () => {
    return (
        <>
        <Navbar />
        <div className="loading-content">
            <h1>Add classes in profile page</h1>
            <div className="loader"></div>
        </div>
        </>
    );
}

export default Redirect;