import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { Link, Redirect, router, useFocusEffect } from "expo-router";
import { useAuth } from "../providers/AuthProvider";
import { Button } from "../components/Button";
import { supabase } from "../lib/supabase";
import * as SecureStore from 'expo-secure-store';
import { useQueryClient } from "@tanstack/react-query";

interface Profile {
    avatar_url: string | null;
    created_at: string;
    email: string | null;
    group: string | null;
    id: string;
    username: string | null;
} 

const index = () => {
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState<Profile | null>(null);


  useEffect(() => {
    const key = async (): Promise<void> => {
      try {
        const email = await SecureStore.getItemAsync("authKeyEmail");
        const password = await SecureStore.getItemAsync("authKeyPassword");

        const credentials = { email, password };

        if (credentials) {
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const userId = user.id;
            const { data: userDb } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", userId)
              .single();

            if (userDb) {
              setUser(userDb);
            }
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    key()
  }, []);

  // if (loading) return (
  //   <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
  //     <ActivityIndicator size="large" color="#0000ff" />
  //   </View>
  // )

  // if (user?.group === "admin") {
  //   return <Redirect href="/(admin)" />;
  // } else  {
  //   return <Redirect href="/(user)/home" />;
  // }
  // if(!user) 
  if (user) {
    // If the user is logged in and has a certain group, redirect to a specific route
    if (user.group === "admin") {
      return <Redirect href="/(admin)" />;
    } else {
      return <Redirect href="/(user)" />;
    }
  }

  return  (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
        <Link href={"/(auth)/sign-in"} asChild>
          <Button text="Sign In" />
        </Link>
        <Link href={"/(auth)/sign-up"} asChild>
          <Button text="SignUp" />
        </Link>
      </View>
  );
};

export default index;
