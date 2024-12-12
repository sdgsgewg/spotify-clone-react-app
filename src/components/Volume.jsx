import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import styled from "styled-components";

export default function Volume() {
  const [{ token }] = useStateProvider();
  const sliderRef = useRef(null);
  const [volume, setVolume] = useState(50); // Default to 50 if the API call fails

  // Fetch the current volume level
  useEffect(() => {
    const fetchVolume = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/me/player`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const currentVolume = response.data?.device?.volume_percent;
        if (currentVolume !== undefined) {
          setVolume(currentVolume);
          updateSliderBackground(currentVolume);
        }
      } catch (error) {
        console.log("Error fetching current volume:", error);
      }
    };

    fetchVolume();
  }, [token]);

  // Update slider background based on value
  const updateSliderBackground = (value) => {
    if (sliderRef.current) {
      sliderRef.current.style.background = `linear-gradient(to right, white ${value}%, gray ${value}%)`;
    }
  };

  const handleVolumeChange = async (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume); // Update local state
    updateSliderBackground(newVolume); // Update background dynamically
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/volume`,
        {},
        {
          params: {
            volume_percent: newVolume,
          },
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log("Error changing track volume:", error);
    }
  };

  return (
    <Container>
      <input
        ref={sliderRef}
        type="range"
        min="0"
        max="100"
        value={volume} // Controlled by state
        onChange={handleVolumeChange}
        onMouseUp={handleVolumeChange}
      />
    </Container>
  );
}

const Container = styled.div`
  input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 0.5rem;
    background: linear-gradient(
      to right,
      white var(--value, 0%),
      gray var(--value, 0%)
    ); /* Dynamically update the filled track color */
    border-radius: 0.25rem;
    cursor: pointer;
  }

  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    display: none;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }

  input[type="range"]:hover::-webkit-slider-thumb {
    display: block;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    border-radius: 0.25rem;
  }
`;
