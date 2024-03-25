import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Point } from "geojson";

export type Lake = {
  id: number;
  name: string;
  area: number;
  depth: number;
  description: string;
  location: Point;
};

const Map: React.FC = () => {
  const [lakes, setLakes] = useState<Lake[]>([]);

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
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {lakes.map((lake) => (
        <Marker
          key={lake.id}
          position={[
            lake.location.coordinates[1],
            lake.location.coordinates[0],
          ]}
        >
          <Popup>
            <strong>{lake.name}</strong> <br />
            Area: {lake.area} <br />
            Depth: {lake.depth} <br />
            Description: {lake.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
