import axios from "axios";
import { useEffect, useState } from "react";
import { FaCrown, FaSpinner, FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addUser, removeUser } from "../utils/userSlice";

const PremiumUserView = () => {
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/profile/view`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(addUser(res.data.user));
      } else {
        dispatch(removeUser(null));
      }
    } catch (err) {
      dispatch(removeUser(null));
    }
  };

  useEffect(() => {
    fetchUser();
  }, [dispatch]);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-white px-4 py-16 text-center">
      <div className="mb-6 rounded-full bg-blue-600 p-6 shadow-lg">
        <FaCrown className="h-12 w-12 text-white" />
      </div>
      <h1 className="mb-4 text-3xl font-bold text-slate-900">
        You are a Premium Member
      </h1>
      <p className="mb-8 max-w-md text-slate-600">
        Thank you for your support. You now have full access to all Connectra features,
        including advanced search and unlimited connection requests.
      </p>
      <div className="flex gap-4">
        <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors">
          Explore Features
        </button>
        <button className="rounded-lg border border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          Billing Settings
        </button>
      </div>
    </div>
  );
};

const PricingCard = ({
  membershipType,
  price,
  features,
  isPopular = false,
  setIsUserPremium,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BackendURL}/payment/verify`,
        { withCredentials: true }
      );
      if (res.data.isPremium === true) {
        setIsUserPremium(true);
        toast.success("Premium activated!");
      }
    } catch (err) {
      toast.error("Verification failed");
    }
  };

  const handlePayment = async (membershipType) => {
    setIsProcessing(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BackendURL}/payment/createOrder`,
        { membershipType },
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Error");
        return;
      }

      const { orderId, amount, currency, notes } = res.data.order;
      const { keyId } = res.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Connectra",
        description: "Premium Membership",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.email,
        },
        theme: { color: "#2563eb" },
        handler: () => verifyPremiumUser(),
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setIsProcessing(false);
      toast.error(err.response?.data?.error || "Payment failed");
    }
  };

  return (
    <div className={`flex flex-col rounded-2xl border p-8 bg-white ${isPopular ? "border-blue-600 ring-1 ring-blue-600 shadow-md scale-105" : "border-slate-200 shadow-sm"}`}>
      {isPopular && (
        <span className="mb-4 inline-block self-start rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 uppercase">
          Best Value
        </span>
      )}
      <h3 className="text-xl font-bold text-slate-900">{membershipType}</h3>
      <div className="my-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-slate-900">₹{price}</span>
        <span className="text-slate-500">/mo</span>
      </div>
      <ul className="my-6 space-y-4">
        {features?.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-sm text-slate-600">
            <FaCheck className="text-blue-600 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={() => handlePayment(membershipType)}
        disabled={isProcessing}
        className={`mt-auto rounded-lg py-3 font-bold transition-all ${isPopular
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-slate-900 text-white hover:bg-slate-800"
          } flex items-center justify-center disabled:opacity-50`}
      >
        {isProcessing ? <FaSpinner className="animate-spin" /> : "Choose Plan"}
      </button>
    </div>
  );
};

const Premium = () => {
  const [plansData, setPlansData] = useState(null);
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getPlansData = async () => {
    setIsLoading(true);
    try {
      const [plansRes, premiumRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BackendURL}/payment/plans`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BackendURL}/payment/verify`, { withCredentials: true }),
      ]);
      setPlansData(plansRes.data.plansData);
      setIsUserPremium(premiumRes.data.isPremium === true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPlansData();
  }, []);

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <FaSpinner className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  if (isUserPremium) return <PremiumUserView />;

  return (
    <div className="bg-white px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Upgrade Your Experience
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Select the plan that works best for your career goals.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plansData?.map((plan, index) => (
            <PricingCard
              key={index}
              membershipType={plan.membershipType}
              price={plan.price}
              features={plan.features}
              isPopular={plan.isPopular || false}
              setIsUserPremium={setIsUserPremium}
            />
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-slate-400">
          Have questions? <a href="/support" className="text-blue-600 hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
}

export default Premium;