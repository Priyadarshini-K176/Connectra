import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CallForActionSection = () => {
  const user = useSelector((store) => store.user);
  return (
  <section className="bg-bg px-6 py-16">
    <div className="mx-auto max-w-5xl text-center">
      
      <h2 className="mb-6 text-3xl font-semibold text-gray-800">
        Ready to Connect with Developers Like You?
      </h2>

      <p className="mb-10 text-lg text-textMuted">
        Join a community of innovators and build together.
      </p>

      <Link to={user ? "/feed" : "/signup"}>
        <button className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-hover">
          {user ? "Explore Developers" : "Sign Up for Free"}
        </button>
      </Link>

    </div>
  </section>
);
};

export default CallForActionSection;