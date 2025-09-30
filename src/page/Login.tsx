import { Link } from "react-router-dom";
import { useState } from "react";
import bgImg from "../assets/backgorundImg.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Here you would add your login logic (e.g., send data to the server)
    console.log("Login attempt with:", { email, password, rememberMe });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:block w-1/2 bg-blue-600 p-8">
          <img src={bgImg} alt="image" className="w-full h-full bg-cover" />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-bold text-blue-600">THE APP</h1>
          <p className="text-gray-500 mb-4">Start your journey</p>
          <h2 className="text-xl font-semibold mb-6">Sign In to The App</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  className="mr-2 leading-tight"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm cursor-pointer">Remember me</span>
              </label>
              <a
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="#"
              >
                Forgot Password?
              </a>
            </div>

            <div className="mb-6">
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
                type="submit"
              >
                Sign In
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm">
              Don't have an account?{" "}
              {/* Use the Link component for internal navigation */}
              <Link
                to="/register"
                className="font-bold text-blue-500 hover:text-blue-800"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
