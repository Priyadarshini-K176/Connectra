// src/components/networks/Recommendations.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import SearchProfileCard from "../SearchProfileCard";

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // Calls your new AI/Fuzzy endpoint!
                const res = await axios.get(
                    import.meta.env.VITE_BackendURL + "/api/recommendations",
                    { withCredentials: true }
                );
                if (res.data.success) {
                    setRecommendations(res.data.result);
                }
            } catch (err) {
                toast.error("Failed to fetch recommendations");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    if (loading) return <div className="flex justify-center p-10"><FaSpinner className="animate-spin text-indigo-500 size-10" /></div>;

    return (
        <div className="flex flex-col gap-4 p-4">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Suggested Connects</h2>
            <p className="text-sm text-gray-500 mb-4">Developers matching your skills</p>

            {recommendations.length === 0 ? (
                <div className="text-center text-gray-500 p-10 bg-gray-50 rounded-2xl">
                    We couldn't find anyone with similar skills yet. Add more tech to your profile!
                </div>
            ) : (
                <div className="space-y-4">
                    {recommendations.map((user) => (
                        <div key={user._id} className="transition-all hover:scale-[1.01]">
                            {/* Re-using your exact Card component! */}
                            <SearchProfileCard user={user} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Recommendations;
