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
import { useDarkMode } from "@/context/DarkModeContext";
import axios from "axios";
import Heart from "react-animated-heart";

export type Fish = {
  id: number;
  description: string;
  name: string;
  count: number;
};

const Map: React.FC = () => {
  const { lakes, isLoading, error, lovedOnly, setLakes } = useLakes();
  const [selectedLake, setSelectedLake] = useState<Lake | null>(null);
  const [selectedLakeFishes, setSelectedLakeFishes] = useState<any[]>([]);
  const { darkMode } = useDarkMode();
  const [isLoved, setLoved] = useState(false);
  const [likedUsers, setLikedUsers] = useState<string[]>([]);

  const fetchLakeData = async () => {
    setLoved(false);
    if (!selectedLake?.id) return;
    try {
      const response = await axios.get(`/lake/${selectedLake.id}`);
      setSelectedLakeFishes(response.data);

      const likesResponse = await axios.get(`/lake/likes/${selectedLake.id}`);
      setLoved(likesResponse.data.hasUserLiked);
      setLikedUsers(likesResponse.data.likedUsers || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const shownLakes = lovedOnly ? lakes.filter((lake) => lake.isLiked) : lakes;

  const toggleLike = async () => {
    try {
      await axios.post(`/lake/like`, {
        like: !isLoved,
        lakeId: selectedLake?.id,
      });
      setLakes(
        lakes.map((lake) => ({
          ...lake,
          isLiked: lake.id === selectedLake?.id ? !isLoved : lake.isLiked,
        }))
      );
      setLoved(!isLoved);
      fetchLakeData();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const fishersText = () => {
    if (likedUsers.length % 10 === 1) {
      return "žvejas";
    }
    if (likedUsers.length > 0 && likedUsers.length < 10) {
      return "žvejai";
    }
    return "žvejų";
  };

  useEffect(() => {
    setSelectedLakeFishes([]);
    fetchLakeData();
  }, [selectedLake?.id]);

  const openModal = (lake: Lake) => {
    setSelectedLake(lake);
  };

  const closeModal = () => {
    setSelectedLake(null);
  };

  if (isLoading) {
    return <div>Kraunasi...</div>;
  }

  if (error) {
    return <div>Klaida: {error}</div>;
  }
  console.log(selectedLakeFishes);
  return (
    <div className="relative">
      <MapContainer
        center={[55.3, 23.9]}
        style={{ height: "92vh", width: "100wh", zIndex: 0 }}
        zoom={8}
        scrollWheelZoom={true}
      >
        <TileLayer
          url={
            darkMode
              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          }
          attribution={
            darkMode
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              : '&copy; <a href="https://www.arcgis.com/">Esri</a>'
          }
        />
        {shownLakes.map((lake) => (
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
              <DialogTitle className=" flex flex-row items-center justify-between">
                <h1 className="text-3xl">{selectedLake.name}</h1>
                <div>
                  <Heart isClick={isLoved} onClick={toggleLike} />
                  <p className="-mt-4 text-blue-800 text-center">
                    {likedUsers.length > 0 &&
                      `${likedUsers.length} ${fishersText()}`}
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-black p-6 ">
              <div className="mb-4">
                <span className="font-semibold text-xl">
                  Plotas:{" "}
                  <p className="inline text-gray-900">
                    {selectedLake.area} km²
                  </p>
                </span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-xl">
                  Gylis:{" "}
                  <p className="inline text-gray-900">
                    {selectedLake.depth} m.
                  </p>
                </span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-xl">
                  Aprašymas:{" "}
                  <p className="inline text-gray-900">
                    {selectedLake.description}
                  </p>{" "}
                </span>
              </div>
              <br></br>

              <div className="container mx-auto p-4">
                {selectedLakeFishes?.length > 0 ? (
                  <>
                    <p className="text-4xl font-bold mb-12 text-center">
                      Šiame ežere galite pagauti:
                    </p>
                    <Carousel>
                      <CarouselContent>
                        {selectedLakeFishes.map((fish) => (
                          <CarouselItem key={fish.id} className="basis-2/3 m-2">
                            <div className="bg-white rounded-lg shadow-lg">
                              <img
                                src={`../../../../public/${fish.name}.png`}
                                alt={fish.name}
                                className="w-full h-32 object-cover rounded-lg mb-4"
                              />
                              <div className="mx-auto text-center">
                                <p className="text-xl font-semibold text-center">
                                  {fish.name}
                                </p>
                                <br />
                                {parseInt(fish.count) % 10 === 0 ||
                                (parseInt(fish.count) > 10 &&
                                  parseInt(fish.count) < 20) ? (
                                  <p>
                                    Ši žuvis buvo pagauta: {fish.count} kartų
                                  </p>
                                ) : parseInt(fish.count) % 10 === 1 ? (
                                  <p>
                                    Ši žuvis buvo pagauta: {fish.count} kartą
                                  </p>
                                ) : (
                                  <p>
                                    Ši žuvis buvo pagauta: {fish.count} kartus
                                  </p>
                                )}
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-black text-center">
                    Šiame ežere nėra žuvų 😢
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Map;
