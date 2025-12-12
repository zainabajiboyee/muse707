import express from "express";     
import mongoose from "mongoose";    
import cors from "cors";            
import Track from "./models/Track.js"; 
import dotenv from "dotenv";
import { upload } from './config/cloudinary.js';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)

  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


app.get("/api/tracks/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    
    const tracks = await Track.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { artist: { $regex: q, $options: "i" } },
        { mood: { $regex: q, $options: "i" } },
        { playlistName: { $regex: q, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.json(tracks);
  } catch (error) {
    console.error("Error searching tracks:", error);
    res.status(500).json({ message: "Error searching tracks" });
  }
});


app.get("/api/tracks", async (req, res) => {
  try {
    const { mood, playlist } = req.query;

    const filter = {};
    if (mood) filter.mood = mood;
    if (playlist) filter.playlistName = playlist;

    const tracks = await Track.find(filter).sort({ createdAt: -1 });

    res.json(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).json({ message: "Error fetching tracks" });
  }
});


app.post("/api/tracks", async (req, res) => {
  try {
    const track = new Track(req.body);
    await track.save();
    res.status(201).json(track);
  } catch (error) {
    console.error("Error creating track:", error);
    res.status(400).json({ message: "Error creating track" });
  }
});


app.get("/api/tracks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const track = await Track.findById(id);

    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    res.json(track);
  } catch (error) {
    console.error("Error fetching track:", error);
    res.status(500).json({ message: "Error fetching track" });
  }
});


app.put("/api/tracks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTrack = await Track.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedTrack) {
      return res.status(404).json({ message: "Track not found" });
    }

    res.json(updatedTrack);
  } catch (error) {
    console.error("Error updating track:", error);
    res.status(500).json({ message: "Error updating track" });
  }
});


app.delete("/api/tracks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTrack = await Track.findByIdAndDelete(id);

    if (!deletedTrack) {
      return res.status(404).json({ message: "Track not found" });
    }

    res.json({
      message: "Track deleted successfully",
      track: deletedTrack,
    });
  } catch (error) {
    console.error("Error deleting track:", error);
    res.status(500).json({ message: "Error deleting track" });
  }
});


app.post("/api/upload", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    
    res.json({
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image" });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
