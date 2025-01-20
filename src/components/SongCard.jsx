import { Link } from "react-router-dom";

const SongCard = ({ item, type }) => {
  console.log("SongCard item:", item, "type:", type);

  // Check if user is paid
  const user = JSON.parse(localStorage.getItem("user"));
  const isPaid = user?.isPaid ?? false; // Fallback to false if attribute doesn't exist

  return (
    <div className="p-2 bd-highlight">
      <Link
        to={
          isPaid ? `/${type === "artist" ? "artist" : "song"}/${item._id}` : "#"
        }
        style={{
          textDecoration: "none",
          pointerEvents: isPaid ? "auto" : "none", // Disable clicking if not paid
        }}
      >
        <div
          className="list-item card"
          style={{
            width: "9rem",
            height: "12rem",
            backgroundColor: "#ebebeb",
            border: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative", // For overlay
            overflow: "hidden", // Prevent overflow from elements
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
          }}
        >
          <img
            height="100%"
            width="100%"
            className={`card-img-top ${
              type === "artist" ? "rounded-circle" : ""
            }`}
            alt={type === "artist" ? item.displayName : item.title}
            src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${item.imageUrl}`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // Prevents looping
              currentTarget.src = "/assets/images/default_image.png";
            }}
            style={{ objectFit: "cover", height: "100%" }}
          />
          <div className="card-body">
            <p className="card-text text-center text-truncate">
              <small>{type === "artist" ? item.displayName : item.title}</small>
            </p>
          </div>
          {!isPaid && (
            <div
              className="overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.9))",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "0.9rem",
                fontWeight: "bold",
                zIndex: 2,
                padding: "0.5rem",
              }}
            >
              <i
                className="fa fa-lock"
                style={{
                  fontSize: "1rem",
                  marginBottom: "0.5rem",
                  color: "#fff",
                }}
              ></i>
              Locked
              <p
                style={{
                  fontSize: "0.6rem",
                  fontWeight: "normal",
                  marginTop: "0.5rem",
                }}
              >
                Unlock premium access
              </p>
            </div>
          )}
          {!isPaid && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                zIndex: 1,
              }}
            ></div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default SongCard;
