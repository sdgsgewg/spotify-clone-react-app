import { useEffect } from "react";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";
import styled from "styled-components";

export default function Playlists() {
  const [{ token, playlists }, dispatch] = useStateProvider();
  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        const { items } = response.data;
        const playlists = items.map(({ name, id }) => {
          return { name, id };
        });

        dispatch({ type: reducerCases.SET_PLAYLISTS, playlists });
      } catch (error) {
        console.log("Error fetching playlists:", error);
      }
    };
    getPlaylistData();
  }, [token, dispatch]);

  const changeCurrentPlaylist = (selectedPlaylistId) => {
    // setTimeout(async () => {
    // await
    dispatch({
      type: reducerCases.SET_PLAYLIST_ID,
      selectedPlaylistId,
    });
    // }, 500);
  };

  return (
    <Container className="h-[100%] overflow-hidden">
      <ul className="list-none flex flex-col gap-4 p-4 h-[52vh] max-h-[100%] overflow-auto">
        {playlists.map(({ name, id }) => {
          return (
            <li
              className="flex items-center gap-4 cursor-pointer transition duration-300 ease-in-out hover:text-white"
              key={id}
              onClick={() => changeCurrentPlaylist(id)}
            >
              {name}
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

const Container = styled.div`
  ul {
    &::-webkit-scrollbar {
      width: 0.7rem;
      &-thumb {
        background-color: rgba(255, 255, 255, 0.6);
      }
    }
  }
`;
