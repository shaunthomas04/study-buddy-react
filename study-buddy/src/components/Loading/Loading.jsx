import Navbar from '../Navbar/Navbar';
import "./Loading.css";
import logo from "./logo.png";


const Loading = () => {
    return (
        <>
      <Navbar />
      <div className="loading-screen" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh", backgroundColor: "white" }}>
        <img src={logo} alt="Logo" style={{ width: "200px", height: "auto" }} />
        <h2 style={{ marginTop: "20px", fontSize: "18px", color: "#555" }}>Loading...</h2>
      </div>
        </>
    );
}

export default Loading;