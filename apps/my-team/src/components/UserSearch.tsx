import { useDebounce } from "../hooks/general";
import { useEffect, useState } from "react";
import { useSearchProfile } from "../hooks/bungie";
import Spinner from "./Spinner";
import { DestinyMembership } from "../types/bungie";

import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const UserSearchData: React.FC<{
  data: ReturnType<typeof useSearchProfile>["data"];
  onSelect: (selected: DestinyMembership) => void;
}> = ({ data, onSelect }) => {
  return (
    <ul className="divide-y divide-dashed divide-gray-400">
      {data?.results.map((user) => (
        <li
          key={`${user.bungieNetMembershipId}|${user.bungieGlobalDisplayNameCode}`}
          className="p-4  flex items-center"
        >
          <div className="flex gap-4 items-center">
            {user.bungieGlobalDisplayName}#{user.bungieGlobalDisplayNameCode}
            <ul className="flex gap-2 flex-wrap pr-2">
              {user.destinyMemberships.map((destinyMembership) => (
                <li
                  key={destinyMembership.membershipType}
                  className="flex inline-flex whitespace-nowrap items-center gap-2 bg-gray-300 rounded p-1 px-2 cursor-pointer"
                  onClick={() => {
                    onSelect(destinyMembership);
                  }}
                >
                  <img
                    className="w-4 h-4"
                    src={`https://www.bungie.net${destinyMembership.iconPath}`}
                    aria-hidden
                    alt="membership-icon"
                  />
                  {destinyMembership.displayName}
                  <ChevronDoubleRightIcon className="w-4 h-4" />
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
};

const UserSearch: React.FC = () => {
  const [namePrefix, setNamePrefix] = useState("");
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const debouncedNamePrefix = useDebounce(namePrefix, 500);

  useEffect(() => {
    console.log("useEffect 4");
    setPage(0);
  }, [debouncedNamePrefix]);

  const { data, isLoading } = useSearchProfile(debouncedNamePrefix, page);

  return (
    < >
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search for a guardian"
          className="p-2 text-lg rounded w-full my-2 shadow"
          value={namePrefix}
          onChange={(e) => setNamePrefix(e.target.value)}
        />
        {isLoading && <Spinner className="w-8 h-8 text-gray-900" />}
      </div>

      {data?.results?.length ? (
        <div className="bg-gray-200 border border-gray-300 shadow rounded mt-4">
          <UserSearchData
            data={data}
            onSelect={(user) => {
              navigate(`/member/${user.membershipType}/${user.membershipId}`);
            }}
          />
        </div>
      ) : null}
    </>
  );
};

export default UserSearch;
