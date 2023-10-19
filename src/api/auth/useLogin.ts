import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";


export default function useLogin() { 
  const queryClient = useQueryClient();

  return useMutation(["login"], async ({
    email,
    password,
  }: {
    email: string;
    password: string;
    }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (data) {
      await SecureStore.setItemAsync("authKeyEmail", email);
      await SecureStore.setItemAsync("authKeyPassword", password);
    }
    
    if (error) Alert.alert("Error", "Error signing in. Please try again.");

    return data;
  },
  )
}

