import { allLanguages, Language } from "@dswistowski/destiny-manifest-react";
import { Link, Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";
import { manifest } from "../manifest";
import { useStore } from "../store";

const Root = () => {
  const isReady = manifest.useReady();
  const language = useStore((state) => state.language);
  const changeLanguage = useStore((state) => state.changeLanguage);

  return (
    <div className="md:mx-12 m-auto p-4 my-2 rounded">
      <header className="flex">
        <Link to="/">
          <h1 className="font-extrabold text-6xl p-2 row-span-full col-span-full tracking-tighter">
            My team
          </h1>
        </Link>
        <div className="flex-grow" />
        {isReady ? null : <Spinner className="text-gray-500 w-8" />}
        <select
          className="bg-transparent"
          value={language}
          onChange={(e) =>
            changeLanguage(e.target.value as unknown as Language)
          }
        >
          {allLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </header>
      <Outlet />
    </div>
  );
};

export default Root;
