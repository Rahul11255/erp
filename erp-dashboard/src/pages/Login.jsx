import { useEffect, useState } from "react";
import { Select } from "antd";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Login() {

  const [selectedRole, setSelectedRole] = useState("EMPLOYEE");
  
 useEffect(() => {
  const initializeGoogle = () => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialLogin,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
      }
    );
  };

  // wait until script is loaded
  if (window.google) {
    initializeGoogle();
  } else {
    const interval = setInterval(() => {
      if (window.google) {
        clearInterval(interval);
        initializeGoogle();
      }
    }, 100);

    return () => clearInterval(interval);
  }
}, [selectedRole]);

  const handleCredentialLogin = async (response) => {
    if (!response?.credential) return;
    try {
      const res = await axiosInstance.post(
        "/users/google-login",
        {
          token: response.credential,
          role: selectedRole,
        }
      );
      if (res.status) {
        localStorage.setItem(
          "token",
          res.data.accessToken
        );
        localStorage.setItem(
          "userInfo",
          JSON.stringify(res.data.userInfo)
        );
        window.location.href = "/";
      }
    } catch (err) {
      toast.error(err.message)
      console.error("Login error:", err);
    }
  };

  return (

    <div className="min-h-screen flex bg-[#f4f7f4]">

      <div className="hidden lg:flex w-[42%] bg-[#0E3B2E] text-white p-12 flex-col justify-between">

        <div>

          <div className="flex items-center gap-3 mb-14">

            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-lg font-bold">
              K95
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                K95 Foods
              </h1>

              <p className="text-sm text-green-100">
                Purchase Management ERP
              </p>
            </div>

          </div>

          <h2 className="text-4xl leading-tight font-semibold mb-10">
            Smart Purchase
            <br />
            Request Workflow
          </h2>

          <div className="space-y-5">

            {[
              "Create & manage purchase requests",
              "Approval flow for managers",
              "Track request status in real-time",
              "Generate reports instantly",
            ].map((item, index) => (

              <div
                key={index}
                className="flex items-center gap-3"
              >

                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  ✓
                </div>

                <p className="text-green-50 text-sm">
                  {item}
                </p>

              </div>

            ))}

          </div>

        </div>

        <p className="text-xs text-green-200">
          © 2026 K95 Foods Pvt. Ltd.
        </p>

      </div>

      <div className="flex-1 flex items-center justify-center p-6">

        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100">

          <div className="mb-8">

            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h2>

            <p className="text-sm text-gray-400">
              Sign in to continue
            </p>

          </div>

          <div className="mb-5">

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login As
            </label>

            <Select
              size="large"
              value={selectedRole}
              onChange={(value) => setSelectedRole(value)}
              className="w-full"
              options={[
                {
                  label: "Employee",
                  value: "EMPLOYEE",
                },
                {
                  label: "Manager",
                  value: "MANAGER",
                },
              ]}
            />

          </div>

          <div
            id="googleSignInDiv"
            className="flex justify-center mb-5 w-full"
          />

          <div className="flex justify-center mb-7">

            <span className="px-4 py-2 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              Only @k95foods.com accounts allowed
            </span>

          </div>

          <div className="space-y-4">

            {[
              "Choose your role",
              "Login with company Google account",
              "Access your ERP dashboard instantly",
            ].map((item, index) => (

              <div
                key={index}
                className="flex items-start gap-3"
              >

                <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center justify-center mt-0.5">
                  {index + 1}
                </div>

                <p className="text-sm text-gray-500">
                  {item}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}