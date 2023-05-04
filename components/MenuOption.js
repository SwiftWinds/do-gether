import { Entypo, SimpleLineIcons, EvilIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { MenuOption } from "react-native-popup-menu";

const CustomMenuOption = ({ text, icon, iconName, onSelect }) => (
  <MenuOption
    onSelect={onSelect}
    customStyles={{
      optionWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
    }}
  >
    <Text>{text}</Text>
    {icon ? icon : <Entypo name={iconName} size={24} color="black" />}
  </MenuOption>
);

export default CustomMenuOption;
