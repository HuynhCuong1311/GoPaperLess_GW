import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useCountry = () => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleShowPosition);
    } else {
      // console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useQuery({
    queryKey: ["getLocation"],
    queryFn: async () => {
      navigator.geolocation.getCurrentPosition(handleShowPosition);
      return address;
    },
  });

  const handleShowPosition = async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    try {
      const response = await api.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );

      const country = response.data.address?.country;
      const city = response.data.address?.city;
      const suburb = response.data.address?.suburb;
      const addressRequest = `${suburb}, ${city}, ${country}`;

      setAddress(addressRequest);
    } catch (error) {
      console.error(error);
    }
  };

  return { address };
};

useCountry.propTypes = {};

export default useCountry;
