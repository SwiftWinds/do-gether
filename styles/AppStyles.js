import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  imageContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  background: {
    backgroundColor: "#FFF3EE",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    marginHorizontal: 16,
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
    fontFamily: "Gaegu",
    color: "#fff",
  },
  darkText: {
    color: "#815226",
  },
  errorText: {
    color: "#f00",
  },
  header: {
    fontSize: 20,
    alighSelf: "center",
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
  darkTextInput: {
    borderBottomColor: "#cdcdcd",
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
    color: "#FFF3EE",
    fontFamily: "Gaegu",
    fontSize: 35,
  },
});
