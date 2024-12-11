import styled from "styled-components";
import CurrentTrack from "./CurrentTrack";
import PlayerControls from "./PlayerControls";
import Volume from "./Volume";

export default function Footer() {
  return (
    <Container className="w-[100%] h-[100%] bg-[#181818] grid items-center justify-center px-4">
      <CurrentTrack />
      <PlayerControls />
      <Volume />
    </Container>
  );
}

const Container = styled.div`
  border-top: 1px solid #282828;
  grid-template-columns: 1fr 2fr 1fr;
`;
