import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../../lib/firebase.config";

type Props = {
  children: React.ReactNode;
};

interface AuthUserContextType {
  user: User | null;
  loading: boolean;
  signIn: Function;
  signOutUser: Function;
}

const AuthUserContext = createContext<AuthUserContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOutUser: async () => {},
});

export const AuthUserProvider = ({ children }: Props) => {
  const [user, setUser] = useState(() => {
    return auth.currentUser;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
        setUser(user);
      } else {
        setLoading(true);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const signIn = (email: string, password: string) => {
      return signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = () => {
    signOut(auth);
  };

  return (
    <AuthUserContext.Provider value={{ user, loading, signIn, signOutUser }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export default AuthUserContext;
