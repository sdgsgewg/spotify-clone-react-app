import { useStateProvider } from "../utils/StateProvider";
import styled from "styled-components";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import axios from "axios";
import { reducerCases } from "../utils/Constants";

export default function PlayerControls() {
  const [{ token, playerState }, dispatch] = useStateProvider();

  const changeTrack = async (type) => {
    try {
      await axios.post(
        `https://api.spotify.com/v1/me/player/${type}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      // Wait for Spotify to update the current track
      setTimeout(async () => {
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
        } else {
          dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying: null });
        }
      }, 500); // Add a slight delay to ensure Spotify updates the track
    } catch (error) {
      console.log("Error changing track:", error);
    }
  };

  const changeState = async () => {
    const state = playerState ? "pause" : "play";
    const response = await axios.put(
      `https://api.spotify.com/v1/me/player/${state}`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: reducerCases.SET_PLAYER_STATE,
      playerState: !playerState,
    });
  };

  return (
    <Container className="flex items-center justify-center gap-8">
      <div className="shuffle">
        <BsShuffle />
      </div>
      <div className="previous text-[2rem]">
        <CgPlayTrackPrev onClick={() => changeTrack("previous")} />
      </div>
      <div className="state text-[2rem]">
        {playerState ? (
          <BsFillPauseCircleFill onClick={changeState} />
        ) : (
          <BsFillPlayCircleFill onClick={changeState} />
        )}
      </div>
      <div className="next text-[2rem]">
        <CgPlayTrackNext onClick={() => changeTrack("next")} />
      </div>
      <div className="repeat">
        <FiRepeat />
      </div>
    </Container>
  );
}

const Container = styled.div`
  svg {
    color: #b3b3b3;
    transition: 0.2s ease-in-out;
    &:hover {
      color: white;
    }
  }
  .state {
    svg {
      color: white;
    }
  }
`;
