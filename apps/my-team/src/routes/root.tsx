import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";
import { manifest } from "../manifest";

const Root = () => {
  const isReady = manifest.useReady();
  
  return (
    <div className="md:mx-12 m-auto p-4 my-2 rounded">
      <header className="flex">
        <Link to="/">
          <h1 className="font-extrabold text-6xl p-2 row-span-full col-span-full tracking-tighter">
            My team {isReady ? "T" : "N"}
          </h1>
        </Link>
        <div className="flex-grow" />
        {isReady? null: <Spinner className="text-gray-500 w-8" />}
      </header>
      <Outlet />
    </div>
  );
};

export default Root;
