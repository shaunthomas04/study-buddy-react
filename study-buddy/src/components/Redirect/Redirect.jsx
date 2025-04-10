import Navbar from '../Navbar/Navbar';
import "./Redirect.css";


const Redirect = () => {
    return (
        <>
        <Navbar />
            <div className="redirect-container">
                <img
                    className="logo"
                    src="https://cdn.discordapp.com/attachments/1343710392693686283/1359241235302449192/Adobe_Express_-_file_2.png?ex=67f6c38b&is=67f5720b&hm=73dfe69884f8ad35c0f36d8526645b279ce4e826f9418a10f6a3cb2c6815411d&format=webp&quality=lossless&width=891&height=889"
                    alt="Logo"
                />
                <h1 className="redirect-message">Add classes in profile page</h1>
            </div>
        </>
    );
}

export default Redirect;