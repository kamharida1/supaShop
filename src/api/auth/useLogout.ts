import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export default function useLogout() { 
  const queryClient = useQueryClient();
  return useMutation(() => logout(), {
    onSuccess: () => {
      queryClient.removeQueries();
    }
  })
}