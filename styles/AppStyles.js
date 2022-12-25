import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  backgroundCover: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    opacity: 0.6,
    padding: 16,
  },
  lightText: {
    color: "#fff",
  },
  errorText: {
    color: "#f00",
  },
  header: {
    fontSize: 20,
  },
  textInput: {
    alignSelf: "stretch",
    padding: 8,
    borderBottomWidth: 2,
    marginVertical: 8,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  lightTextInput: {
    borderBottomColor: "#fff",
  },
  inlineBtn: {
    color: "#428282",
  },
  pressedInlineBtn: {
    opacity: 0.6,
  },
  btn: {
    backgroundColor: "#419488",
    borderRadius: 3,
    padding: 9,
    marginVertical: 9,
  },
  loginBtnText: {
    textTransform: "uppercase",
  },
});
