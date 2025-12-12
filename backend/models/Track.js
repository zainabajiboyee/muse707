import mongoose from "mongoose";


const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },

  artist: { type: String, required: true },
 
  mood: { type: String, required: true },

  imageUrl: { type: String, required: false },

  linkUrl: { type: String, required: false },

  playlistName: { type: String, required: false },

  createdAt: { type: Date, default: Date.now }
});

const Track = mongoose.model("Track", trackSchema);


export default Track;
