import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditTrackPage.css";

const EditTrackPage = ({ mode }) => {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    mood: "",
    imageUrl: "",
    linkUrl: "",
    playlistName: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    if (isEdit && id) {
      const fetchTrack = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/tracks/${id}`);
          setFormData(response.data);
          setImagePreview(response.data.imageUrl);
        } catch (err) {
          console.error("Error fetching track:", err);
          setError("Failed to load track");
        }
      };
      fetchTrack();
    }
  }, [isEdit, id]);

 
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
     
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be smaller than 5MB');
        return;
      }

      setSelectedFile(file);
      setError(null);

      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const uploadImage = async () => {
    if (!selectedFile) return formData.imageUrl;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', selectedFile);

      const response = await axios.post('http://localhost:4000/api/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.imageUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      
      let imageUrl = formData.imageUrl;
      if (selectedFile) {
        imageUrl = await uploadImage();
      }

      const trackData = {
        ...formData,
        imageUrl,
      };

      if (isEdit) {
        await axios.put(`http://localhost:4000/api/tracks/${id}`, trackData);
      } else {
        await axios.post("http://localhost:4000/api/tracks", trackData);
      }
      
      navigate("/tracks");
    } catch (err) {
      console.error("Error saving track:", err);
      setError(err.message || "Failed to save track");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this track?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/api/tracks/${id}`);
      navigate("/tracks");
    } catch (err) {
      console.error("Error deleting track:", err);
      setError("Failed to delete track");
    }
  };

  if (error && isEdit) return <div className="edit-track-error">{error}</div>;

  return (
    <div className="edit-track-page">
      <h1>{isEdit ? "Edit Track" : "Add New Track"}</h1>

      <form onSubmit={handleSubmit} className="edit-track-form">
       

        <div className="image-upload-section">
          <label>Album/Cover Image:</label>
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
          />
          <small className="file-input-hint">Max 5MB. Accepts JPG, PNG, GIF, WebP</small>
        </div>

        <div className="form-group">
          <label>Title:</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Artist:</label>
          <input
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mood:</label>
          <input
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            placeholder="e.g. chill, gym, happy"
          />
        </div>

        <div className="form-group">
          <label>Link URL (Spotify/YouTube):</label>
          <input
            name="linkUrl"
            value={formData.linkUrl}
            onChange={handleChange}
            placeholder="https://open.spotify.com/..."
          />
        </div>

        <div className="form-group">
          <label>Playlist Name:</label>
          <input
            name="playlistName"
            value={formData.playlistName}
            onChange={handleChange}
            placeholder="e.g. Study, Workout"
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-buttons">
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading || uploading}
          >
            {uploading ? "Uploading image..." : loading ? "Saving..." : isEdit ? "Save Changes" : "Create Track"}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="btn-delete"
            >
              Delete Track
            </button>
          )}
        </div>
      </form>

      <button 
        onClick={() => navigate("/tracks")} 
        className="btn-back"
      >
        Back to Tracks
      </button>
    </div>
  );
};

export default EditTrackPage;
