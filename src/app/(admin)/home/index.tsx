import { Text } from "react-native";
import { View } from "react-native";
import tw from 'twrnc'

export default function Home() {
  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text>Home</Text>
    </View>
  );
}
