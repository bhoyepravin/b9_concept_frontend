import React, { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { Button } from "../componants/ui/button";
import { Input } from "../componants/ui/input";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Shield, Sparkles } from "lucide-react";

// Cookie check utility
const checkCookies = () => {
  const cookies = document.cookie.split(";");
  const authCookies = cookies.filter(
    (cookie) =>
      cookie.includes("auth_token") ||
      cookie.includes("refresh_token") ||
      cookie.includes("user_data")
  );
  return authCookies;
};

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cookieInfo, setCookieInfo] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const { login, user, loading: authLoading, clearAuthData } = useAuth();

  useEffect(() => {
    console.log("Login form - Current auth state:", { user, authLoading });
    setCookieInfo(checkCookies());
  }, [user, authLoading]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Login form submitted:", formData);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    console.log("Login result:", result);

    if (result.success) {
      console.log("Login successful, redirecting to:", result.redirectTo);
      setCookieInfo(checkCookies());
      window.location.href = result.redirectTo;
    } else {
      setError(result.error || "Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleClearStorage = () => {
    clearAuthData();
    setCookieInfo(checkCookies());
  };

  // Demo credentials for testing
  const fillDemoCredentials = (type) => {
    if (type === "user") {
      setFormData({
        email: "akshay123@gmail.com",
        password: "akshay@123",
      });
    } else if (type === "admin") {
      setFormData({
        email: "admin@therapy.com",
        password: "admin@123",
      });
    }
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Main Card Container */}
      <div className="w-full max-w-md">
        {/* Animated Card */}
        <div
          className={`
            bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 
            transition-all duration-500 transform
            ${isHovered ? "-translate-y-2 shadow-3xl" : ""}
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header Section */}
          <div className="relative p-8 text-center border-b border-gray-100/50">
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
              }}
            >
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-3xl font-bold mt-8 bg-clip-text text-transparent"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
              }}
            >
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: "#8B5CF6" }} />
              Sign in to continue your journey
              <Sparkles className="w-4 h-4" style={{ color: "#EC4899" }} />
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                  style={{
                    animation: "shake 0.5s ease-in-out",
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-white text-xs"
                      style={{ backgroundColor: "#EF4444" }}
                    >
                      !
                    </div>
                    <strong>Authentication Error:</strong>
                  </div>
                  <p className="mt-1 ml-7">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" style={{ color: "#8B5CF6" }} />
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/50"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Password Field with Show/Hide */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" style={{ color: "#8B5CF6" }} />
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/50"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-200 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded focus:ring-purple-500 border-gray-300 text-purple-600"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: "#8B5CF6" }}
                  onMouseEnter={(e) => (e.target.style.color = "#7C3AED")}
                  onMouseLeave={(e) => (e.target.style.color = "#8B5CF6")}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
                disabled={loading}
                style={{
                  background:
                    "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
                }}
              >
                <div
                  className="absolute inset-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                ></div>
                {loading ? (
                  <div className="flex items-center justify-center relative z-10">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <User className="w-5 h-5" />
                    Sign In to Your Account
                  </span>
                )}
              </Button>

              {/* Demo Credentials */}
              <div className="space-y-3">
                <div className="text-center text-sm text-gray-600">
                  <p className="mb-3">Quick test with demo accounts:</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials("user")}
                      className="flex-1 text-white py-2 px-4 rounded-lg text-xs font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      style={{
                        background:
                          "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
                      }}
                    >
                      👤 User Account
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials("admin")}
                      className="flex-1 text-white py-2 px-4 rounded-lg text-xs font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      style={{
                        background:
                          "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                      }}
                    >
                      ⚙️ Admin Account
                    </button>
                  </div>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold transition-colors duration-200 inline-flex items-center gap-1"
                    style={{ color: "#8B5CF6" }}
                    onMouseEnter={(e) => (e.target.style.color = "#7C3AED")}
                    onMouseLeave={(e) => (e.target.style.color = "#8B5CF6")}
                  >
                    Create one now
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </p>
              </div>
            </form>

            {/* Storage Information - Collapsible */}
            <div className="mt-8 pt-6 border-t border-gray-100/50">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 list-none">
                  <span className="font-medium">Storage Information</span>
                  <svg
                    className="w-4 h-4 transform group-open:rotate-180 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div
                  className="mt-3 p-4 bg-gray-50/50 rounded-xl text-xs text-gray-600 space-y-2"
                  style={{
                    animation: "fadeIn 0.3s ease-out",
                  }}
                >
                  <div>
                    <strong>Backend URL:</strong> http://localhost:9091/api/v1
                  </div>
                  <div>
                    <strong>Auth Status:</strong>{" "}
                    {authLoading
                      ? "Checking..."
                      : user
                      ? "Authenticated"
                      : "Not Authenticated"}
                  </div>
                  <div>
                    <strong>Cookies Found:</strong> {cookieInfo.length}
                  </div>
                  {cookieInfo.length > 0 && (
                    <div className="bg-white/50 p-2 rounded-lg">
                      <strong>Active Cookies:</strong>
                      <ul className="mt-1 space-y-1">
                        {cookieInfo.map((cookie, index) => (
                          <li
                            key={index}
                            className="truncate font-mono text-xs"
                          >
                            {cookie.trim().split("=")[0]}...
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleClearStorage}
                    className="w-full mt-2 px-3 py-2 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                  >
                    🗑️ Clear All Storage & Reload
                  </button>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Secure authentication powered by{" "}
            <span
              className="font-semibold bg-clip-text text-transparent"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
              }}
            >
              TherapyManager Pro
            </span>
          </p>
        </div>
      </div>

      {/* Inline Styles for Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../Contexts/AuthContext";
// import { Button } from "../componants/ui/button";
// import { Input } from "../componants/ui/input";
// import { Link } from "react-router-dom";
// import { Eye, EyeOff, Mail, Lock, User, Shield, Sparkles } from "lucide-react";

// // Cookie check utility
// const checkCookies = () => {
//   const cookies = document.cookie.split(";");
//   const authCookies = cookies.filter(
//     (cookie) =>
//       cookie.includes("auth_token") ||
//       cookie.includes("refresh_token") ||
//       cookie.includes("user_data")
//   );
//   return authCookies;
// };

// const LoginForm = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [cookieInfo, setCookieInfo] = useState([]);
//   const [isHovered, setIsHovered] = useState(false);

//   const { login, user, loading: authLoading, clearAuthData } = useAuth();

//   useEffect(() => {
//     console.log("Login form - Current auth state:", { user, authLoading });
//     setCookieInfo(checkCookies());
//   }, [user, authLoading]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     setError("");
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     console.log("Login form submitted:", formData);

//     // Basic validation
//     if (!formData.email || !formData.password) {
//       setError("Please fill in all fields");
//       setLoading(false);
//       return;
//     }

//     try {
//       const result = await login(formData.email, formData.password);

//       console.log("Login result:", result);
//       console.log("Current user after login:", user);
//       console.log("Auth loading state:", authLoading);

//       if (result.success) {
//         console.log("Login successful, redirecting to:", result.redirectTo);
//         setCookieInfo(checkCookies());

//         // Add a small delay to ensure state updates and storage is set
//         setTimeout(() => {
//           console.log("🔄 Executing redirect to:", result.redirectTo);
//           window.location.href = result.redirectTo;
//         }, 500);
//       } else {
//         setError(
//           result.error || "Login failed. Please check your credentials."
//         );
//         setLoading(false);
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("An unexpected error occurred");
//       setLoading(false);
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setError("");

//   //   if (!formData.email || !formData.password) {
//   //     setError("Please fill in all fields");
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   try {
//   //     const result = await login(formData.email, formData.password);
//   //     console.log("Login result:", result);

//   //     if (result.success) {
//   //       console.log("Login successful, checking user state...");

//   //       // Wait a bit for state to update, then check if we should redirect
//   //       setTimeout(() => {
//   //         if (user) {
//   //           console.log(
//   //             "User is authenticated, redirecting to:",
//   //             result.redirectTo
//   //           );
//   //           window.location.href = result.redirectTo;
//   //         } else {
//   //           console.log("User state not updated, forcing redirect");
//   //           window.location.href = result.redirectTo || "/dashboard";
//   //         }
//   //       }, 500);
//   //     } else {
//   //       setError(
//   //         result.error || "Login failed. Please check your credentials."
//   //       );
//   //       setLoading(false);
//   //     }
//   //   } catch (err) {
//   //     console.error("Login error:", err);
//   //     setError("An unexpected error occurred");
//   //     setLoading(false);
//   //   }
//   // };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setError("");

//   //   console.log("Login form submitted:", formData);

//   //   // Basic validation
//   //   if (!formData.email || !formData.password) {
//   //     setError("Please fill in all fields");
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   const result = await login(formData.email, formData.password);

//   //   console.log("Login result:", result);

//   //   if (result.success) {
//   //     console.log("Login successful, redirecting to:", result.redirectTo);
//   //     setCookieInfo(checkCookies());
//   //     window.location.href = result.redirectTo;
//   //   } else {
//   //     setError(result.error || "Login failed. Please check your credentials.");
//   //     setLoading(false);
//   //   }
//   // };

//   const handleClearStorage = () => {
//     clearAuthData();
//     setCookieInfo(checkCookies());
//   };

//   // Demo credentials for testing
//   const fillDemoCredentials = (type) => {
//     if (type === "user") {
//       setFormData({
//         email: "akshay123@gmail.com",
//         password: "akshay@123",
//       });
//     } else if (type === "admin") {
//       setFormData({
//         email: "admin@therapy.com",
//         password: "admin@123",
//       });
//     }
//     setError("");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
//       {/* Main Card Container */}
//       <div className="w-full max-w-md">
//         {/* Animated Card */}
//         <div
//           className={`
//             bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20
//             transition-all duration-500 transform
//             ${isHovered ? "-translate-y-2 shadow-3xl" : ""}
//           `}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           style={{
//             background:
//               "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)",
//             backdropFilter: "blur(20px)",
//           }}
//         >
//           {/* Header Section */}
//           <div className="relative p-8 text-center border-b border-gray-100/50">
//             <div
//               className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
//               style={{
//                 background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
//               }}
//             >
//               <Shield className="w-8 h-8 text-white" />
//             </div>
//             <h1
//               className="text-3xl font-bold mt-8 bg-clip-text text-transparent"
//               style={{
//                 background: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
//               }}
//             >
//               Welcome Back
//             </h1>
//             <p className="text-gray-600 mt-2 flex items-center justify-center gap-2">
//               <Sparkles className="w-4 h-4" style={{ color: "#8B5CF6" }} />
//               Sign in to continue your journey
//               <Sparkles className="w-4 h-4" style={{ color: "#EC4899" }} />
//             </p>
//           </div>

//           {/* Form Section */}
//           <div className="p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Error Message */}
//               {error && (
//                 <div
//                   className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
//                   style={{
//                     animation: "shake 0.5s ease-in-out",
//                   }}
//                 >
//                   <div className="flex items-center">
//                     <div
//                       className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-white text-xs"
//                       style={{ backgroundColor: "#EF4444" }}
//                     >
//                       !
//                     </div>
//                     <strong>Authentication Error:</strong>
//                   </div>
//                   <p className="mt-1 ml-7">{error}</p>
//                 </div>
//               )}

//               {/* Email Field */}
//               <div className="space-y-2">
//                 <label
//                   htmlFor="email"
//                   className="text-sm font-semibold text-gray-700 flex items-center gap-2"
//                 >
//                   <Mail className="w-4 h-4" style={{ color: "#8B5CF6" }} />
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="Enter your email address"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/50"
//                   />
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 </div>
//               </div>

//               {/* Password Field with Show/Hide */}
//               <div className="space-y-2">
//                 <label
//                   htmlFor="password"
//                   className="text-sm font-semibold text-gray-700 flex items-center gap-2"
//                 >
//                   <Lock className="w-4 h-4" style={{ color: "#8B5CF6" }} />
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/50"
//                   />
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <button
//                     type="button"
//                     onClick={togglePasswordVisibility}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-200 p-1"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className="flex items-center justify-between">
//                 <label className="flex items-center space-x-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="w-4 h-4 rounded focus:ring-purple-500 border-gray-300 text-purple-600"
//                   />
//                   <span className="text-sm text-gray-600">Remember me</span>
//                 </label>
//                 <Link
//                   to="/forgot-password"
//                   className="text-sm font-medium transition-colors duration-200"
//                   style={{ color: "#8B5CF6" }}
//                   onMouseEnter={(e) => (e.target.style.color = "#7C3AED")}
//                   onMouseLeave={(e) => (e.target.style.color = "#8B5CF6")}
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               {/* Login Button */}
//               <Button
//                 type="submit"
//                 className="w-full text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
//                 disabled={loading}
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
//                 }}
//               >
//                 <div
//                   className="absolute inset-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"
//                   style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
//                 ></div>
//                 {loading ? (
//                   <div className="flex items-center justify-center relative z-10">
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                     Signing in...
//                   </div>
//                 ) : (
//                   <span className="relative z-10 flex items-center justify-center gap-2">
//                     <User className="w-5 h-5" />
//                     Sign In to Your Account
//                   </span>
//                 )}
//               </Button>

//               {/* Demo Credentials */}
//               <div className="space-y-3">
//                 <div className="text-center text-sm text-gray-600">
//                   <p className="mb-3">Quick test with demo accounts:</p>
//                   <div className="flex gap-3">
//                     <button
//                       type="button"
//                       onClick={() => fillDemoCredentials("user")}
//                       className="flex-1 text-white py-2 px-4 rounded-lg text-xs font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
//                       style={{
//                         background:
//                           "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
//                       }}
//                     >
//                       👤 User Account
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => fillDemoCredentials("admin")}
//                       className="flex-1 text-white py-2 px-4 rounded-lg text-xs font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
//                       style={{
//                         background:
//                           "linear-gradient(135deg, #10B981 0%, #059669 100%)",
//                       }}
//                     >
//                       ⚙️ Admin Account
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Sign Up Link */}
//               <div className="text-center">
//                 <p className="text-gray-600 text-sm">
//                   Don't have an account?{" "}
//                   <Link
//                     to="/register"
//                     className="font-semibold transition-colors duration-200 inline-flex items-center gap-1"
//                     style={{ color: "#8B5CF6" }}
//                     onMouseEnter={(e) => (e.target.style.color = "#7C3AED")}
//                     onMouseLeave={(e) => (e.target.style.color = "#8B5CF6")}
//                   >
//                     Create one now
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </Link>
//                 </p>
//               </div>
//             </form>

//             {/* Storage Information - Collapsible */}
//             <div className="mt-8 pt-6 border-t border-gray-100/50">
//               <details className="group">
//                 <summary className="flex items-center justify-between cursor-pointer text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 list-none">
//                   <span className="font-medium">Storage Information</span>
//                   <svg
//                     className="w-4 h-4 transform group-open:rotate-180 transition-transform duration-200"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </summary>
//                 <div
//                   className="mt-3 p-4 bg-gray-50/50 rounded-xl text-xs text-gray-600 space-y-2"
//                   style={{
//                     animation: "fadeIn 0.3s ease-out",
//                   }}
//                 >
//                   <div>
//                     <strong>Backend URL:</strong> http://localhost:9091/api/v1
//                   </div>
//                   <div>
//                     <strong>Auth Status:</strong>{" "}
//                     {authLoading
//                       ? "Checking..."
//                       : user
//                       ? "Authenticated"
//                       : "Not Authenticated"}
//                   </div>
//                   <div>
//                     <strong>Cookies Found:</strong> {cookieInfo.length}
//                   </div>
//                   {cookieInfo.length > 0 && (
//                     <div className="bg-white/50 p-2 rounded-lg">
//                       <strong>Active Cookies:</strong>
//                       <ul className="mt-1 space-y-1">
//                         {cookieInfo.map((cookie, index) => (
//                           <li
//                             key={index}
//                             className="truncate font-mono text-xs"
//                           >
//                             {cookie.trim().split("=")[0]}...
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                   <button
//                     type="button"
//                     onClick={handleClearStorage}
//                     className="w-full mt-2 px-3 py-2 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
//                   >
//                     🗑️ Clear All Storage & Reload
//                   </button>
//                 </div>
//               </details>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-6">
//           <p className="text-xs text-gray-500">
//             Secure authentication powered by{" "}
//             <span
//               className="font-semibold bg-clip-text text-transparent"
//               style={{
//                 background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
//               }}
//             >
//               TherapyManager Pro
//             </span>
//           </p>
//         </div>
//       </div>

//       {/* Inline Styles for Animations */}
//       <style>{`
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           25% { transform: translateX(-5px); }
//           75% { transform: translateX(5px); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//         .animate-spin {
//           animation: spin 1s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default LoginForm;
