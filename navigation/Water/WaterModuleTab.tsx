import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import WaterSettings from "../../screens/WaterModule/WaterSettings/WaterSettings";
import WaterHomeStack from "./WaterHomeStack";
import WaterSettingsStack from "./WaterSettingsStack";

const Tab = createBottomTabNavigator();

const WaterModuleStack = () => {
  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: '#00669B', tabBarStyle: {
        height: 60
      }
    }}>
      <Tab.Screen name='Home' options={{
        headerShown: false,
        tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={25} color={color} />,
        tabBarHideOnKeyboard: true
      }} component={WaterHomeStack} />
      <Tab.Screen name='Settings' options={{
        headerShown: false,
        tabBarIcon: ({ color }) => <Ionicons name="settings-sharp" size={25} color={color} />,
        tabBarHideOnKeyboard: true
      }} component={WaterSettingsStack} />
    </Tab.Navigator>
  )
}

export default WaterModuleStack;