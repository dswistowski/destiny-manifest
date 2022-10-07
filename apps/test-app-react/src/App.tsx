import React, { useCallback } from "react";
import { type Domains, manifest } from "./manifest";

const Activity: React.FC<{
  activity: Domains["DestinyActivityDefinition"];
}> = ({ activity }) => {
  const mode = manifest.useDestinyActivityModeDefinition(
    `${activity.activityTypeHash}`
  );

  return (
    <li
      className="list-none shadow shadow-black rounded flex flex-col"
      key={activity.hash}
    >
      <div className="grid grid-cols-1 grid-rows-1">
        {activity.pgcrImage && (
          <img
            className="row-span-full col-span-full"
            src={`https://www.bungie.net${activity.pgcrImage}`}
          />
        )}
        <h2
          className="font-extrabold text-4xl p-2 row-span-full text-gray-200 shadow col-span-full"
          style={{ textShadow: "2px 2px black" }}
        >
          {activity.displayProperties.name}
        </h2>
      </div>
      <div className="p-2">
        {activity.displayProperties.description}
        {mode.data?.pgcrImage && (
          <h3>Mode: {mode.data.displayProperties.name}</h3>
        )}
        <div className="flex-grow"></div>
        <div className="flex gap-4 self-end items-center justify-self-end mt-2">
          {mode.data?.displayProperties.icon && (
            <img
              className="bg-gray-500 w-12"
              src={`https://bungie.net${mode.data?.displayProperties.icon}`}
            />
          )}
          <h3 className="text-lg font-extrabold">
            {mode.data?.displayProperties.name}
          </h3>
        </div>
      </div>
    </li>
  );
};

const App: React.FC = () => {
  const playlistActivities = manifest.useDestinyActivityDefinitions(
    useCallback((a) => a.isPlaylist, [])
  );
  return (
    <div className="max-w-4xl m-auto">
      <h1 className="font-extrabold text-8xl ">Activities</h1>
      <li className="grid grid-cols-2 gap-4">
        {playlistActivities.data?.map((a) => (
          <Activity key={a.hash} activity={a} />
        ))}
      </li>
    </div>
  );
};

export default App;
