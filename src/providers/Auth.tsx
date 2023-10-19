
import React, { createContext, useContext } from "react";
import useProfile from "../api/auth/useProfile";

interface AuthData {
  profile: {
    avatar_url: string | null;
    created_at: string;
    email: string | null;
    group: string | null;
    id: string;
    username: string | null;
  } | null;
  error: Error | null;
  loading: boolean;
  isAdmin: boolean;
}

const CurrentUserContext = createContext<AuthData>({
  profile: null,
  loading: false,
  isAdmin: false,
  error: null,
});

export const useCurrentUserContext = () => { 
  return useContext(CurrentUserContext);
}

export const CurrentUserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = React.useState<AuthData["profile"] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const currentUserQuery = useProfile();

  React.useEffect(() => {
    const {isError, isFetching, data} = currentUserQuery;
    if (isFetching) {
      setLoading(true);
    }
    if (isError) {
      setError(new Error("Failed to fetch user profile"));
      setLoading(false);
    }
    if (data) {
      setProfile(data);
      setLoading(false);
    }
  }, [currentUserQuery.data, currentUserQuery.isError, currentUserQuery.isFetching, currentUserQuery.error]);

  return (
    <CurrentUserContext.Provider value={{
      loading,
      profile,
      error,
      isAdmin: profile?.group === "ADMIN",}}
    >
      {children}
    </CurrentUserContext.Provider>
  )
 }