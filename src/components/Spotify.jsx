import { useEffect, useRef, useState } from "react";
import { useStateProvider } from "../utils/StateProvider";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Body from "./Body";
import Footer from "./Footer";
import axios from "axios";
import { reducerCases } from "../utils/Constants";

export default function Spotify() {
  const [{ token }, dispatch] = useStateProvider();
  const bodyRef = useRef();
  const [navBackground, setNavBackground] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);
  const bodyScrolled = () => {
    bodyRef.current.scrollTop >= 30
      ? setNavBackground(true)
      : setNavBackground(false);
    bodyRef.current.scrollTop >= 268
      ? setHeaderBackground(true)
      : setHeaderBackground(false);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });
        const userInfo = {
          userid: data.id,
          userName: data.display_name,
        };
        dispatch({ type: reducerCases.SET_USER, userInfo });
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    getUserInfo();
  }, [dispatch, token]);

  return (
    <Container className="max-w-[100vw] max-h-[100vh] overflow-hidden grid">
      <div className="spotify_body grid w-[100%] h-[100%]">
        <Sidebar />
        <div
          className="body w-[100%] h-[100%] overflow-auto"
          ref={bodyRef}
          onScroll={bodyScrolled}
        >
          <Navbar navBackground={navBackground} />
          <div className="body_contents">
            <Body headerBackground={headerBackground} />
          </div>
        </div>
      </div>
      <div className="spotify_footer">
        <Footer />
      </div>
    </Container>
  );
}

const Container = styled.div`
  grid-template-rows: 85vh 15vh;
  .spotify_body {
    grid-template-columns: 15vw 85vw;
    background: linear-gradient(transparent, rgba(0, 0, 0, 1));
    background-color: rgb(32, 87, 100);
    .body {
      &::-webkit-scrollbar {
        width: 0.7rem;
        &-thumb {
          background-color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
`;
