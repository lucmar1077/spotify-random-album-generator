import axios from 'axios';
import { useState } from 'react';
import { useStateProvider } from "../../utils/StateProvider.jsx";
import './RandomGenerator.css';
import Sidebar from '../Sidebar/Sidebar.jsx';
import TrackListing from '../TrackListing/TrackListing.jsx';
import genres from '../../data/genres.json';

export default function RandomGenerator() {
    const [albumCover, setAlbumCover] = useState('');
    const [artistName, setArtistName] = useState('');
    const [albumName, setAlbumName] = useState('');
    const [albumReleaseDate, setAlbumReleaseDate] = useState('');
    const [albumRuntime, setAlbumRuntime] = useState('');
    const [albumUrl, setAlbumUrl] = useState('');
    const [artistUrl, setArtistUrl] = useState('');

    // tracklisting.jsx
    const [trackList, setTrackList] = useState([])

    // sidebar.jsx
    const [filters, setFilters] = useState({
        genre: "",
        decade: "",
        market: "",
    });

    const handleFilterChange = (updatedFilters) => {
        setFilters(updatedFilters);
        console.log("Filters updated: ", updatedFilters);
    }

    // idk ngl
    const [{ token, dispatch }] = useStateProvider();

    const formatMilliseconds = (trackDuration) => {
        const totalSeconds = Math.floor(trackDuration / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        return(`${minutes}:${formattedSeconds}`);
    };

    const getRandomGenre = () => {
        const randomIndex = Math.floor(Math.random() * genres.length);
        // console.log(genres[randomIndex].name);
        return genres[randomIndex].name;
    };

    const getRandomLetter = () => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'
        const randomIndex = Math.floor(Math.random() * 26);
        const randomLetter = alphabet.charAt(randomIndex);
        return randomLetter;
    };

    const getRandomAlbumId = async () => {
        try {
            const genre = filters.genre || getRandomGenre();
            const decade = filters.decade || "";
            const market = filters.market || "US";
    
            // Example search query: "f genre:Rock" or "a genre:Melancholia year:1990-1999"
            const searchQuery = decade
                ? `${getRandomLetter()} genre:${genre} year:${decade}`
                : `${getRandomLetter()} genre:${genre}`;
    
            const searchParams = {
                q: searchQuery,
                type: 'track',
                market: market,
                limit: 1,
                offset: Math.floor(Math.random() * 200),
            };
    
            const response = await axios.get(`https://api.spotify.com/v1/search`, {
                params: searchParams,
                headers: { Authorization: `Bearer ${token}` },
            });
    
            const track = response.data.tracks?.items[0];
            return track?.album?.id || null;
        } catch (error) {
            console.error("Error in getRandomAlbumId:", error);
            return null; 
        }
    };

    const getAlbumFromId = async (albumId) => {
        try {
            if (!albumId) return null;
            const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Error in getAlbumFromId:", error);
            return null;
        }
    };

    const loadAlbumDetails = async () => {
        const albumId = await getRandomAlbumId();
        const albumData = await getAlbumFromId(albumId);

        if (!albumData) {
            console.warn("Album data not found");
            return;
        };

        const artistName = albumData.artists[0]?.name;
        if (artistName === "Various Artists" || artistName === "Covers Culture") {
            return;
        };

        setTrackList(albumData.tracks.items);
        setAlbumCover(albumData.images[0].url);
        setAlbumUrl(albumData.external_urls.spotify);
        setArtistUrl(albumData.artists[0].external_urls.spotify);
        setAlbumName(albumData.name);
        setArtistName(albumData.artists[0].name);
        setAlbumReleaseDate(albumData.release_date);

        const arrayOfTracks = albumData.tracks.items;
        const totalRuntime = arrayOfTracks.reduce((acc, curr) => acc + curr.duration_ms, 0);
        setAlbumRuntime(formatMilliseconds(totalRuntime));
    };

    return (
        <div className="random-generator">
            <Sidebar localFilters={filters} onFilterChange={handleFilterChange}/>
            <div className="random-generator-container">
                <div className="album-display">
                    <a href={albumUrl} target="_blank">
                        <img 
                            src={albumCover}
                            alt={albumName ? `Album cover for ${albumName}` : ""}
                            className="album-cover"   
                            draggable="false" 
                        />
                    </a>
                    <div className="album-info">
                        <a href={albumUrl} target="_blank">
                            <div className="album-title"><span>album</span>{albumName}</div>
                        </a>
                        <a href={artistUrl} target="_blank">
                            <div className="album-artist"><span>artist</span>{artistName}</div>
                        </a>
                        <div className="album-genres"><span>date</span>{albumReleaseDate}</div>
                        <div className="album-runtime"><span>runtime</span>{albumRuntime}</div>
                    </div>
                </div>
                <button className="generate-album-button" onClick={loadAlbumDetails}>Generate Album</button>
                <TrackListing trackList={trackList}/>
            </div>
        </div>
    );
}