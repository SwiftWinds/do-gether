import { StyleSheet, Text, View } from "react-native";

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#7F8487",
  },
});

export default Divider;
