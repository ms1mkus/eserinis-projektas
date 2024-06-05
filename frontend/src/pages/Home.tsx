import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LakeList = () => {
  const [lakes, setLakes] = useState([]);

  useEffect(() => {
    const fetchLakes = async () => {
      try {
        const response = await axios.get("/lakes");
        setLakes(response.data);
      } catch (error) {
        console.error("Error fetching lakes:", error);
      }
    };

    fetchLakes();
  }, []); // Empty array as second argument to useEffect to run only on mount

  return (
    <MapContainer
      center={[55.3, 23.9]} // Center coordinates for Lithuania
      style={{ height: "100vh", width: "100wh" }}
      zoom={8} // Zoom level adjusted for a better view of Lithuania
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[55.3, 23.9]}>
        {" "}
        // Marker position adjusted to Lithuania center
        <Popup>
          Lithuania <br /> The geographic center.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LakeList;
