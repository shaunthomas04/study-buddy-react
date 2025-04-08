import Navbar from '../Navbar/Navbar';
import "./Loading.css";


const Loading = () => {
    return (
        <>
        <Navbar />
        <div className="loading-content">
            <h1>Loading...</h1>
            <div className="loader"></div>
        </div>
        </>
    );
}

export default Loading;