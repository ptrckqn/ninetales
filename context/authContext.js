import { createContext, useContext, useState, useEffect } from "react";
import nookies from "nookies";
import { firebase, firestore } from "../firebase/config";

const AuthContext = createContext({ user: null });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, "token", "");
      } else {
        const token = await user.getIdToken();
        nookies.set(undefined, "token", token);

        const docRef = firestore.collection("users").doc(user.displayName.toLowerCase());
        const userDoc = await docRef.get();
        setUser(userDoc.data());
      }
    });
  }, []);

  // Refresh token every 10 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = firebaseClient.auth().currentUser;
      if (user) await user.getIdToken(true);
    }, 60 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(interval);
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
