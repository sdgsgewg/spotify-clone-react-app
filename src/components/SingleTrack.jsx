import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";

export default function SingleTrack({ track, index }) {
  const [{ token }, dispatch] = useStateProvider();

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

  const msToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  return (
    <div
      className="row py-2 px-4 grid items-center cursor-pointer"
      key={track.id}
      onClick={() =>
        playTrack(
          track.id,
          track.name,
          track.artists,
          track.image,
          track.context_uri,
          track.track_number
        )
      }
    >
      <div className="col">
        <span>{index + 1}</span>
      </div>
      <div className="col detail flex gap-4">
        <div className="image">
          <img className="h-[40px]" src={track.image} alt="track" />
        </div>
        <div className="info flex flex-col">
          <span className="name text-white font-[500]">{track.name}</span>
          <span className="text-slate-400 text-sm">{track.artists.join(", ")}</span>
        </div>
      </div>
      <div className="col">
        <span className="text-slate-400">{track.album}</span>
      </div>
      <div className="col">
        <span className="text-slate-400">{msToMinutesAndSeconds(track.duration)}</span>
      </div>
    </div>
  );
}
