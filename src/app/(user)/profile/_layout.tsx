import { Stack } from "expo-router";
import { Text } from "react-native";
import { View } from "react-native";
import tw from "twrnc";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: "systemMaterialLight",
        //headerShown: false,
      }}
    />
  );
}
