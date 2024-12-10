import './TrackListing.css';

export default function TrackListing({ trackList }) {

    // formats milliseconds to minute:seconds format
    const formatMilliseconds = (trackDuration) => {
        const totalSeconds = Math.floor(trackDuration / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        return(`${minutes}:${formattedSeconds}`);
    }

    return (
        <div className="track-listing-container">
            {trackList.map((track, index) => (
                <div className="track-container">
                    <a href={trackList[index].external_urls.spotify} target="_blank">
                        <div className="track"><span>{index + 1}</span>{track.name}</div>
                    </a>
                    <div className="track-length">{formatMilliseconds(track.duration_ms)}</div>
                </div>
            ))}
        </div>
    );
}