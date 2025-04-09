import Navbar from '../Navbar/Navbar';
import "./Loading.css";


const Loading = () => {
    return (
        <>
        <Navbar />
        <div className="loading-content">
                <img
                    src="https://cdn.discordapp.com/attachments/1343710392693686283/1359241235302449192/Adobe_Express_-_file_2.png?ex=67f6c38b&is=67f5720b&hm=73dfe69884f8ad35c0f36d8526645b279ce4e826f9418a10f6a3cb2c6815411d&format=webp&quality=lossless&width=891&height=889"
                    alt="Study Buddy Logo"
                    className="loading-logo"
                />
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" 
                    alt="Loading spinner" 
                    className="loading-gif"
                />
                <h1 className="loading-text">Loading...</h1>
        </div>
        </>
    );
}

export default Loading;