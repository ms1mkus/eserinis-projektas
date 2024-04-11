import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Lake, useLakes } from "@/context/LakesContext";
import axios from "axios";

export type Fish = {
  id: number;
  description: string;
  name: string;
};

//MOCK FRONT END DATA
const mockFishes: Fish[] = [
  {
    id: 1,
    description: "",
    name: "LYDEKA",
  },
  {
    id: 1,
    description: "",
    name: "EŠERYS",
  },
  {
    id: 1,
    description: "",
    name: "ŠAMAS",
  },
  {
    id: 1,
    description: "",
    name: "KARPIS",
  },
];

const Map: React.FC = () => {
  const { lakes, isLoading, error } = useLakes();
  const [selectedLake, setSelectedLake] = useState<Lake | null>(null);
  const [selectedLakeData, setSelectedLakeData] = useState<Lake | null>(null);

  const fetchLakeData = async () => {
    if (!selectedLake?.id) return;
    try {
      const response = await axios.get(`/lake/${selectedLake.id}`);
      setSelectedLakeData(response.data);
      // Handle the response and update state accordingly
    } catch (error) {
      console.error("Error fetching fishes:", error);
    }
  };

  useEffect(() => {
    fetchLakeData();
  }, [selectedLake?.id]);

  const openModal = (lake: Lake) => {
    setSelectedLake(lake);
  };

  const closeModal = () => {
    setSelectedLake(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative">
      <MapContainer
        center={[55.3, 23.9]}
        style={{ height: "92vh", width: "100wh", zIndex: 0 }}
        zoom={8}
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
            eventHandlers={{
              click: () => openModal(lake),
            }}
          />
        ))}
      </MapContainer>

      {/* Dialog */}
      {selectedLake && (
        <Dialog open={true} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {selectedLake.name}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-gray-600 p-6">
              <div className="mb-4">
                <span className="font-semibold text-lg">Plotas:</span>{" "}
                {selectedLake.area} km²
              </div>
              <div className="mb-4">
                <span className="font-semibold text-lg">Gylis:</span>{" "}
                {selectedLake.depth} meters
              </div>
              <div className="mb-4">
                <span className="font-semibold text-lg">Aprašymas:</span>{" "}
                {selectedLake.description}
              </div>

              <div className="container mx-auto p-4">
                <p className="text-2xl font-bold mb-4">
                  Šiame ežere galite pagauti:
                </p>
                <Carousel>
                  <CarouselContent>
                    {mockFishes.map((fish) => (
                      <CarouselItem className="basis-1/3">
                        <div
                          key={fish.id}
                          className="bg-white rounded-lg shadow-lg "
                        >
                          <img
                            src={`/path/to/mock-fish-image-${fish.id}.jpg`}
                            alt={fish.name}
                            className="w-full h-32 object-cover rounded-lg mb-4"
                          />
                          <p className="text-xl font-semibold ">{fish.name}</p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Map;
