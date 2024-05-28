import { createStackNavigator } from "@react-navigation/stack";

import WaterSettings from "../../screens/WaterModule/WaterSettings/WaterSettings";
import HeaderSettings from "../../screens/WaterModule/WaterSettings/headersettings/headersettings";
import InputHeaders from "../../screens/WaterModule/WaterSettings/headersettings/InputHeaders/InputHeaders";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import Formula from "../../screens/WaterModule/WaterSettings/formulasettings/formulasettings";
import ServerSettings from "../../screens/WaterModule/WaterSettings/Server Settings/ServerSettings";

const Stack = createStackNavigator();

const WaterSettingsStack = ({navigation}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      navigation.replace("Settings Home");
    }
  }, [isFocused]);

  return (
    <Stack.Navigator initialRouteName="Settings Home">
        <Stack.Screen name="Settings Home" component={WaterSettings} options={{headerShown: false}} />
        <Stack.Screen name="Header Settings" component={HeaderSettings} options={{headerShown: false}} />
        <Stack.Screen name="Input Headers" component={InputHeaders} options={{headerShown: false}} />
        <Stack.Screen name="Server Settings" component={ServerSettings} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default WaterSettingsStack