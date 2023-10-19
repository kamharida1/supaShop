import { Link, Stack, useRouter } from "expo-router";
import { Button, Platform, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { Text } from "react-native";

export default function HomeLayout() {
  const router = useRouter();

  return (
    <>
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerBlurEffect: "systemMaterialLight",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          name="index"
          options={{
            title: "Home",
            headerRight: ComposeButton,
            //headerLeft: ClearData,
            headerLargeTitle: true,
            headerSearchBarOptions: {
              onChangeText: (event) => {
                // Update the query params to match the search query.
                router.setParams({
                  q: event.nativeEvent.text,
                });
              },
            },
          }}
        /> */}
        {/* <Stack.Screen
          name="compose"
          options={{
            title: "Create a new product",
            presentation: "modal",
            headerRight: Platform.select({
              ios: DismissComposeButton,
            }),
          }}
        /> */}
      </Stack>
    </>
  );
}

function ComposeButton() {
  const router = useRouter();

  return (
    <Link
      href="/home/"
      onPress={(ev) => {
        ev.preventDefault();
        router.push("/home/");
      }}
      asChild
    >
      <Pressable
        style={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          paddingRight: 8,
        }}
      >
        <Text
          style={{
            fontWeight: "normal",
            paddingHorizontal: 8,
            fontSize: 16,
          }}
        >
          Add Product
        </Text>
        <FontAwesome5 name="arrow-circle-right" size={24} color="black" />
      </Pressable>
    </Link>
  );
}

function DismissComposeButton() {
  return (
    <Link href="..">
      <Text
        style={{
          fontWeight: "normal",
          paddingHorizontal: 8,
          fontSize: 16,
        }}
      >
        Back
      </Text>
    </Link>
  );
}
