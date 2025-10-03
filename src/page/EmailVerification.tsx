import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function EmailVerification() {
  const [message, setMessage] = useState(
    "Verifying your email, please wait..."
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setMessage("Verification token is missing.");
        setIsSuccess(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/verify-email/${token}`);
        const data = await response.json(); 

        if (!response.ok) {
          throw new Error(data.message || "Verification failed.");
        }

        setMessage(data.message + " You will be redirected shortly.");
        setIsSuccess(true);

        setTimeout(() => {
          navigate("/", {
            state: { message: "Your email has been verified! Please log in." },
          });
        }, 4000);
      } catch (err) {
        if (err instanceof Error) {
          setMessage(err.message);
        } else {
          setMessage("An unknown error occurred during verification.");
        }
        setIsSuccess(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 text-center space-y-6 bg-white rounded-xl shadow-lg">
        <h1
          className={`text-3xl font-bold ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {isSuccess ? "Success!" : "Verification Failed"}
        </h1>
        <p className="text-slate-600">{message}</p>
        {isSuccess && (
          <div className="flex justify-center pt-4">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
