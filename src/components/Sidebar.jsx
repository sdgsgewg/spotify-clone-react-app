import styled from "styled-components";
import { IoLibrary } from "react-icons/io5";
import { MdHomeFilled, MdSearch } from "react-icons/md";
import Playlists from "./Playlists";

export default function Sidebar() {
  return (
    <Container className="bg-black text-[#b3b3b3] flex flex-col w-[100%] h-[100%]">
      <div className="top_links flex flex-col">
        <div className="logo text-center my-4">
          <img
            className="max-w-[80%] h-[auto]"
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_White.png"
            alt="spotify"
          />
        </div>
        <ul className="list-none flex flex-col gap-4 p-4">
          <li>
            <MdHomeFilled />
            <span>Home</span>
          </li>
          <li>
            <MdSearch />
            <span>Search</span>
          </li>
          <li>
            <IoLibrary />
            <span>Your Library</span>
          </li>
        </ul>
      </div>
      <Playlists />
    </Container>
  );
}

const Container = styled.div`
  .top_links {
    ul {
      li {
        display: inline-flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          color: white;
        }
      }
    }
  }
`;
