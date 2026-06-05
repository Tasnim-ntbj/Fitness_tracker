// 📁 File: src/context/Appcontext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { type ActivityEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";

interface AppContextType {
  user: User | null; 
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isUserFetched: boolean;
  fetchUser: (token: string) => Promise<void>;
  signup: (signUpData: any) => Promise<any>; 
  login: (loginData: any) => Promise<any>;   
  logout: () => void;
  onboardingCompleted: boolean;
  //act_log  
  allActivityLogs: ActivityEntry[];
  setAllActivityLogs: React.Dispatch<React.SetStateAction<ActivityEntry[]>>;
  // updateUserProfile: (updates: Partial<User>) => void;  // used for local save
  updateUserProfile: (updates: Partial<User>) => Promise<any>;//profile page
  completeOnboarding: (onboardingData: any) => Promise<any>;//onboarding page
  saveHealthEntry: (entryData: any) => Promise<any>;//activity log page_add entry buttton
  updateHealthEntry: (id: string | number, entryData: any) => Promise<any>;//act_log page_ edit logs
  deleteHealthEntry: (id: string | number) => Promise<any>;//act_log page delete logs
  //dashboard
  getUserHealthLogs: () => Promise<any>;


}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isUserFetched, setIsUserFetched] = useState<boolean>(false);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

  // 🎯 Automatically re-evaluates whenever the 'user' object updates
  const onboardingCompleted = !!user?.isOnboardingComplete;

  // 🚨 1. BACKEND SIGNUP 
  const signup = async (signUpData: any) => {
    try {
      const url = "http://localhost:8080/auth/signup"; 
      const response = await fetch(url, { 
        method: "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpData) 
      });
      
      return await response.json(); 
    } catch (error) {
      console.error("Signup exception loop:", error);
      return { success: false, message: "Server connection failed during registration." };
    }
  };

  // 🚨 2. BACKEND LOGIN 
  const login = async (loginData: any) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", { 
        method: "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('token', result.jwtToken);
        localStorage.setItem('loggedUser', result.name || result.user?.name || "");

        // 🎯 FIX: Explicitly map fields out of result.user to protect root context structure
        const authenticatedUser = {
          ...(result.user ? result.user : result),
          token: result.jwtToken
        } as User;

        setUser(authenticatedUser);
      }
      return result; 
    } catch (error) {
      console.error(error);
      return { success: false, message: "Server connection failed" };
    }
  };

  // 🚨 3. PERSISTENT REFRESH FETCH PROFILE GATEWAY
  const fetchUser = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8080/user/me", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok && data) {
        // 🎯 FIX: Handle if your /user/me API sends data directly or wraps it in a .user block
        const userData = data.user ? data.user : data;
        
        const updatedUser = { 
          ...userData, 
          token 
        } as User;
        
        setUser(updatedUser);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Profile synchronization exception:", err);
      logout();
    } finally {
      setIsUserFetched(true);
    }
  };

    //🚨Logout 
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        await fetch("http://localhost:8080/auth/logout", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error("Optional server-side logout sweep failed:", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedUser');
      setUser(null);
      setIsUserFetched(true);
      navigate("/login");
    }
  };

  // 🚨 4. SUBMIT ONBOARDING DATA
  const completeOnboarding = async (onboardingData: any) => {
    try {
      const token = localStorage.getItem('token');
      const url = "http://localhost:8080/auth/onboarding"; 
      
      const response = await fetch(url, { 
        method: "PUT", 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(onboardingData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUser((prev) => {
          if (!prev) return null;
          const updatedData = result.user ? result.user : result;
          return {
            ...prev,
            ...updatedData, 
            isOnboardingComplete: true, // Safeguard mapping redundancy
            token: token
          };
        });
      }
      return result;
    } catch (error) {
      console.error("Failed submitting onboarding profile metadata:", error);
      return { success: false, message: "Could not link connection to data profile cluster." };
    }
  };



  // LOCAL PROFILE COMPONENT UPDATE
  // const updateUserProfile = (updates: Partial<User>) => {
  //   setUser((prevUser) => {
  //     if (!prevUser) return null;
  //     return { ...prevUser, ...updates };
  //   });
  // };

  // 🚨 UPDATE PROFILE VIA AXIOS/FETCH API
  const updateUserProfile = async (updates: Partial<User>) => {
    try {
      const token = localStorage.getItem('token');// Retrieve the user's login key
      const url = "http://localhost:8080/auth/update-profile";

      const response = await fetch(url, {
        method: "PUT",// PUT means we are replacing/updating existing resource data
        headers: {
          'Content-Type': 'application/json',// Telling the server: "We are sending text formatted as JSON"
          'Authorization': `Bearer ${token}`// Telling the server: "Here is proof of who I am"
        },
        body: JSON.stringify(updates)// Turn the raw JavaScript object into a flat string for transit (JSON)
      });

      const result = await response.json();// Wait for the server to reply and parse its response back into a JS object


      //if result is success 
      if (result.success) {
        // Update the React global state
        setUser((prevUser) => {
          if (!prevUser) return null;
          const updatedData = result.user ? result.user : result;
          return {
            ...prevUser,
            ...updatedData,
            token: token // Keep the token saved in state
          };
        });
      }
      return result; // Pass the result object back to the Profile page component so it can show an alert
    } catch (error) {
      console.error("Failed submitting updated profile payload metrics:", error);
      return { success: false, message: "Could not establish database syncing pipeline." };
    }
  };


//Add Entry button on activity log 
const saveHealthEntry = async (entryData: any) => {
  try {
    const token = localStorage.getItem('token');
    const url = "http://localhost:8080/health/add-entry";

    const response = await fetch(url, {
      method: "POST", // Creating a new database document row
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(entryData)
    });

    const result = await response.json();

    if (result.success && result.log) {
      // Hydrate global log activity tracking cache arrays instantly
      setAllActivityLogs((prevLogs) => [result.log, ...prevLogs]);
    }
    return result;
  } catch (error) {
    console.error("Database tracking link pipeline dropped:", error);
    return { success: false, message: "Could not safely sync data metric to storage." };
  }
};
//edit entry logs on the act_log page
const updateHealthEntry = async (id: string | number, entryData: any) => {
  try {
    const token = localStorage.getItem('token');
    const url = `http://localhost:8080/health/update-entry/${id}`;

    const response = await fetch(url, {
      method: "PUT", // 🛠️ PUT tells the backend to modify an existing resource
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(entryData)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Database entry modification link failed:", error);
    return { success: false, message: "Could not safely sync update to database storage." };
  }
};

//edit delete log on act_log
const deleteHealthEntry = async (id: string | number) => {
  try {
    const token = localStorage.getItem('token');
    const url = `http://localhost:8080/health/delete-entry/${id}`; // Passes the unique ID inside the URL path

    const response = await fetch(url, {
      method: "DELETE", // 🛠️ Uses the HTTP DELETE verb
      headers: {
        'Authorization': `Bearer ${token}` // Protects the route using your security token
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed executing entry deletion link:", error);
    return { success: false, message: "Server communication error during removal." };
  }
};

const getUserHealthLogs = async () => {
  try {
    const token = localStorage.getItem('token');
    const url = "http://localhost:8080/health/get-entries"; // 🚀 Your backend GET endpoint

    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}` // Secure identity token verification
      }
    });

    const result = await response.json();
    
    if (result.success && result.logs) {
      // Hydrate our global context array cache with the backend results
      setAllActivityLogs(result.logs);
    }
    return result;
  } catch (error) {
    console.error("Failed fetching live health documents:", error);
    return { success: false, message: "Database syncing error." };
  }
};



  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      fetchUser(savedToken);
    } else {
      setIsUserFetched(true);
    }
  }, []);

  const value = {
    user,
    setUser,
    isUserFetched,
    fetchUser,
    signup,
    login,
    logout,
    onboardingCompleted, 
    allActivityLogs,
    setAllActivityLogs,
    updateUserProfile,
    completeOnboarding,
    saveHealthEntry,
    updateHealthEntry,
    deleteHealthEntry, 
    getUserHealthLogs
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
};

export default AppProvider;