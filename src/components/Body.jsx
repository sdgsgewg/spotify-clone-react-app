import { useStateProvider } from "../utils/StateProvider";
import { useEffect } from "react";
import styled from "styled-components";
import { AiFillClockCircle } from "react-icons/ai";
import axios from "axios";
import { reducerCases } from "../utils/Constants";
import SingleTrack from "./SingleTrack";

export default function Body({ headerBackground }) {
  const [{ token, selectedPlaylistId, selectedPlaylist }, dispatch] =
    useStateProvider();

  useEffect(() => {
    const getInitialPlaylist = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${selectedPlaylistId}`,
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        const selectedPlaylist = {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description.startsWith("<a")
            ? ""
            : response.data.description,
          image: response.data.images[0].url,
          tracks: response.data.tracks.items.map(({ track }) => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist) => artist.name),
            image: track.album.images[2].url,
            duration: track.duration_ms,
            album: track.album.name,
            context_uri: track.album.uri,
            track_number: track.track_number,
          })),
        };
        dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist });
      } catch (error) {
        console.log("Error fetching playlists: ", error);
      }
    };
    getInitialPlaylist();
  }, [token, selectedPlaylistId, dispatch]);

  return (
    <Container headerBackground={headerBackground}>
      {selectedPlaylist && (
        <>
          <div className="playlist mx-8 flex items-center gap-8">
            <div className="image">
              <img
                className="h-[15rem]"
                src={selectedPlaylist.image}
                alt="selectedPlaylist"
              />
            </div>
            <div className="details flex flex-col gap-4 text-[#e0dede]">
              <span className="type">PLAYLIST</span>
              <h1 className="title text-white text-[4rem]">
                {selectedPlaylist.name}
              </h1>
              <p className="description">{selectedPlaylist.description}</p>
            </div>
          </div>
          <div className="list">
            <div
              className={`header_row grid items-center text-[#dddcdc] mt-4 sticky top-[15vh] py-4 px-12 transition duration-300 ease-in-out ${
                headerBackground ? "bg-[#000000dc]" : "bg-none"
              }`}
            >
              <div className="col">
                <span>#</span>
              </div>
              <div className="col">
                <span>TITLE</span>
              </div>
              <div className="col">
                <span>ALBUM</span>
              </div>
              <div className="col">
                <span>
                  <AiFillClockCircle />
                </span>
              </div>
            </div>
            <div className="tracks mx-[2rem] flex flex-col mb-20">
              {selectedPlaylist.tracks.map((track, index) => (
                <SingleTrack track={track} index={index} key={track.id} />
              ))}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  .playlist {
    .image {
      img {
        box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
      }
    }
  }
  .list {
    .header_row {
      grid-template-columns: 0.3fr 3fr 2fr 0.3fr;
    }
    .tracks {
      .row {
        grid-template-columns: 0.3fr 3fr 2fr 0.3fr;
        &:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }
        .col {
          display: flex;
          align-items: center;
          color: #dddcdc;
        }
      }
    }
  }

  // .header_row div,
  // .tracks .row div {
  //   border: 1px solid red; /* Debugging purpose only */
  // }
`;
