import { Routes, Route } from "react-router-dom";
import TracksPage from "./pages/TracksPage.jsx";
import EditTrackPage from "./pages/EditTrackPage.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="app-content">
        <Routes>
          <Route path="/" element={<TracksPage />} />
          <Route path="/tracks" element={<TracksPage />} />
          <Route path="/tracks/new" element={<EditTrackPage mode="create" />} />
          <Route path="/tracks/:id/edit" element={<EditTrackPage mode="edit" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
