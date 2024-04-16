import axios from "axios";
import { useState, useEffect } from "react";

import { useLakes } from "@/context/LakesContext";

function Profile() {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null); // Profile image file
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { lakes, isLoading: lakesLoading, error: lakesError } = useLakes(); // Destructure lakes, isLoading, and error

  useEffect(() => {
    // Fetch profile data (username and profile image)
    fetchProfileData();
  }, []);

  console.log(previewImage);

  const fetchProfileData = async () => {
    try {
      // Fetch profile data from the backend
      const response = await axios.get("/users/profile");
      const data = response.data;
      setUsername(data.username);
      console.log(response);
      if (data.imageBlob) {
        // Convert bytea to Base64
        setPreviewImage(`data:image/png;base64,${data.imageBlob}`);
      } else {
        setPreviewImage("../../public/default_profile.jpg"); // Default image path
      }
    } catch (err) {
      setError("Failed to fetch profile data");
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update profile data (username and profile image)
      const formData = new FormData();
      formData.append("username", username);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await axios.post("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to update profile");
      }

      setIsLoading(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto">
        <div className="flex justify-between">
          <div className="relative px-8 py-10 bg-white mx-8 md:mx-0 shadow-lg rounded-3xl sm:p-10">
            <div className="max-w-md mx-auto">
              <div className="flex items-center space-x-5">
                {/* Profile picture */}
                <div className="h-32 w-32 rounded-full overflow-hidden">
                  <img
                    src={previewImage || "/default-profile-image.jpg"} // Default image path
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="block pl-2 font-semibold text-2xl self-start text-black">
                  <h2 className="leading-relaxed">{username}</h2>
                  <p className="text-sm font-normal leading-relaxed">
                    Atnaujinkite savo profilį
                  </p>
                </div>
              </div>
              {error && (
                <p className="text-red-500 text-xs italic mt-4">{error}</p>
              )}
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="relative">
                  <label
                    htmlFor="username"
                    className="leading-7 text-sm text-black"
                  >
                    Vardas
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-black py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                    required
                  />
                </div>
                <div className="relative">
                  <label
                    htmlFor="profileImage"
                    className="leading-7 text-sm text-black"
                  >
                    Profilio nuotrauka
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-black py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="text-white bg-black border-0 py-2 px-8 focus:outline-none hover:bg-gray-800 rounded-lg text-lg"
                >
                  {isLoading ? "Saugoma..." : "Išsaugoti"}
                </button>
              </form>
            </div>
          </div>
          <div className="relative px-8 py-10 bg-white mx-8 md:mx-4 shadow-lg rounded-3xl sm:p-10">
            <div className="max-w-md mx-auto">
              <div className="flex items-center space-x-5">
                <div>Mėgstami ežerai</div>
              </div>
              <div className="max-h-80 overflow-y-auto mt-4">
                {" "}
                {/* Adjust the max height as needed */}
                <ul className="divide-y divide-gray-200">
                  {lakes
                    .filter((lake) => lake.isLiked)
                    .map((lake) => (
                      <li key={lake.id} className="py-2">
                        {lake.name}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
