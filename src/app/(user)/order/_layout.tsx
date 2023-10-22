import { Stack } from "expo-router";

export default function OrderLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: "systemMaterialLight",
        headerShown: false,
      }}
    />
  );
}
