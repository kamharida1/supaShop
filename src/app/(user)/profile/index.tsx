import { ActivityIndicator, Text } from "react-native";
import { View } from "react-native";
import tw from "twrnc";
import { router } from "expo-router";
import useLogOut from "../../../api/auth/useLogout";
import { Button } from "../../../components/Button";


export default function Profile() {

  // const signOut = async () => {
  //   await supabase.auth.signOut();
  //   await SecureStore.deleteItemAsync("authKeyEmail");
  //   await SecureStore.deleteItemAsync("authKeyPassword");
  //   queryClient.removeQueries();
  //   router.replace("/(auth)/sign-in");
  // }
  const signOutMutation = useLogOut();

  if (signOutMutation.isError) return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text>{signOutMutation.error.message}</Text>
    </View>
  )

  if (signOutMutation.isSuccess) {
    router.replace("/(auth)/sign-in");
  }

  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Button onPress={() => signOutMutation.mutate()} text="SignOut"/>
    </View>
  );
}
