import { useNavigate } from "react-router-dom";
import "./TrackCard.css";

const TrackCard = ({ track }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/tracks/${track._id}/edit`); 
  };

  const handleViewLink = () => { 
    if (track.linkUrl) {
      window.open(track.linkUrl, '_blank'); 
    }
  };

  return ( 
    <div className="track-card">
      {track.imageUrl ? (
        <img
          src={track.imageUrl}
          alt={track.title}
          className="track-card-image"
        />
      ) : (
        <div className="track-card-placeholder">
          🎸
        </div>
      )}

      <div className="track-card-content">
        <h3 className="track-card-title">{track.title}</h3>
        <p className="track-card-artist">{track.artist}</p>

        <div className="track-card-tags"> 
          {track.mood && (
            <span className="track-card-tag">{track.mood}</span>
          )}
          {track.playlistName && (
            <span className="track-card-tag track-card-tag-playlist">
              {track.playlistName}
            </span>
          )}
        </div>

        <div className="track-card-buttons"> 
          <button onClick={handleEdit} className="track-card-btn track-card-btn-edit">
            Edit
          </button>
          {track.linkUrl && (
            <button onClick={handleViewLink} className="track-card-btn track-card-btn-listen">
              Listen
            </button> 
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
