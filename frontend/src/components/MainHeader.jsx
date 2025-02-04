import { Link } from "react-router-dom";

export default function MainHeader() {
  return (
    <header className="flex justify-center items-center border h-[30%] w-full bg-[#27445D]">
      <nav className="w-[90%] lg:w-[85%] flex flex-wrap items-center justify-between pb-4 lg:ml-[150px]">
        <Link to="/" className="text-lg font-arima ml-4 mt-4 text-white">
          Home
        </Link>

        <ul className="flex flex-row space-x-6 md:space-x-11 mt-4 md:mt-[25px] mr-4 md:mr-[100px]">
          <li className="hover:bg-black hover:text-white p-2 hover:rounded-2xl text-lg font-arima">
            <Link to="/login" className="text-white">Log In</Link>
          </li>
          <li className="hover:bg-black hover:text-white p-2 hover:rounded-2xl text-lg font-arima">
            <Link to="/register" className="text-white">Register</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

