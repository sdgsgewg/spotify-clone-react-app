import { useStateProvider } from "../utils/StateProvider";
import { useEffect } from "react";
import styled from "styled-components";
import { AiFillClockCircle } from "react-icons/ai";
import axios from "axios";
import { reducerCases } from "../utils/Constants";

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

  const msToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  const playTrack = async (
    id,
    name,
    artists,
    image,
    context_uri,
    track_number
  ) => {
    try {
      const response = await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        {
          context_uri,
          offset: {
            position: track_number - 1,
          },
          position_ms: 0,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 204) {
        const currentlyPlaying = {
          id,
          name,
          artists,
          image,
        };
        dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying });
        dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
      } else {
        dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
      }
    } catch (error) {
      console.error("Error playing track: ", error.response.data);
    }
  };

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
              {selectedPlaylist.tracks.map(
                (
                  {
                    id,
                    name,
                    artists,
                    image,
                    duration,
                    album,
                    context_uri,
                    track_number,
                  },
                  index
                ) => {
                  return (
                    <div
                      className="row py-2 px-4 grid items-center"
                      key={id}
                      onClick={() =>
                        playTrack(
                          id,
                          name,
                          artists,
                          image,
                          context_uri,
                          track_number
                        )
                      }
                    >
                      <div className="col">
                        <span>{index + 1}</span>
                      </div>
                      <div className="col detail flex gap-4">
                        <div className="image">
                          <img className="h-[40px]" src={image} alt="track" />
                        </div>
                        <div className="info flex flex-col">
                          <span className="name">{name}</span>
                          <span>{artists.join(", ")}</span>
                        </div>
                      </div>
                      <div className="col">
                        <span>{album}</span>
                      </div>
                      <div className="col">
                        <span>{msToMinutesAndSeconds(duration)}</span>
                      </div>
                    </div>
                  );
                }
              )}
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
