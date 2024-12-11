import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import React from "react";
import styled from "styled-components";

export default function Volume() {
  const [{ token }] = useStateProvider();

  const setVolume = async (e) => {
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/volume`,
        {},
        {
          params: {
            volume_percent: parseInt(e),
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
    <Container className="flex justify-end content-center">
      <input
        className="w-[15rem] h-[0.5rem] rounded-[2rem]"
        type="range"
        min={0}
        max={100}
        onMouseUp={(e) => setVolume(e.target.value)}
      />
    </Container>
  );
}

const Container = styled.div``;
