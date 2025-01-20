import { Link } from "react-router-dom";

const SongCard = ({ item, type }) => {
  console.log("SongCard item:", item, "type:", type);
  return (
    <div className="p-2 bd-highlight">
      <Link
        to={`/${type === "artist" ? "artist" : "song"}/${item._id}`}
        style={{ textDecoration: "none" }}
      >
        <div
          className="list-item card"
          style={{
            width: "9rem",
            height: "12rem", // Ensure this height is consistent
            backgroundColor: "#ebebeb",
            border: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <img
            height="100%" // Make the image height fill the container
            width="100%"
            className={`card-img-top ${
              type === "artist" ? "rounded-circle" : ""
            }`}
            alt={type === "artist" ? item.displayName : item.title}
            src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${item.imageUrl}`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "/assets/images/default_image.png";
            }}
            style={{ objectFit: "cover", height: "100%" }}
          />
          <div className="card-body">
            <p className="card-text text-center text-truncate">
              <small>{type === "artist" ? item.displayName : item.title}</small>
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SongCard;
