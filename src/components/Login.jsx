import styled from "styled-components";

export default function Login() {
  const handleClick = () => {
    const clientId = "049c2a2da884423888a1efec2a3fd3a3";
    // const redirectUrl = "http://localhost:5173/";
    const redirectUrl = "https://spotify-clone-react-app-roan.vercel.app/";
    const apiUrl = "https://accounts.spotify.com/authorize";
    const scope = [
      "user-read-email",
      "user-read-private",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-read-playback-position",
      "user-top-read",
    ];
    window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope.join(
      " "
    )}&response_type=token&show_daialog=true`;
  };

  return (
    <Container className="flex flex-col items-center justify-center w-[100vw] h-[100vh] bg-[#1db954] gap-20">
      <img
        className="h-[20vh]"
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_Black.png"
        alt="spotify"
      />
      <button
        onClick={handleClick}
        className="bg-black text-[#49f585] text-[1.4rem] px-20 py-4 rounded-[5rem] border-none cursor-pointer"
      >
        Connect Spotify
      </button>
    </Container>
  );
}

const Container = styled.div``;
