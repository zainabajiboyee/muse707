import TrackCard from "./TrackCard.jsx";

const TrackList = ({ tracks }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.5rem",
        marginTop: "1rem",
        padding: "0 1rem",
      }}
    >
      {tracks.map((track) => (
        <TrackCard key={track._id} track={track} />
      ))}
    </div>
  );
};

export default TrackList;
