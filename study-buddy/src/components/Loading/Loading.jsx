import Navbar from '../Navbar/Navbar';
import "./Loading.css";


const Loading = () => {
    return (
        <>
        <Navbar />
        <div className="loading-content">
        <h1>Loading...</h1>
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" 
                    alt="Loading spinner" 
                    className="loading-gif"
                />
        </div>
        </>
    );
}

export default Loading;