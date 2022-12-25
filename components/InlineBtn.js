import { Text, Pressable } from "react-native";
import AppStyles from "../styles/AppStyles";

export default function InlineBtn({ onPress, children }) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <Text style={[pressed && AppStyles.pressedInlineBtn, AppStyles.inlineBtn]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
