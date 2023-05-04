import { MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { StyleSheet } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";

import Divider from "./Divider";
import MenuOption from "./MenuOption";

const { Popover } = renderers;

const MyPopover = () => {
  const menuRef = useRef();
  return (
    <Menu
      renderer={Popover}
      rendererProps={{ preferredPlacement: "bottom" }}
      ref={menuRef}
    >
      <MenuTrigger style={styles.menuTrigger}>
        <Feather.Button
          style={{ backgroundColor: "#a4876d" }}
          color="black"
          onPress={() => menuRef.current.open()}
          name="plus-circle"
        >
          Add task
        </Feather.Button>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderRadius: 10,
            width: 100,
          },
        }}
      >
        <MenuOption
          onSelect={() => alert(`You clicked Delete`)}
          text="Auto"
          value="Block"
          icon={<MaterialIcons name="auto-awesome" size={24} color="black" />}
        />
        <Divider />
        <MenuOption
          onSelect={() => alert(`You clicked Uncheck`)}
          text="Manual"
          value="Mute"
          icon={<FontAwesome5 name="wrench" size={24} color="black" />}
        />
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
  },
  menuOptions: {
    padding: 50,
  },
  menuTrigger: {
    padding: 5,
  },
  triggerText: {
    fontSize: 20,
  },
  contentText: {
    fontSize: 18,
  },
});

export default MyPopover;
