import { useStateProvider } from "../utils/StateProvider";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

export default function Navbar({ navBackground }) {
  const [{ userInfo }] = useStateProvider();

  return (
    <Container
      className={`flex justify-between items-center p-8 h-[15vh] sticky top-0 transition duration-300 ease-in-out ${
        navBackground ? "bg-[rgba(0,0,0,0.7)]" : "bg-none"
      }`}
    >
      <div className="search_bar bg-white w-[30%] py-2 px-16 rounded-[2rem] flex items-center gap-[0.5rem]">
        <FaSearch />
        <input
          className="border-none w-[100%] h-8"
          type="text"
          placeholder="Artist, songs, or podcasts"
        />
      </div>
      <div className="avatar bg-black py-[0.3rem] px-[0.4rem] pe-4 rounded-[2rem] flex justify-center items-center">
        <a
          className="flex items-center justify-center gap-2 no-underline text-white font-bold"
          href="#"
        >
          <CgProfile className="font-[1.3rem] bg-[#282828] p-[0.2rem] rounded-2xl text-[#c7c5c5]" />
          <span>{userInfo?.userName}</span>
        </a>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .search_bar {
    input {
      &:focus {
        outline: none;
      }
    }
  }
`;
