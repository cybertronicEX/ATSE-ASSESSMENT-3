import {
  getAuth,
  signInWithCustomToken
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import FullScreenLoader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import "../firebase";
import { useTheme } from "../hooks/useTheme";
import axios from "../utils/axiosInstance";

function Login() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isSignUp, setIsSignUp] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ONLY updated color styles
  const containerClass =
    theme === "dark"
      ? "hero bg-gray-900 min-h-screen flex items-center justify-center"
      : "hero bg-gray-100 min-h-screen flex items-center justify-center";

  const textClass = theme === "dark" ? "text-yellow-600" : "text-yellow-500";
  const headingClass = theme === "dark" ? "text-gray-100" : "text-gray-800";

  const cardContainerClass =
    theme === "dark"
      ? "card w-full max-w-sm mx-auto lg:mx-0 mb-10 lg:mb-0 overflow-hidden bg-gray-800 border border-yellow-700 shadow-lg"
      : "card w-full max-w-sm mx-auto lg:mx-0 mb-10 lg:mb-0 overflow-hidden bg-white border border-yellow-400 shadow-lg";

  const cardHeadingClass = theme === "dark" ? "text-yellow-600" : "text-yellow-500";
  const cardParagraphClass = theme === "dark" ? "text-gray-300" : "text-gray-600";

  const buttonClass =
    theme === "dark"
      ? "btn w-full bg-yellow-700 hover:bg-yellow-600 text-white border-none shadow-none"
      : "btn w-full bg-yellow-500 hover:bg-yellow-400 text-white border-none shadow-none";

  const inputEnabledClass =
    theme === "dark"
      ? "input w-full border-2 border-yellow-700 text-yellow-200 bg-gray-700 focus:ring-yellow-400"
      : "input w-full border-2 border-yellow-400 text-yellow-600 bg-gray-100 focus:ring-yellow-400";

  const linkClass =
    theme === "dark"
      ? "link link-hover text-sm sm:text-base text-yellow-600"
      : "link link-hover text-sm sm:text-base text-yellow-500";

  const policyTextClass =
    theme === "dark"
      ? "text-center text-xs sm:text-sm text-yellow-600"
      : "text-center text-xs sm:text-sm text-yellow-500";

  const dividerClass =
    theme === "dark"
      ? "before:bg-yellow-700 after:bg-yellow-700"
      : "before:bg-yellow-400 after:bg-yellow-400";

  const googleTextClass =
    theme === "dark"
      ? "text-sm sm:text-base text-black hover:underline"
      : "text-sm sm:text-base text-black hover:underline";
  // Handlers for input changes
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Trigger submit on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const endpoint = isSignUp ? "/auth/signup" : "/auth/login";
      const payload = isSignUp ? { username, email, password, role: 'user' } : { email, password };

      const res = await axios.post(endpoint, payload);
      const auth = getAuth();

      // Use the custom token returned by the backend to sign in
      await signInWithCustomToken(auth, res.data.token);
      const idToken = await auth.currentUser.getIdToken(true);

      // Store the token in your context/localStorage
      login(idToken);

      toast.success(`${isSignUp ? "Sign up" : "Login"} successful!`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        toast.error("Invalid Credentials");
      } else {
        toast.error("Error: " + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FullScreenLoader />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="hero-content flex-col lg:flex-row-reverse px-4 sm:px-8 md:px-16 w-full max-w-5xl">
        {/* Text Section */}
        <div className={`text-center lg:text-left max-w-lg mx-auto lg:mx-0 ${textClass}`}>

          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${headingClass}`}>
            {isSignUp ? "Sign Up now!" : "Welcome Back!"}
          </h1>
          <p className="py-4 sm:py-6 text-base sm:text-lg">
            {isSignUp
              ? "Manage your projects with AI-powered tools. Sign up to create project charters, collaborate with your team, and track progress efficiently."
              : "Log in to access your personalized dashboard, manage projects, and collaborate seamlessly with your team."}
          </p>
        </div>

        {/* Card Section */}
        <div className={cardContainerClass}>
          <div
            className="card-inner"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
              transition: "transform 0.6s",
              transform: isSignUp ? "rotateY(0deg)" : "rotateY(180deg)",
            }}
          >
            {/* Sign Up */}
            <div
              className={`card-front ${isSignUp ? "block" : "hidden"} transition-all duration-500`}
              style={{ backfaceVisibility: "hidden" }}
            >
              <h1 className={`text-2xl sm:text-3xl font-bold mt-3 text-center ${cardHeadingClass}`}>
                Welcome
              </h1>
              <p className={`text-center p-5 text-sm sm:text-base ${cardParagraphClass}`}>
                This is an all-in-one doc that brings words, data, and teams together. Sign up for free.
              </p>

              <div className="card-body">
                <fieldset className="fieldset">
                  <label className={`fieldset-label ${theme === "dark" ? "" : "text-gray-500"}`}>
                    Username
                  </label>
                  <input
                    type="text"
                    className={inputEnabledClass}
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    onKeyDown={handleKeyPress}
                  />
                  <label className={`fieldset-label ${theme === "dark" ? "" : "text-gray-500"}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    className={inputEnabledClass}
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyDown={handleKeyPress}
                  />
                  <label className={`fieldset-label ${theme === "dark" ? "" : "text-gray-500"}`}>
                    Password
                  </label>
                  <input
                    type="password"
                    className={inputEnabledClass}
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyPress}
                  />
                  <div className="text-center mt-3">
                    <a className={linkClass} onClick={() => setIsSignUp(false)}>
                      Already have an account? Sign In
                    </a>
                  </div>
                  <button
                    className={`${buttonClass} w-full sm:w-auto mt-5`}
                    onClick={handleSubmit}
                  >
                    Sign Up
                  </button>
                  <div className={`divider ${dividerClass}`}></div>
                  <p className={policyTextClass}>
                    By signing up, you agree to our Terms of Service & Privacy policy
                  </p>
                </fieldset>
              </div>
            </div>

            {/* Log In */}
            <div
              className={`card-back ${!isSignUp ? "block" : "hidden"} transition-all duration-500`}
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <h1 className={`text-2xl sm:text-3xl font-bold mt-3 text-center ${cardHeadingClass}`}>
                Welcome Back
              </h1>
              <p className={`text-center p-5 text-sm sm:text-base ${cardParagraphClass}`}>
                Enter your credentials to continue managing your projects effortlessly.
              </p>

              <div className="card-body">
                <fieldset className="fieldset">
                  <label className={`fieldset-label ${theme === "dark" ? "" : "text-orange-500"}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    className={inputEnabledClass}
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyDown={handleKeyPress}
                  />
                  <label className={`fieldset-label ${theme === "dark" ? "" : "text-orange-500"}`}>
                    Password
                  </label>
                  <input
                    type="password"
                    className={inputEnabledClass}
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyPress}
                  />
                  <div className="text-center mt-3">
                    <a className={linkClass} onClick={() => setIsSignUp(true)}>
                      Don't have an account? Sign Up
                    </a>
                  </div>
                  <button
                    className={`${buttonClass} w-full sm:w-auto mt-5`}
                    onClick={handleSubmit}
                  >
                    Log In
                  </button>
                  <div className={`divider ${dividerClass}`}></div>
                  <p className={policyTextClass}>
                    By logging in, you agree to our Terms of Service & Privacy policy
                  </p>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
