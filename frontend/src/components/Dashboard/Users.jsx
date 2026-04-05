import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { capitalize } from "../../utils/constants";
import Card from "../Card";

const Users = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("all");
  const [hasMore, setHasMore] = useState(true);

  const getUsers = async (pageNumber, currentStatus) => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/moderator/viewUsers/${currentStatus}?page=${pageNumber}&limit=9`,
        { withCredentials: true },
      );
      setUsers((prevUsers) => [...prevUsers, ...res.data.users]);
      setHasMore(res.data.users.length > 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setHasMore(true)
    setUsers([]);
    setPage(1);
    getUsers(1, status); 
  }, [status]);

  useEffect(() => {
    getUsers(page, status); 
  }, [page]);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;

    const scrollPosition =
      window.innerHeight + document.documentElement.scrollTop;
    const threshold = document.documentElement.offsetHeight - 100;

    if (scrollPosition >= threshold) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

 return (
  <div className="px-4 py-6">
    
    <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
      Users
    </h2>

    {/* Filters */}
    <div className="flex justify-center gap-2 flex-wrap">
      {["all", "active", "deactivated", "banned"].map((currentStatus) => (
        <button
          key={currentStatus}
          className={`rounded-md px-3 py-1 text-sm font-medium transition ${
            status === currentStatus
              ? "bg-blue-500 text-white"
              : "bg-bgSecondary text-textMuted hover:bg-cardBg"
          }`}
          onClick={() => setStatus(currentStatus)}
        >
          {capitalize(currentStatus)}
        </button>
      ))}
    </div>

    {/* Users */}
    <div className="mt-10 flex flex-wrap justify-center gap-4">
      {users.map((user) => (
        <div key={user._id}>
          <Card user={user} />
        </div>
      ))}
    </div>

    {/* Loading */}
    {isLoading && (
      <p className="mt-6 text-center text-sm text-gray-500 animate-pulse">
        Loading...
      </p>
    )}

  </div>
);
};

export default Users;