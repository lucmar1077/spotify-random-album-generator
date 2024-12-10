import './Login.css';

export default function Login() {

    const handleClick = () => {
        const clientId = "8165c167ac5e4ac3ad70d51dd4616c5f";
        const redirectUri = "http://localhost:5174/";
        const apiUrl = "https://accounts.spotify.com/authorize";
        const scope = [
            "user-read-email",
            "user-read-private",
        ];
        window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope.join(" ")}&response_type=token&show_dialog=true`;
    };

    return (
        <div className="login-container">
            <h1 className="pseudo-logo">Random Album Generator</h1>
            <p>Welcome to <span>Random Album Generator</span> - your gateway to exploring the vast world of music. With just a tap, generate a random album and uncover hidden gems or timeless classics from Spotify's library.</p>
            <p>Want to tailor your discovery? Use our filters to:</p>
            <ul className="feature-list">
                <li>Explore specific genres that match your mood.</li>
                <li>Dive into albums from a particular decade.</li>
                <li>Discover albums available in your country.</li>
            </ul>
            <p>Click the <span>Connect Spotify</span> button below to get started</p>
            <button className="connect-spotify-button" onClick={handleClick}>Connect Spotify</button>
        </div>
    );
}
