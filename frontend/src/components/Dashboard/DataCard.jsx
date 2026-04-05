import axios from "axios";
import { useEffect, useState } from "react";

const DataCard = ({ heading, type, data }) => {
  const [duration, setDuration] = useState("day");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BackendURL}/${type}/${data}/${duration}`,
          { withCredentials: true },
        );
        setStats(res.data.stats);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [duration, data]);

 return (
  <div className="w-64 rounded-xl bg-cardBg p-6 shadow-md transition duration-300 hover:shadow-lg">
    
    <h3 className="text-lg font-semibold text-textMuted tracking-wide">
      {heading}
    </h3>

    {isLoading ? (
      <div className="mt-4 h-8 w-full animate-pulse rounded-md bg-textMuted/40"></div>
    ) : (
      <div className="mt-4 flex items-end gap-2">
        <p className="text-3xl font-semibold text-text">
          {new Intl.NumberFormat("en-IN", {
            maximumSignificantDigits: 3,
          }).format(stats?.current)}
        </p>

        <p
          className={`text-sm font-medium ${
            stats?.percentageChange === 0
              ? "text-gray-500"
              : stats?.percentageChange > 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {stats?.percentageChange > 0 && "+"}
          {stats?.percentageChange}%
        </p>
      </div>
    )}

    {/* Comparison */}
    <p className="mt-2 text-xs text-textMuted">
      Compared to last {duration}
    </p>

    {/* Duration */}
    <div className="mt-4 flex gap-2">
      {["day", "week", "month", "year"].map((dur) => (
        <button
          key={dur}
          className={`flex-1 rounded-md px-2 py-1 text-xs font-medium transition ${
            duration === dur
              ? "bg-blue-500 text-white"
              : "bg-bgSecondary text-textMuted hover:bg-bg"
          }`}
          onClick={(e) => {
            e.preventDefault();
            setDuration(dur);
          }}
        >
          {dur === "day" && "1D"}
          {dur === "week" && "1W"}
          {dur === "month" && "1M"}
          {dur === "year" && "1Y"}
        </button>
      ))}
    </div>

  </div>
);

};

export default DataCard;