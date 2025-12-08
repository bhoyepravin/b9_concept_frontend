import React, { createContext, useState, useContext, useEffect } from "react";

// API Configuration
const API_CONFIG = {
  BASE_URL: "http://localhost:9091",
  API_VERSION: "/api/v1",

  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      REFRESH_TOKEN: "/auth/refresh",
    },
    USER: {
      PROFILE: "/user/profile",
      UPDATE: "/user/update",
    },
  },

  getFullUrl: (endpoint) => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
  },
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Enhanced Cookie utility functions
const cookieUtils = {
  // Set a cookie with secure options
  setCookie: (name, value, days = 7, secure = false) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    let cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;

    if (secure || process.env.NODE_ENV === "production") {
      cookieString += ";Secure";
    }

    document.cookie = cookieString;
  },

  // Get a cookie
  getCookie: (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Delete a cookie
  deleteCookie: (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  },

  // Set multiple auth cookies
  setAuthCookies: (tokenData, userData = null) => {
    const {
      accessToken,
      refreshToken,
      tokenType = "Bearer",
      expiresIn,
    } = tokenData;

    if (accessToken) {
      cookieUtils.setCookie("access_token", accessToken, 1); // 1 day for access token
    }

    if (refreshToken) {
      cookieUtils.setCookie("refresh_token", refreshToken, 30); // 30 days for refresh token
    }

    if (tokenType) {
      cookieUtils.setCookie("token_type", tokenType, 7);
    }

    if (userData) {
      cookieUtils.setCookie("user_data", JSON.stringify(userData), 7);
    }

    console.log("🔐 Auth cookies set successfully");
  },

  // Clear all auth cookies
  clearAuthCookies: () => {
    cookieUtils.deleteCookie("access_token");
    cookieUtils.deleteCookie("refresh_token");
    cookieUtils.deleteCookie("token_type");
    cookieUtils.deleteCookie("user_data");
    console.log("🔐 Auth cookies cleared");
  },

  // Get all auth data from cookies
  getAuthFromCookies: () => {
    const accessToken = cookieUtils.getCookie("access_token");
    const refreshToken = cookieUtils.getCookie("refresh_token");
    const tokenType = cookieUtils.getCookie("token_type");
    const userData = cookieUtils.getCookie("user_data");

    let parsedUserData = null;
    if (userData) {
      try {
        parsedUserData = JSON.parse(userData);
      } catch (error) {
        console.error("Error parsing user data from cookie:", error);
        cookieUtils.deleteCookie("user_data");
      }
    }

    return {
      accessToken,
      refreshToken,
      tokenType,
      user: parsedUserData,
    };
  },
};

// Enhanced localStorage utility functions
const storageUtils = {
  // Set item in localStorage
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error storing ${key} in localStorage:`, error);
    }
  },

  // Get item from localStorage
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  },

  // Remove item from localStorage
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  // Set auth data in localStorage
  setAuthData: (tokenData, userData = null) => {
    const { accessToken, refreshToken, tokenType = "Bearer" } = tokenData;

    if (accessToken) {
      storageUtils.setItem("access_token", accessToken);
    }

    if (refreshToken) {
      storageUtils.setItem("refresh_token", refreshToken);
    }

    if (tokenType) {
      storageUtils.setItem("token_type", tokenType);
    }

    if (userData) {
      storageUtils.setItem("user_data", JSON.stringify(userData));
    }

    console.log("💾 Auth data stored in localStorage");
  },

  // Get auth data from localStorage
  getAuthFromStorage: () => {
    const accessToken = storageUtils.getItem("access_token");
    const refreshToken = storageUtils.getItem("refresh_token");
    const tokenType = storageUtils.getItem("token_type");
    const userData = storageUtils.getItem("user_data");

    let parsedUserData = null;
    if (userData) {
      try {
        parsedUserData = JSON.parse(userData);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        storageUtils.removeItem("user_data");
      }
    }

    return {
      accessToken,
      refreshToken,
      tokenType,
      user: parsedUserData,
    };
  },

  // Clear all auth data from localStorage
  clearAuthData: () => {
    storageUtils.removeItem("access_token");
    storageUtils.removeItem("refresh_token");
    storageUtils.removeItem("token_type");
    storageUtils.removeItem("user_data");
    console.log("💾 Auth data cleared from localStorage");
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState({
    accessToken: null,
    refreshToken: null,
    tokenType: "Bearer",
  });

  // Use config file for API URLs
  const API_BASE_URL = API_CONFIG.BASE_URL + API_CONFIG.API_VERSION;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Enhanced storage function - stores in both localStorage and cookies
  const setAuthData = (tokenData, userData = null) => {
    const { accessToken, refreshToken, tokenType = "Bearer" } = tokenData;

    console.log("🔄 Storing auth data...", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasUserData: !!userData,
    });

    // Store in localStorage
    storageUtils.setAuthData(
      { accessToken, refreshToken, tokenType },
      userData
    );

    // Store in cookies
    cookieUtils.setAuthCookies(
      { accessToken, refreshToken, tokenType },
      userData
    );

    // Update state
    setTokens({ accessToken, refreshToken, tokenType });
    if (userData) {
      setUser(userData);
    }

    console.log("✅ Auth data stored successfully in both storage systems");
  };

  // Clear all auth data from both storage systems
  const clearAuthData = () => {
    storageUtils.clearAuthData();
    cookieUtils.clearAuthCookies();
    setTokens({ accessToken: null, refreshToken: null, tokenType: "Bearer" });
    setUser(null);
    console.log("✅ All auth data cleared");
  };

  // Enhanced auth status check
  const checkAuthStatus = () => {
    try {
      console.log("🔍 Checking auth status...");

      let accessToken = null;
      let refreshToken = null;
      let userData = null;
      let tokenType = "Bearer";

      // First try to get from localStorage
      const storageAuth = storageUtils.getAuthFromStorage();
      console.log("📦 Storage auth data:", storageAuth);

      // Then try cookies
      const cookieAuth = cookieUtils.getAuthFromCookies();
      console.log("🍪 Cookie auth data:", cookieAuth);

      // Prefer localStorage, fallback to cookies
      if (storageAuth.accessToken && storageAuth.user) {
        accessToken = storageAuth.accessToken;
        refreshToken = storageAuth.refreshToken;
        userData = storageAuth.user;
        tokenType = storageAuth.tokenType || "Bearer";
        console.log("✅ Using auth data from localStorage");
      } else if (cookieAuth.accessToken && cookieAuth.user) {
        accessToken = cookieAuth.accessToken;
        refreshToken = cookieAuth.refreshToken;
        userData = cookieAuth.user;
        tokenType = cookieAuth.tokenType || "Bearer";
        console.log("✅ Using auth data from cookies");

        // Sync back to localStorage
        storageUtils.setAuthData(
          { accessToken, refreshToken, tokenType },
          userData
        );
      }

      console.log("🎯 Final auth check:", {
        accessToken: accessToken ? "***" + accessToken.slice(-10) : "None",
        refreshToken: refreshToken ? "***" + refreshToken.slice(-10) : "None",
        user: userData ? userData.email : "None",
      });

      if (accessToken && userData) {
        console.log("✅ Setting valid user and tokens");
        setTokens({ accessToken, refreshToken, tokenType });
        setUser(userData);
      } else {
        console.log("❌ No valid auth data found");
        setTokens({
          accessToken: null,
          refreshToken: null,
          tokenType: "Bearer",
        });
        setUser(null);
      }
    } catch (error) {
      console.error("💥 Error checking auth status:", error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  // Enhanced token extraction function
  const extractTokensAndUser = (data) => {
    console.log("🔍 Extracting tokens and user data...");

    let accessToken = null;
    let refreshToken = null;
    let userData = null;
    let tokenType = "Bearer";

    // Multiple possible response structures
    if (data.data) {
      // Structure 1: Nested tokens and user
      if (data.data.accessToken) {
        accessToken = data.data.accessToken;
        refreshToken = data.data.refreshToken;
        userData = data.data.user || data.data;
        tokenType = data.data.tokenType || "Bearer";
      }
      // Structure 2: Direct token
      else if (data.data.token) {
        accessToken = data.data.token;
        userData = data.data.user || data.data;
      }
      // Structure 3: User data with embedded token
      else if (data.data.id || data.data.email) {
        userData = data.data;
        accessToken = data.data.accessToken || data.data.token;
        refreshToken = data.data.refreshToken;
      }
    }

    // Check root level
    if (!accessToken && data.accessToken) {
      accessToken = data.accessToken;
      refreshToken = data.refreshToken;
      userData = data.user || data.data;
      tokenType = data.tokenType || "Bearer";
    }

    // Final fallback
    if (!accessToken && data.token) {
      accessToken = data.token;
      userData = data.user || data.data;
    }

    console.log("🎯 Extraction result:", {
      accessToken: accessToken ? "***" + accessToken.slice(-10) : "None",
      refreshToken: refreshToken ? "***" + refreshToken.slice(-10) : "None",
      userData: userData ? "Exists" : "None",
      tokenType,
    });

    return { accessToken, refreshToken, userData, tokenType };
  };

  // Enhanced login function
  const login = async (email, password) => {
    try {
      console.log("🔐 Login attempt started for:", email);

      const loginUrl = API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN);
      console.log("🌐 Login URL:", loginUrl);

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("📨 Login response:", data);

      if (data.success) {
        const { accessToken, refreshToken, userData, tokenType } =
          extractTokensAndUser(data);

        if (!accessToken || !userData) {
          throw new Error("Invalid response: missing token or user data");
        }

        // Store in both storage systems
        setAuthData({ accessToken, refreshToken, tokenType }, userData);

        return {
          success: true,
          user: userData,
          redirectTo: userData.roleId === 1 ? "/admindashboard" : "/dashboard",
        };
      } else {
        return {
          success: false,
          error: data.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("💥 Login error:", error);
      return {
        success: false,
        error: error.message || "Network error. Please check your connection.",
      };
    }
  };

  // Enhanced register function
  const register = async (userData) => {
    try {
      console.log("🚀 Registration attempt started for:", userData.email);

      const registerUrl = API_CONFIG.getFullUrl(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER
      );
      console.log("🌐 Register URL:", registerUrl);

      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("📡 Response status:", response.status);

      const responseText = await response.text();
      console.log("📨 Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Invalid JSON response from server");
      }

      console.log("📊 Parsed response:", data);

      if (data.success) {
        const {
          accessToken,
          refreshToken,
          userData: extractedUserData,
          tokenType,
        } = extractTokensAndUser(data);

        // If we have tokens and user data, store them and auto-login
        if (accessToken && extractedUserData) {
          console.log("✅ Auto-login after registration");
          setAuthData(
            { accessToken, refreshToken, tokenType },
            extractedUserData
          );

          return {
            success: true,
            user: extractedUserData,
            redirectTo:
              extractedUserData.roleId === 1 ? "/admindashboard" : "/dashboard",
          };
        }
        // If no tokens (common for registration), just show success message
        else {
          console.log("✅ Registration successful, redirecting to login");
          return {
            success: true,
            message: data.message || "Registration successful! Please login.",
            redirectTo: "/login",
          };
        }
      } else {
        return {
          success: false,
          error: data.message || "Registration failed",
        };
      }
    } catch (error) {
      console.error("💥 Registration error:", error);
      return {
        success: false,
        error: error.message || "Network error. Please check your connection.",
      };
    }
  };

  const logout = () => {
    console.log("🚪 Logging out...");
    clearAuthData();
    window.location.href = "/login";
  };

  // Get current tokens
  const getTokens = () => {
    return tokens;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(tokens.accessToken && user);
  };

  const value = {
    user,
    tokens,
    login,
    register,
    logout,
    loading,
    clearAuthData,
    getTokens,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// import React, { createContext, useState, useContext, useEffect } from "react";

// // API Configuration
// const API_CONFIG = {
//   BASE_URL: "http://localhost:9091",
//   API_VERSION: "/api/v1",

//   ENDPOINTS: {
//     AUTH: {
//       LOGIN: "/auth/login",
//       REGISTER: "/auth/register",
//       LOGOUT: "/auth/logout",
//       REFRESH_TOKEN: "/auth/refresh",
//     },
//     USER: {
//       PROFILE: "/user/profile",
//       UPDATE: "/user/update",
//     },
//   },

//   getFullUrl: (endpoint) => {
//     return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
//   },
// };

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// // Enhanced Cookie utility functions
// const cookieUtils = {
//   // Set a cookie with secure options
//   setCookie: (name, value, days = 7, secure = false) => {
//     const expires = new Date();
//     expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

//     let cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;

//     if (secure || process.env.NODE_ENV === "production") {
//       cookieString += ";Secure";
//     }

//     document.cookie = cookieString;
//   },

//   // Get a cookie
//   getCookie: (name) => {
//     const nameEQ = name + "=";
//     const ca = document.cookie.split(";");
//     for (let i = 0; i < ca.length; i++) {
//       let c = ca[i];
//       while (c.charAt(0) === " ") c = c.substring(1, c.length);
//       if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
//     }
//     return null;
//   },

//   // Delete a cookie
//   deleteCookie: (name) => {
//     document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
//   },

//   // Set multiple auth cookies
//   setAuthCookies: (tokenData, userData = null) => {
//     const {
//       accessToken,
//       refreshToken,
//       tokenType = "Bearer",
//       expiresIn,
//     } = tokenData;

//     if (accessToken) {
//       cookieUtils.setCookie("access_token", accessToken, 1); // 1 day for access token
//     }

//     if (refreshToken) {
//       cookieUtils.setCookie("refresh_token", refreshToken, 30); // 30 days for refresh token
//     }

//     // if (tokenType) {
//     //   cookieUtils.setCookie("token_type", tokenType, 7);
//     // }

//     // if (userData) {
//     //   cookieUtils.setCookie("user_data", JSON.stringify(userData), 7);
//     // }

//     console.log("🔐 Auth cookies set successfully");
//   },

//   // Clear all auth cookies
//   clearAuthCookies: () => {
//     cookieUtils.deleteCookie("access_token");
//     cookieUtils.deleteCookie("refresh_token");
//     cookieUtils.deleteCookie("token_type");
//     cookieUtils.deleteCookie("user_data");
//     console.log("🔐 Auth cookies cleared");
//   },

//   // Get all auth data from cookies
//   getAuthFromCookies: () => {
//     const accessToken = cookieUtils.getCookie("access_token");
//     const refreshToken = cookieUtils.getCookie("refresh_token");
//     const tokenType = cookieUtils.getCookie("token_type");
//     const userData = cookieUtils.getCookie("user_data");

//     let parsedUserData = null;
//     if (userData) {
//       try {
//         parsedUserData = JSON.parse(userData);
//       } catch (error) {
//         console.error("Error parsing user data from cookie:", error);
//         cookieUtils.deleteCookie("user_data");
//       }
//     }

//     return {
//       accessToken,
//       refreshToken,
//       tokenType,
//       user: parsedUserData,
//     };
//   },
// };

// // Enhanced localStorage utility functions
// const storageUtils = {
//   // Set item in localStorage
//   setItem: (key, value) => {
//     try {
//       localStorage.setItem(key, value);
//     } catch (error) {
//       console.error(`Error storing ${key} in localStorage:`, error);
//     }
//   },

//   // Get item from localStorage
//   getItem: (key) => {
//     try {
//       return localStorage.getItem(key);
//     } catch (error) {
//       console.error(`Error reading ${key} from localStorage:`, error);
//       return null;
//     }
//   },

//   // Remove item from localStorage
//   removeItem: (key) => {
//     try {
//       localStorage.removeItem(key);
//     } catch (error) {
//       console.error(`Error removing ${key} from localStorage:`, error);
//     }
//   },

//   // Set auth data in localStorage
//   setAuthData: (tokenData, userData = null) => {
//     const { accessToken, refreshToken, tokenType = "Bearer" } = tokenData;

//     if (accessToken) {
//       storageUtils.setItem("access_token", accessToken);
//     }

//     if (refreshToken) {
//       storageUtils.setItem("refresh_token", refreshToken);
//     }

//     // if (tokenType) {
//     //   storageUtils.setItem("token_type", tokenType);
//     // }

//     // if (userData) {
//     //   storageUtils.setItem("user_data", JSON.stringify(userData));
//     // }

//     console.log("💾 Auth data stored in localStorage");
//   },

//   // Get auth data from localStorage
//   getAuthFromStorage: () => {
//     const accessToken = storageUtils.getItem("access_token");
//     const refreshToken = storageUtils.getItem("refresh_token");
//     const tokenType = storageUtils.getItem("token_type");
//     const userData = storageUtils.getItem("user_data");

//     let parsedUserData = null;
//     if (userData) {
//       try {
//         parsedUserData = JSON.parse(userData);
//       } catch (error) {
//         console.error("Error parsing user data from localStorage:", error);
//         storageUtils.removeItem("user_data");
//       }
//     }

//     return {
//       accessToken,
//       refreshToken,
//       tokenType,
//       user: parsedUserData,
//     };
//   },

//   // Clear all auth data from localStorage
//   clearAuthData: () => {
//     storageUtils.removeItem("access_token");
//     storageUtils.removeItem("refresh_token");
//     storageUtils.removeItem("token_type");
//     storageUtils.removeItem("user_data");
//     console.log("💾 Auth data cleared from localStorage");
//   },
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [tokens, setTokens] = useState({
//     accessToken: null,
//     refreshToken: null,
//     tokenType: "Bearer",
//   });

//   // Use config file for API URLs
//   const API_BASE_URL = API_CONFIG.BASE_URL + API_CONFIG.API_VERSION;

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   // Enhanced storage function - stores in both localStorage and cookies
//   const setAuthData = (tokenData, userData = null) => {
//     const { accessToken, refreshToken, tokenType = "Bearer" } = tokenData;

//     console.log("🔄 Storing auth data...", {
//       hasAccessToken: !!accessToken,
//       hasRefreshToken: !!refreshToken,
//       hasUserData: !!userData,
//     });

//     // Store in localStorage
//     storageUtils.setAuthData(
//       { accessToken, refreshToken, tokenType },
//       userData
//     );

//     // Store in cookies
//     cookieUtils.setAuthCookies(
//       { accessToken, refreshToken, tokenType },
//       userData
//     );

//     // Update state
//     setTokens({ accessToken, refreshToken, tokenType });
//     if (userData) {
//       setUser(userData);
//     }

//     console.log("✅ Auth data stored successfully in both storage systems");
//   };

//   // Clear all auth data from both storage systems
//   const clearAuthData = () => {
//     storageUtils.clearAuthData();
//     cookieUtils.clearAuthCookies();
//     setTokens({ accessToken: null, refreshToken: null, tokenType: "Bearer" });
//     setUser(null);
//     console.log("✅ All auth data cleared");
//   };

//   // Enhanced auth status check
//   // const checkAuthStatus = () => {
//   //   try {
//   //     console.log("🔍 Checking auth status...");

//   //     let accessToken = null;
//   //     let refreshToken = null;
//   //     let userData = null;
//   //     let tokenType = "Bearer";

//   //     // First try to get from localStorage
//   //     const storageAuth = storageUtils.getAuthFromStorage();
//   //     console.log("📦 Storage auth data:", storageAuth);

//   //     // Then try cookies
//   //     const cookieAuth = cookieUtils.getAuthFromCookies();
//   //     console.log("🍪 Cookie auth data:", cookieAuth);

//   //     // Prefer localStorage, fallback to cookies
//   //     if (storageAuth.accessToken && storageAuth.user) {
//   //       accessToken = storageAuth.accessToken;
//   //       refreshToken = storageAuth.refreshToken;
//   //       userData = storageAuth.user;
//   //       tokenType = storageAuth.tokenType || "Bearer";
//   //       console.log("✅ Using auth data from localStorage");
//   //     } else if (cookieAuth.accessToken && cookieAuth.user) {
//   //       accessToken = cookieAuth.accessToken;
//   //       refreshToken = cookieAuth.refreshToken;
//   //       userData = cookieAuth.user;
//   //       tokenType = cookieAuth.tokenType || "Bearer";
//   //       console.log("✅ Using auth data from cookies");

//   //       // Sync back to localStorage
//   //       storageUtils.setAuthData(
//   //         { accessToken, refreshToken, tokenType },
//   //         userData
//   //       );
//   //     }

//   //     console.log("🎯 Final auth check:", {
//   //       accessToken: accessToken ? "***" + accessToken.slice(-10) : "None",
//   //       refreshToken: refreshToken ? "***" + refreshToken.slice(-10) : "None",
//   //       user: userData ? userData.email : "None",
//   //     });

//   //     if (accessToken && userData) {
//   //       console.log("✅ Setting valid user and tokens");
//   //       setTokens({ accessToken, refreshToken, tokenType });
//   //       setUser(userData);
//   //     } else {
//   //       console.log("❌ No valid auth data found");
//   //       setTokens({
//   //         accessToken: null,
//   //         refreshToken: null,
//   //         tokenType: "Bearer",
//   //       });
//   //       setUser(null);
//   //     }
//   //   } catch (error) {
//   //     console.error("💥 Error checking auth status:", error);
//   //     clearAuthData();
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // Enhanced auth status check with auto-redirect
//   const checkAuthStatus = () => {
//     try {
//       console.log("🔍 Checking auth status...");

//       let accessToken = null;
//       let refreshToken = null;
//       let userData = null;
//       let tokenType = "Bearer";

//       // First try to get from localStorage
//       const storageAuth = storageUtils.getAuthFromStorage();
//       console.log("📦 Storage auth data:", storageAuth);

//       // Then try cookies
//       const cookieAuth = cookieUtils.getAuthFromCookies();
//       console.log("🍪 Cookie auth data:", cookieAuth);

//       // Prefer localStorage, fallback to cookies
//       if (storageAuth.accessToken && storageAuth.user) {
//         accessToken = storageAuth.accessToken;
//         refreshToken = storageAuth.refreshToken;
//         userData = storageAuth.user;
//         tokenType = storageAuth.tokenType || "Bearer";
//         console.log("✅ Using auth data from localStorage");
//       } else if (cookieAuth.accessToken && cookieAuth.user) {
//         accessToken = cookieAuth.accessToken;
//         refreshToken = cookieAuth.refreshToken;
//         userData = cookieAuth.user;
//         tokenType = cookieAuth.tokenType || "Bearer";
//         console.log("✅ Using auth data from cookies");

//         // Sync back to localStorage
//         storageUtils.setAuthData(
//           { accessToken, refreshToken, tokenType },
//           userData
//         );
//       }

//       console.log("🎯 Final auth check:", {
//         accessToken: accessToken ? "***" + accessToken.slice(-10) : "None",
//         refreshToken: refreshToken ? "***" + refreshToken.slice(-10) : "None",
//         user: userData ? userData.email : "None",
//       });

//       if (accessToken && userData) {
//         console.log("✅ Setting valid user and tokens");
//         setTokens({ accessToken, refreshToken, tokenType });
//         setUser(userData);

//         // Auto-redirect if on login page
//         const currentPath = window.location.pathname;
//         if (currentPath === "/login" || currentPath === "/") {
//           const redirectTo =
//             userData.roleId === 1 ? "/admindashboard" : "/dashboard";
//           console.log("🔄 Auto-redirecting to:", redirectTo);
//           setTimeout(() => {
//             window.location.href = redirectTo;
//           }, 100);
//         }
//       } else {
//         console.log("❌ No valid auth data found");
//         setTokens({
//           accessToken: null,
//           refreshToken: null,
//           tokenType: "Bearer",
//         });
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("💥 Error checking auth status:", error);
//       clearAuthData();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Enhanced token extraction function with detailed debugging
//   const extractTokensAndUser = (data) => {
//     console.log(
//       "🔍 FULL DATA FOR TOKEN EXTRACTION:",
//       JSON.stringify(data, null, 2)
//     );

//     let accessToken = null;
//     let refreshToken = null;
//     let userData = null;
//     let tokenType = "Bearer";

//     // Log all possible token locations
//     console.log("🔎 Checking for tokens in response...");

//     // Check data.data structure
//     if (data.data) {
//       console.log("📦 data.data exists:", data.data);
//       console.log("data.data.accessToken:", data.data.accessToken);
//       console.log("data.data.refreshToken:", data.data.refreshToken);
//       console.log("data.data.token:", data.data.token);
//       console.log("data.data.refresh_token:", data.data.refresh_token);
//     }

//     // Check root level
//     console.log("📦 Root level tokens:");
//     console.log("data.accessToken:", data.accessToken);
//     console.log("data.refreshToken:", data.refreshToken);
//     console.log("data.token:", data.token);
//     console.log("data.refresh_token:", data.refresh_token);

//     // Multiple possible response structures
//     if (data.data) {
//       // Structure 1: Nested tokens and user (NEW - with refreshToken)
//       if (data.data.accessToken && data.data.refreshToken) {
//         accessToken = data.data.accessToken;
//         refreshToken = data.data.refreshToken;
//         userData = data.data.user || data.data;
//         tokenType = data.data.tokenType || "Bearer";
//         console.log("✅ Using Structure 1 (nested tokens with refreshToken)");
//       }
//       // Structure 2: Only access token (fallback)
//       else if (data.data.accessToken) {
//         accessToken = data.data.accessToken;
//         refreshToken = data.data.refreshToken || null; // Might be null
//         userData = data.data.user || data.data;
//         tokenType = data.data.tokenType || "Bearer";
//         console.log("✅ Using Structure 2 (only accessToken)");
//       }
//       // Structure 3: Direct token
//       else if (data.data.token) {
//         accessToken = data.data.token;
//         userData = data.data.user || data.data;
//         console.log("✅ Using Structure 3 (direct token)");
//       }
//       // Structure 4: User data with embedded token
//       else if (data.data.id || data.data.email) {
//         userData = data.data;
//         accessToken = data.data.accessToken || data.data.token;
//         refreshToken = data.data.refreshToken;
//         console.log("✅ Using Structure 4 (embedded tokens)");
//       }
//     }

//     // Check root level
//     if (!accessToken && data.accessToken) {
//       accessToken = data.accessToken;
//       refreshToken = data.refreshToken;
//       userData = data.user || data.data;
//       tokenType = data.tokenType || "Bearer";
//       console.log("✅ Using root level tokens");
//     }

//     // Final fallback
//     if (!accessToken && data.token) {
//       accessToken = data.token;
//       userData = data.user || data.data;
//       console.log("✅ Using final fallback");
//     }

//     console.log("🎯 FINAL EXTRACTION RESULT:", {
//       accessToken: accessToken ? "***" + accessToken.slice(-10) : "None",
//       refreshToken: refreshToken ? "***" + refreshToken.slice(-10) : "None",
//       userData: userData ? "Exists" : "None",
//       tokenType,
//     });

//     return { accessToken, refreshToken, userData, tokenType };
//   };

//   // Enhanced login function with maximum debugging
//   // const login = async (email, password) => {
//   //   try {
//   //     console.log("🔐 Login attempt started for:", email);

//   //     const loginUrl = API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN);
//   //     console.log("🌐 Login URL:", loginUrl);

//   //     const response = await fetch(loginUrl, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({ email, password }),
//   //     });

//   //     console.log("📡 Response status:", response.status);
//   //     console.log(
//   //       "📡 Response headers:",
//   //       Object.fromEntries(response.headers.entries())
//   //     );

//   //     const responseText = await response.text();
//   //     console.log("📨 Raw response text:", responseText);

//   //     if (!response.ok) {
//   //       throw new Error(`HTTP ${response.status}: ${responseText}`);
//   //     }

//   //     let data;
//   //     try {
//   //       data = JSON.parse(responseText);
//   //     } catch (parseError) {
//   //       throw new Error("Invalid JSON response from server");
//   //     }

//   //     console.log("=== COMPLETE LOGIN RESPONSE ANALYSIS ===");
//   //     console.log("Full response object:", JSON.stringify(data, null, 2));
//   //     console.log("=== END ANALYSIS ===");

//   //     if (data.success) {
//   //       const { accessToken, refreshToken, userData, tokenType } =
//   //         extractTokensAndUser(data);

//   //       if (!accessToken || !userData) {
//   //         throw new Error("Invalid response: missing token or user data");
//   //       }

//   //       // Store in both storage systems
//   //       setAuthData({ accessToken, refreshToken, tokenType }, userData);

//   //       return {
//   //         success: true,
//   //         user: userData,
//   //         redirectTo: userData.roleId === 1 ? "/admindashboard" : "/dashboard",
//   //       };
//   //     } else {
//   //       return {
//   //         success: false,
//   //         error: data.message || "Login failed",
//   //       };
//   //     }
//   //   } catch (error) {
//   //     console.error("💥 Login error:", error);
//   //     return {
//   //       success: false,
//   //       error: error.message || "Network error. Please check your connection.",
//   //     };
//   //   }
//   // };

//   // Enhanced login function with better redirect handling
//   const login = async (email, password) => {
//     try {
//       console.log("🔐 Login attempt started for:", email);

//       const loginUrl = API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN);
//       console.log("🌐 Login URL:", loginUrl);

//       const response = await fetch(loginUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       console.log("📡 Response status:", response.status);

//       const responseText = await response.text();
//       console.log("📨 Raw response text:", responseText);

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${responseText}`);
//       }

//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (parseError) {
//         throw new Error("Invalid JSON response from server");
//       }

//       console.log("=== COMPLETE LOGIN RESPONSE ANALYSIS ===");
//       console.log("Full response object:", JSON.stringify(data, null, 2));
//       console.log("=== END ANALYSIS ===");

//       if (data.success) {
//         const { accessToken, refreshToken, userData, tokenType } =
//           extractTokensAndUser(data);

//         if (!accessToken || !userData) {
//           throw new Error("Invalid response: missing token or user data");
//         }

//         // Store in both storage systems
//         setAuthData({ accessToken, refreshToken, tokenType }, userData);

//         // Determine redirect path based on user role
//         const redirectTo =
//           userData.roleId === 1 ? "/admindashboard" : "/dashboard";

//         console.log("✅ Login successful, redirecting to:", redirectTo);

//         return {
//           success: true,
//           user: userData,
//           redirectTo: redirectTo,
//           message: "Login successful!",
//         };
//       } else {
//         return {
//           success: false,
//           error: data.message || "Login failed",
//         };
//       }
//     } catch (error) {
//       console.error("💥 Login error:", error);
//       return {
//         success: false,
//         error: error.message || "Network error. Please check your connection.",
//       };
//     }
//   };

//   // Enhanced register function with maximum debugging
//   const register = async (userData) => {
//     try {
//       console.log("🚀 Registration attempt started for:", userData.email);

//       const registerUrl = API_CONFIG.getFullUrl(
//         API_CONFIG.ENDPOINTS.AUTH.REGISTER
//       );
//       console.log("🌐 Register URL:", registerUrl);

//       const response = await fetch(registerUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       console.log("📡 Response status:", response.status);
//       console.log(
//         "📡 Response headers:",
//         Object.fromEntries(response.headers.entries())
//       );

//       const responseText = await response.text();
//       console.log("📨 Raw response text:", responseText);

//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (parseError) {
//         throw new Error("Invalid JSON response from server");
//       }

//       console.log("=== COMPLETE REGISTRATION RESPONSE ANALYSIS ===");
//       console.log("Full response object:", JSON.stringify(data, null, 2));
//       console.log("=== END ANALYSIS ===");

//       if (data.success) {
//         const {
//           accessToken,
//           refreshToken,
//           userData: extractedUserData,
//           tokenType,
//         } = extractTokensAndUser(data);

//         // If we have tokens and user data, store them and auto-login
//         if (accessToken && extractedUserData) {
//           console.log("✅ Auto-login after registration");
//           setAuthData(
//             { accessToken, refreshToken, tokenType },
//             extractedUserData
//           );

//           return {
//             success: true,
//             user: extractedUserData,
//             redirectTo:
//               extractedUserData.roleId === 1 ? "/admindashboard" : "/dashboard",
//           };
//         }
//         // If no tokens (common for registration), just show success message
//         else {
//           console.log("✅ Registration successful, redirecting to login");
//           return {
//             success: true,
//             message: data.message || "Registration successful! Please login.",
//             redirectTo: "/login",
//           };
//         }
//       } else {
//         return {
//           success: false,
//           error: data.message || "Registration failed",
//         };
//       }
//     } catch (error) {
//       console.error("💥 Registration error:", error);
//       return {
//         success: false,
//         error: error.message || "Network error. Please check your connection.",
//       };
//     }
//   };

//   // Refresh token function
//   const refreshToken = async () => {
//     try {
//       const { refreshToken: currentRefreshToken } = tokens;

//       if (!currentRefreshToken) {
//         throw new Error("No refresh token available");
//       }

//       const refreshUrl = API_CONFIG.getFullUrl(
//         API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN
//       );
//       console.log("🔄 Refreshing token...");

//       const response = await fetch(refreshUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${currentRefreshToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Token refresh failed: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         const { accessToken, refreshToken: newRefreshToken } =
//           extractTokensAndUser(data);

//         if (accessToken) {
//           // Update tokens
//           setAuthData(
//             {
//               accessToken,
//               refreshToken: newRefreshToken || currentRefreshToken,
//               tokenType: "Bearer",
//             },
//             user
//           );

//           return { success: true, accessToken };
//         }
//       }

//       throw new Error("Token refresh failed");
//     } catch (error) {
//       console.error("💥 Token refresh error:", error);
//       // Clear auth data if refresh fails
//       clearAuthData();
//       return { success: false, error: error.message };
//     }
//   };

//   const logout = () => {
//     console.log("🚪 Logging out...");
//     clearAuthData();
//     window.location.href = "/login";
//   };

//   // Get current tokens
//   const getTokens = () => {
//     return tokens;
//   };

//   // Check if user is authenticated
//   const isAuthenticated = () => {
//     return !!(tokens.accessToken && user);
//   };

//   const value = {
//     user,
//     tokens,
//     login,
//     register,
//     logout,
//     refreshToken,
//     loading,
//     clearAuthData,
//     getTokens,
//     isAuthenticated,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// import React, { createContext, useState, useContext, useEffect } from "react";

// // API Configuration
// const API_CONFIG = {
//   BASE_URL: "http://localhost:9091",
//   API_VERSION: "/api/v1",

//   ENDPOINTS: {
//     AUTH: {
//       LOGIN: "/auth/login",
//       REGISTER: "/auth/register",
//       LOGOUT: "/auth/logout",
//       REFRESH_TOKEN: "/auth/refresh",
//     },
//     USER: {
//       PROFILE: "/user/profile",
//       UPDATE: "/user/update",
//     },
//   },

//   getFullUrl: (endpoint) => {
//     return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
//   },
// };

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// // Enhanced Cookie utility functions
// const cookieUtils = {
//   // Set a cookie with secure options
//   setCookie: (name, value, days = 7, secure = false) => {
//     const expires = new Date();
//     expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

//     let cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;

//     if (secure || process.env.NODE_ENV === "production") {
//       cookieString += ";Secure";
//     }

//     document.cookie = cookieString;
//   },

//   // Get a cookie
//   getCookie: (name) => {
//     const nameEQ = name + "=";
//     const ca = document.cookie.split(";");
//     for (let i = 0; i < ca.length; i++) {
//       let c = ca[i];
//       while (c.charAt(0) === " ") c = c.substring(1, c.length);
//       if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
//     }
//     return null;
//   },

//   // Delete a cookie
//   deleteCookie: (name) => {
//     document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
//   },

//   // Set multiple auth cookies
//   setAuthCookies: (tokenData, userData = null) => {
//     const {
//       accessToken,
//       refreshToken,
//       tokenType = "Bearer",
//       expiresIn,
//     } = tokenData;

//     if (accessToken) {
//       cookieUtils.setCookie("access_token", accessToken, 1); // 1 day for access token
//     }

//     if (refreshToken) {
//       cookieUtils.setCookie("refresh_token", refreshToken, 30); // 30 days for refresh token
//     }

//     if (tokenType) {
//       cookieUtils.setCookie("token_type", tokenType, 7);
//     }

//     if (userData) {
//       cookieUtils.setCookie("user_data", JSON.stringify(userData), 7);
//     }

//     console.log("🔐 Auth cookies set successfully");
//   },

//   // Clear all auth cookies
//   clearAuthCookies: () => {
//     cookieUtils.deleteCookie("access_token");
//     cookieUtils.deleteCookie("refresh_token");
//     cookieUtils.deleteCookie("token_type");
//     cookieUtils.deleteCookie("user_data");
//     console.log("🔐 Auth cookies cleared");
//   },

//   // Get all auth data from cookies
//   getAuthFromCookies: () => {
//     const accessToken = cookieUtils.getCookie("access_token");
//     const refreshToken = cookieUtils.getCookie("refresh_token");
//     const tokenType = cookieUtils.getCookie("token_type");
//     const userData = cookieUtils.getCookie("user_data");

//     let parsedUserData = null;
//     if (userData) {
//       try {
//         parsedUserData = JSON.parse(userData);
//       } catch (error) {
//         console.error("Error parsing user data from cookie:", error);
//         cookieUtils.deleteCookie("user_data");
//       }
//     }

//     return {
//       accessToken,
//       refreshToken,
//       tokenType,
//       user: parsedUserData,
//     };
//   },
// };

// // Enhanced localStorage utility functions
// const storageUtils = {
//   // Set item in localStorage
//   setItem: (key, value) => {
//     try {
//       localStorage.setItem(key, value);
//     } catch (error) {
//       console.error(`Error storing ${key} in localStorage:`, error);
//     }
//   },

//   // Get item from localStorage
//   getItem: (key) => {
//     try {
//       return localStorage.getItem(key);
//     } catch (error) {
//       console.error(`Error reading ${key} from localStorage:`, error);
//       return null;
//     }
//   },

//   // Remove item from localStorage
//   removeItem: (key) => {
//     try {
//       localStorage.removeItem(key);
//     } catch (error) {
//       console.error(`Error removing ${key} from localStorage:`, error);
//     }
//   },

//   // Set auth data in localStorage
//   setAuthData: (tokenData, userData = null) => {
//     const { accessToken, refreshToken, tokenType = "Bearer" } = tokenData;

//     if (accessToken) {
//       storageUtils.setItem("access_token", accessToken);
//     }

//     if (refreshToken) {
//       storageUtils.setItem("refresh_token", refreshToken);
//     }

//     if (tokenType) {
//       storageUtils.setItem("token_type", tokenType);
//     }

//     if (userData) {
//       storageUtils.setItem("user_data", JSON.stringify(userData));
//     }

//     console.log("💾 Auth data stored in localStorage");
//   },

//   // Get auth data from localStorage
//   getAuthFromStorage: () => {
//     const accessToken = storageUtils.getItem("access_token");
//     const refreshToken = storageUtils.getItem("refresh_token");
//     const tokenType = storageUtils.getItem("token_type");
//     const userData = storageUtils.getItem("user_data");

//     let parsedUserData = null;
//     if (userData) {
//       try {
//         parsedUserData = JSON.parse(userData);
//       } catch (error) {
//         console.error("Error parsing user data from localStorage:", error);
//         storageUtils.removeItem("user_data");
//       }
//     }

//     return {
//       accessToken,
//       refreshToken,
//       tokenType,
//       user: parsedUserData,
//     };
//   },

//   // Clear all auth data from localStorage
//   clearAuthData: () => {
//     storageUtils.removeItem("access_token");
//     storageUtils.removeItem("refresh_token");
//     storageUtils.removeItem("token_type");
//     storageUtils.removeItem("user_data");
//     console.log("💾 Auth data cleared from localStorage");
//   },
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [tokens, setTokens] = useState({
//     accessToken: null,
//     refreshToken: null,
//     tokenType: "Bearer",
//   });

//   // Use config file for API URLs
//   const API_BASE_URL = API_CONFIG.BASE_URL + API_CONFIG.API_VERSION;

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   // Enhanced storage function - stores in both localStorage and cookies
//   const setAuthData = (tokenData, userData = null) => {
//     const { accessToken, refreshToken, tokenType = "Bearer" } = tokenData;

//     console.log("🔄 Storing auth data...", {
//       hasAccessToken: !!accessToken,
//       hasRefreshToken: !!refreshToken,
//       hasUserData: !!userData,
//     });

//     // Store in localStorage
//     storageUtils.setAuthData(
//       { accessToken, refreshToken, tokenType },
//       userData
//     );

//     // Store in cookies
//     cookieUtils.setAuthCookies(
//       { accessToken, refreshToken, tokenType },
//       userData
//     );

//     // Update state
//     setTokens({ accessToken, refreshToken, tokenType });
//     if (userData) {
//       setUser(userData);
//     }

//     console.log("✅ Auth data stored successfully in both storage systems");
//   };

//   // Clear all auth data from both storage systems
//   const clearAuthData = () => {
//     storageUtils.clearAuthData();
//     cookieUtils.clearAuthCookies();
//     setTokens({ accessToken: null, refreshToken: null, tokenType: "Bearer" });
//     setUser(null);
//     console.log("✅ All auth data cleared");
//   };

//   // Enhanced auth status check
//   const checkAuthStatus = () => {
//     try {
//       console.log("🔍 Checking auth status...");

//       let accessToken = null;
//       let refreshToken = null;
//       let userData = null;
//       let tokenType = "Bearer";

//       // First try to get from localStorage
//       const storageAuth = storageUtils.getAuthFromStorage();
//       console.log("📦 Storage auth data:", storageAuth);

//       // Then try cookies
//       const cookieAuth = cookieUtils.getAuthFromCookies();
//       console.log("🍪 Cookie auth data:", cookieAuth);

//       // Prefer localStorage, fallback to cookies
//       if (storageAuth.accessToken && storageAuth.user) {
//         accessToken = storageAuth.accessToken;
//         refreshToken = storageAuth.refreshToken;
//         userData = storageAuth.user;
//         tokenType = storageAuth.tokenType || "Bearer";
//         console.log("✅ Using auth data from localStorage");
//       } else if (cookieAuth.accessToken && cookieAuth.user) {
//         accessToken = cookieAuth.accessToken;
//         refreshToken = cookieAuth.refreshToken;
//         userData = cookieAuth.user;
//         tokenType = cookieAuth.tokenType || "Bearer";
//         console.log("✅ Using auth data from cookies");

//         // Sync back to localStorage
//         storageUtils.setAuthData(
//           { accessToken, refreshToken, tokenType },
//           userData
//         );
//       }

//       console.log("🎯 Final auth check:", {
//         accessToken: accessToken ? "***" + accessToken.slice(-10) : "None",
//         refreshToken: refreshToken ? "***" + refreshToken.slice(-10) : "None",
//         user: userData ? userData.email : "None",
//       });

//       if (accessToken && userData) {
//         console.log("✅ Setting valid user and tokens");
//         setTokens({ accessToken, refreshToken, tokenType });
//         setUser(userData);
//       } else {
//         console.log("❌ No valid auth data found");
//         setTokens({
//           accessToken: null,
//           refreshToken: null,
//           tokenType: "Bearer",
//         });
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("💥 Error checking auth status:", error);
//       clearAuthData();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Enhanced token extraction function
//   const extractTokensAndUser = (data) => {
//     console.log("🔍 Extracting tokens and user data...");

//     let accessToken = null;
//     let refreshToken = null;
//     let userData = null;
//     let tokenType = "Bearer";

//     // Multiple possible response structures
//     if (data.data) {
//       // Structure 1: Nested tokens and user
//       if (data.data.accessToken) {
//         accessToken = data.data.accessToken;
//         refreshToken = data.data.refreshToken;
//         userData = data.data.user || data.data;
//         tokenType = data.data.tokenType || "Bearer";
//       }
//       // Structure 2: Direct token
//       else if (data.data.token) {
//         accessToken = data.data.token;
//         userData = data.data.user || data.data;
//       }
//       // Structure 3: User data with embedded token
//       else if (data.data.id || data.data.email) {
//         userData = data.data;
//         accessToken = data.data.accessToken || data.data.token;
//         refreshToken = data.data.refreshToken;
//       }
//     }

//     // Check root level
//     if (!accessToken && data.accessToken) {
//       accessToken = data.accessToken;
//       refreshToken = data.refreshToken;
//       userData = data.user || data.data;
//       tokenType = data.tokenType || "Bearer";
//     }

//     // Final fallback
//     if (!accessToken && data.token) {
//       accessToken = data.token;
//       userData = data.user || data.data;
//     }

//     console.log("🎯 Extraction result:", {
//       accessToken: accessToken ? "***" + accessToken.slice(-10) : "None",
//       refreshToken: refreshToken ? "***" + refreshToken.slice(-10) : "None",
//       userData: userData ? "Exists" : "None",
//       tokenType,
//     });

//     return { accessToken, refreshToken, userData, tokenType };
//   };

//   // Enhanced login function
//   const login = async (email, password) => {
//     try {
//       console.log("🔐 Login attempt started for:", email);

//       const loginUrl = API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN);
//       console.log("🌐 Login URL:", loginUrl);

//       const response = await fetch(loginUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP ${response.status}: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("📨 Login response:", data);

//       if (data.success) {
//         const { accessToken, refreshToken, userData, tokenType } =
//           extractTokensAndUser(data);

//         if (!accessToken || !userData) {
//           throw new Error("Invalid response: missing token or user data");
//         }

//         // Store in both storage systems
//         setAuthData({ accessToken, refreshToken, tokenType }, userData);

//         return {
//           success: true,
//           user: userData,
//           redirectTo: userData.roleId === 1 ? "/admindashboard" : "/dashboard",
//         };
//       } else {
//         return {
//           success: false,
//           error: data.message || "Login failed",
//         };
//       }
//     } catch (error) {
//       console.error("💥 Login error:", error);
//       return {
//         success: false,
//         error: error.message || "Network error. Please check your connection.",
//       };
//     }
//   };

//   // Enhanced register function
//   const register = async (userData) => {
//     try {
//       console.log("🚀 Registration attempt started for:", userData.email);

//       const registerUrl = API_CONFIG.getFullUrl(
//         API_CONFIG.ENDPOINTS.AUTH.REGISTER
//       );
//       console.log("🌐 Register URL:", registerUrl);

//       const response = await fetch(registerUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       console.log("📡 Response status:", response.status);

//       const responseText = await response.text();
//       console.log("📨 Raw response:", responseText);

//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (parseError) {
//         throw new Error("Invalid JSON response from server");
//       }

//       console.log("📊 Parsed response:", data);

//       if (data.success) {
//         const {
//           accessToken,
//           refreshToken,
//           userData: extractedUserData,
//           tokenType,
//         } = extractTokensAndUser(data);

//         // If we have tokens and user data, store them and auto-login
//         if (accessToken && extractedUserData) {
//           console.log("✅ Auto-login after registration");
//           setAuthData(
//             { accessToken, refreshToken, tokenType },
//             extractedUserData
//           );

//           return {
//             success: true,
//             user: extractedUserData,
//             redirectTo:
//               extractedUserData.roleId === 1 ? "/admindashboard" : "/dashboard",
//           };
//         }
//         // If no tokens (common for registration), just show success message
//         else {
//           console.log("✅ Registration successful, redirecting to login");
//           return {
//             success: true,
//             message: data.message || "Registration successful! Please login.",
//             redirectTo: "/login",
//           };
//         }
//       } else {
//         return {
//           success: false,
//           error: data.message || "Registration failed",
//         };
//       }
//     } catch (error) {
//       console.error("💥 Registration error:", error);
//       return {
//         success: false,
//         error: error.message || "Network error. Please check your connection.",
//       };
//     }
//   };

//   const logout = () => {
//     console.log("🚪 Logging out...");
//     clearAuthData();
//     window.location.href = "/login";
//   };

//   // Get current tokens
//   const getTokens = () => {
//     return tokens;
//   };

//   // Check if user is authenticated
//   const isAuthenticated = () => {
//     return !!(tokens.accessToken && user);
//   };

//   const value = {
//     user,
//     tokens,
//     login,
//     register,
//     logout,
//     loading,
//     clearAuthData,
//     getTokens,
//     isAuthenticated,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// import React, { createContext, useState, useContext, useEffect } from "react";

// // API Configuration
// const API_CONFIG = {
//   BASE_URL: "http://localhost:9091",
//   API_VERSION: "/api/v1",

//   ENDPOINTS: {
//     AUTH: {
//       LOGIN: "/auth/login",
//       REGISTER: "/auth/register",
//       LOGOUT: "/auth/logout",
//       REFRESH_TOKEN: "/auth/refresh",
//     },
//     USER: {
//       PROFILE: "/user/profile",
//       UPDATE: "/user/update",
//     },
//   },

//   getFullUrl: (endpoint) => {
//     return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
//   },
// };

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// // Cookie utility functions
// const cookieUtils = {
//   // Set a cookie
//   setCookie: (name, value, days = 7) => {
//     const expires = new Date();
//     expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
//     document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
//   },

//   // Get a cookie
//   getCookie: (name) => {
//     const nameEQ = name + "=";
//     const ca = document.cookie.split(";");
//     for (let i = 0; i < ca.length; i++) {
//       let c = ca[i];
//       while (c.charAt(0) === " ") c = c.substring(1, c.length);
//       if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
//     }
//     return null;
//   },

//   // Delete a cookie
//   deleteCookie: (name) => {
//     document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
//   },

//   // Set multiple cookies
//   setAuthCookies: (token, refreshToken = null, userData = null) => {
//     cookieUtils.setCookie("auth_token", token, 7);
//     if (refreshToken) {
//       cookieUtils.setCookie("refresh_token", refreshToken, 30);
//     }
//     if (userData) {
//       cookieUtils.setCookie("user_data", JSON.stringify(userData), 7);
//     }
//   },

//   // Clear all auth cookies
//   clearAuthCookies: () => {
//     cookieUtils.deleteCookie("auth_token");
//     cookieUtils.deleteCookie("refresh_token");
//     cookieUtils.deleteCookie("user_data");
//   },

//   // Get auth data from cookies
//   getAuthFromCookies: () => {
//     const token = cookieUtils.getCookie("auth_token");
//     const refreshToken = cookieUtils.getCookie("refresh_token");
//     const userData = cookieUtils.getCookie("user_data");

//     let parsedUserData = null;
//     if (userData) {
//       try {
//         parsedUserData = JSON.parse(userData);
//       } catch (error) {
//         console.error("Error parsing user data from cookie:", error);
//         cookieUtils.deleteCookie("user_data");
//       }
//     }

//     return {
//       token,
//       refreshToken,
//       user: parsedUserData,
//     };
//   },
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Use config file for API URLs
//   const API_BASE_URL = API_CONFIG.BASE_URL + API_CONFIG.API_VERSION;

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   // Enhanced storage functions
//   const setAuthData = (token, refreshToken = null, userData = null) => {
//     // Store in localStorage
//     localStorage.setItem("token", token);
//     if (refreshToken) {
//       localStorage.setItem("refreshToken", refreshToken);
//     }
//     if (userData) {
//       localStorage.setItem("user", JSON.stringify(userData));
//     }

//     // Store in cookies
//     cookieUtils.setAuthCookies(token, refreshToken, userData);

//     console.log("Auth data stored in both localStorage and cookies");
//   };

//   const clearAuthData = () => {
//     // Clear localStorage
//     localStorage.removeItem("token");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user");

//     // Clear cookies
//     cookieUtils.clearAuthCookies();

//     console.log("Auth data cleared from both localStorage and cookies");
//   };

//   // Check auth status from both localStorage and cookies
//   const checkAuthStatus = () => {
//     try {
//       console.log("Checking auth status...");

//       let token = null;
//       let userData = null;

//       // First try to get from localStorage
//       const localToken = localStorage.getItem("token");
//       const localUser = localStorage.getItem("refreshToken");

//       // Then try cookies
//       const cookieAuth = cookieUtils.getAuthFromCookies();

//       // Prefer localStorage, fallback to cookies
//       if (localToken && localUser) {
//         try {
//           token = localToken;
//           userData = JSON.parse(localUser);
//           console.log("Using auth data from localStorage");
//         } catch (error) {
//           console.error("Error parsing localStorage data:", error);
//         }
//       } else if (cookieAuth.token && cookieAuth.user) {
//         token = cookieAuth.token;
//         userData = cookieAuth.user;
//         console.log("Using auth data from cookies");

//         // Sync back to localStorage
//         setAuthData(token, cookieAuth.refreshToken, userData);
//       }

//       console.log("Final auth check - Token:", token ? "Exists" : "None");
//       console.log(
//         "Final auth check - User:",
//         userData ? userData.email : "None"
//       );

//       if (token && userData) {
//         console.log("Setting valid user");
//         setUser(userData);
//       } else {
//         console.log("No valid auth data found");
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("Error checking auth status:", error);
//       clearAuthData();
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Login with Backend API - Enhanced Debug version with Cookie Support
//   const login = async (email, password) => {
//     try {
//       console.log("Login attempt started for:", email);

//       // Using the config file to build URL
//       const loginUrl = API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN);
//       console.log("Login URL:", loginUrl);

//       const response = await fetch(loginUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       // Check if response is OK
//       if (!response.ok) {
//         let errorMessage = `HTTP error! status: ${response.status}`;
//         try {
//           const errorData = await response.json();
//           errorMessage = errorData.message || errorMessage;
//         } catch (e) {
//           errorMessage = response.statusText || errorMessage;
//         }
//         throw new Error(errorMessage);
//       }

//       const data = await response.json();

//       console.log("=== FULL BACKEND RESPONSE DEBUG ===");
//       console.log("Complete response:", JSON.stringify(data, null, 2));
//       console.log("Data.success:", data.success);
//       console.log("Data.message:", data.message);
//       console.log("Data.data:", data.data);
//       console.log("Data.data type:", typeof data.data);

//       if (data.data) {
//         console.log("Data.data keys:", Object.keys(data.data));
//         console.log("Data.data values:", data.data);

//         // Check for accessToken and refreshToken
//         console.log("Data.data.accessToken:", data.data.accessToken);
//         console.log("Data.data.refreshToken:", data.data.refreshToken);
//         console.log("Data.data.token:", data.data.token);

//         // Check for user data
//         console.log("Data.data.user:", data.data.user);
//         console.log("Data.data.userData:", data.data.userData);
//         console.log("Data.data.userInfo:", data.data.userInfo);

//         // Check if data.data has user fields directly
//         if (data.data.id || data.data.email) {
//           console.log("Data.data has user fields directly:", {
//             id: data.data.id,
//             email: data.data.email,
//             username: data.data.username,
//             firstName: data.data.firstName,
//             lastName: data.data.lastName,
//             roleId: data.data.roleId,
//           });
//         }
//       }
//       console.log("=== END DEBUG ===");

//       if (data.success) {
//         console.log("Login successful, extracting data...");

//         let userData = null;
//         let token = null;
//         let refreshToken = null;

//         // Extract based on different possible structures
//         if (data.data) {
//           // Structure 1: {data: {accessToken: '...', refreshToken: '...', user: {...}}}
//           if (
//             data.data.accessToken &&
//             data.data.refreshToken &&
//             data.data.user
//           ) {
//             token = data.data.accessToken;
//             refreshToken = data.data.refreshToken;
//             userData = data.data.user;
//           }
//           // Structure 2: {data: {token: '...', refreshToken: '...', user: {...}}}
//           else if (
//             data.data.token &&
//             data.data.refreshToken &&
//             data.data.user
//           ) {
//             token = data.data.token;
//             refreshToken = data.data.refreshToken;
//             userData = data.data.user;
//           }
//           // Structure 3: {data: {accessToken: '...', user: {...}}}
//           else if (data.data.accessToken && data.data.user) {
//             token = data.data.accessToken;
//             userData = data.data.user;
//           }
//           // Structure 4: {data: {token: '...', user: {...}}}
//           else if (data.data.token && data.data.user) {
//             token = data.data.token;
//             userData = data.data.user;
//           }
//           // Structure 5: {data: {accessToken: '...', refreshToken: '...', ...userFields}}
//           else if (
//             data.data.accessToken &&
//             data.data.refreshToken &&
//             (data.data.id || data.data.email)
//           ) {
//             token = data.data.accessToken;
//             refreshToken = data.data.refreshToken;
//             userData = data.data;
//           }
//           // Structure 6: {data: {token: '...', ...userFields}}
//           else if (data.data.token && (data.data.id || data.data.email)) {
//             token = data.data.token;
//             userData = data.data;
//           }
//           // Structure 7: {data: {...userFields}} (no explicit token)
//           else if (data.data.id || data.data.email) {
//             userData = data.data;
//             // Try to find token in different possible locations
//             token =
//               data.data.accessToken || data.data.token || data.data.jwtToken;
//           }
//         }

//         console.log("Extracted userData:", userData);
//         console.log("Extracted token:", token);
//         console.log("Extracted refreshToken:", refreshToken);

//         // If we have user data but no token, check if token might be in the root
//         if (userData && !token) {
//           token = data.accessToken || data.token;
//           console.log("Token from root:", token);
//         }

//         // Final validation
//         if (!userData) {
//           console.error("No user data found in response");
//           throw new Error("No user data received from server");
//         }

//         if (!token) {
//           console.error("No token found in response");
//           throw new Error("No authentication token received from server");
//         }

//         // Store in both localStorage and cookies
//         setAuthData(token, refreshToken, userData);

//         console.log("Data stored in localStorage and cookies");
//         setUser(userData);

//         return {
//           success: true,
//           user: userData,
//           redirectTo: userData.roleId === 1 ? "/admindashboard" : "/dashboard",
//         };
//       } else {
//         return {
//           success: false,
//           error: data.message || "Login failed",
//         };
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       return {
//         success: false,
//         error: error.message || "Network error. Please check your connection.",
//       };
//     }
//   };

//   // Enhanced register function with better debugging
//   const register = async (userData) => {
//     try {
//       console.log("🚀 Registration attempt started for:", userData.email);

//       // Using the config file
//       const registerUrl = API_CONFIG.getFullUrl(
//         API_CONFIG.ENDPOINTS.AUTH.REGISTER
//       );
//       console.log("Register URL:", registerUrl);

//       const response = await fetch(registerUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       console.log("📡 Response status:", response.status);
//       console.log(
//         "📡 Response headers:",
//         Object.fromEntries(response.headers.entries())
//       );

//       const responseText = await response.text();
//       console.log("📡 Raw response text:", responseText);

//       let data;
//       try {
//         data = JSON.parse(responseText);
//         console.log("📡 Parsed JSON data:", data);
//       } catch (parseError) {
//         console.error("❌ Failed to parse JSON:", parseError);
//         throw new Error("Invalid JSON response from server");
//       }

//       // console.log("=== FULL REGISTRATION RESPONSE ANALYSIS ===");
//       // console.log("Data:", data);
//       // console.log("Data type:", typeof data);
//       // console.log("Data keys:", Object.keys(data));

//       if (data.data) {
//         console.log("Data.data type:", typeof data.data);
//         console.log(
//           "Data.data keys:",
//           data.data ? Object.keys(data.data) : "null"
//         );
//       }

//       // console.log("Data.success:", data.success);
//       // console.log("Data.message:", data.message);
//       // console.log("=== END ANALYSIS ===");

//       if (data.success) {
//         console.log("✅ Registration successful on backend");

//         // Check if this is a "success but no immediate login" scenario
//         if (data.message && !data.data) {
//           console.log("📝 Success message without user data:", data.message);
//           return {
//             success: true,
//             message: data.message,
//             redirectTo: "/login", // Redirect to login after registration
//           };
//         }

//         // Try to extract user data and token with multiple fallbacks
//         let extractedUserData = null;
//         let token = null;

//         // Method 1: Check nested data structure
//         if (data.data) {
//           console.log("🔍 Checking data.data structure...");

//           // If data.data is the user object directly
//           if (data.data.id || data.data.email) {
//             extractedUserData = data.data;
//             token = data.data.accessToken || data.data.token;
//             console.log("✅ Found user data in data.data");
//           }

//           // If data.data has nested user object
//           else if (
//             data.data.user &&
//             (data.data.user.id || data.data.user.email)
//           ) {
//             extractedUserData = data.data.user;
//             token = data.data.accessToken || data.data.token;
//             console.log("✅ Found user data in data.data.user");
//           }
//         }

//         // Method 2: Check root level
//         if (!extractedUserData && (data.user || data.id || data.email)) {
//           extractedUserData = data.user || data;
//           token = data.accessToken || data.token;
//           console.log("✅ Found user data in root level");
//         }

//         console.log("🎯 Final extraction result:", {
//           hasUserData: !!extractedUserData,
//           hasToken: !!token,
//           userData: extractedUserData,
//           tokenExists: !!token,
//         });

//         // If we have user data but no token, that's OK for registration
//         if (extractedUserData && !token) {
//           console.log(
//             "ℹ️ User data found but no token - this is normal for registration"
//           );
//           return {
//             success: true,
//             message: data.message || "Registration successful! Please login.",
//             redirectTo: "/login",
//           };
//         }

//         // If we have both user data and token, proceed with auto-login
//         if (extractedUserData && token) {
//           console.log("✅ Auto-login after registration");
//           setAuthData(token, null, extractedUserData);
//           setUser(extractedUserData);

//           return {
//             success: true,
//             user: extractedUserData,
//             redirectTo:
//               extractedUserData.roleId === 1 ? "/admindashboard" : "/dashboard",
//           };
//         }

//         // If we only have a success message
//         if (data.message) {
//           console.log("✅ Registration success with message only");
//           return {
//             success: true,
//             message: data.message,
//             redirectTo: "/login",
//           };
//         }

//         // If we can't extract anything useful but success is true
//         console.warn("⚠️ Success true but no recognizable data structure");
//         return {
//           success: true,
//           message: "Registration successful",
//           redirectTo: "/login",
//         };
//       } else {
//         // Registration failed
//         console.error("❌ Registration failed:", data.message);
//         return {
//           success: false,
//           error: data.message || "Registration failed",
//         };
//       }
//     } catch (error) {
//       console.error("💥 Registration error:", error);
//       return {
//         success: false,
//         error: error.message || "Network error. Please check your connection.",
//       };
//     }
//   };

//   const logout = () => {
//     console.log("Logging out...");
//     clearAuthData();
//     setUser(null);
//     window.location.href = "/login";
//   };

//   // Manual cleanup function that can be called from components
//   const clearAllAuthData = () => {
//     console.log("Manual auth data cleanup");
//     clearAuthData();
//     setUser(null);
//     window.location.reload();
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     loading,
//     clearAuthData: clearAllAuthData,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
