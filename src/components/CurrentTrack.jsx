import { useEffect } from "react";
import { useStateProvider } from "../utils/StateProvider";
import styled from "styled-components";
import axios from "axios";
import { reducerCases } from "../utils/Constants";

export default function CurrentTrack() {
  const [{ token, currentlyPlaying }, dispatch] = useStateProvider();

  useEffect(() => {
    const getCurrentTrack = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data !== "") {
          const { item } = response.data;
          const currentlyPlaying = {
            id: item.id,
            name: item.name,
            artists: item.artists.map((artist) => artist.name),
            image: item.album.images[2].url,
          };
          dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying });
        }
      } catch (error) {
        console.log("Error fetching current track:", error);
      }
    };
    getCurrentTrack();
  }, [token, dispatch, currentlyPlaying]); // Add currentlyPlaying as a dependency

  return (
    <Container>
      {currentlyPlaying && (
        <div className="track flex items-center gap-4">
          <div className="track_image">
            <img src={currentlyPlaying.image} alt="currentlyPlaying" />
          </div>
          <div className="track_info flex flex-col gap-[0.3rem]">
            <h4 className="text-white">{currentlyPlaying.name}</h4>
            <h6 className="text-[#b3b3b3]">
              {currentlyPlaying.artists.join(", ")}
            </h6>
          </div>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div``;
