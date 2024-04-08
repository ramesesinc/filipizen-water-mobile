import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { ParamListBase, RouteProp, getFocusedRouteNameFromRoute } from "@react-navigation/native";

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
      <Tab.Screen name='Home' options={({route}) => (getRouteName(route))} component={WaterHomeStack} />
      <Tab.Screen name='Settings' options={{
        headerShown: false,
        tabBarIcon: ({ color }) => <Ionicons name="settings-sharp" size={25} color={color} />,
        tabBarHideOnKeyboard: true
      }} component={WaterSettingsStack} />
    </Tab.Navigator>
  )
}


const getRouteName = (route: RouteProp<ParamListBase, "Home">): BottomTabNavigationOptions => {
  const routeName = getFocusedRouteNameFromRoute(route)
  console.log("Current Route:", routeName)

  if (routeName?.includes("Download Batch")) {
    return {
      tabBarStyle: {
        display: "none"
      },
      headerShown: false,
      tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={25} color={color} />,
      tabBarHideOnKeyboard: true
    }
  } else {
    return {
      tabBarStyle: {
        display: "flex"
      },
      headerShown: false,
      tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={25} color={color} />,
      tabBarHideOnKeyboard: true
    }
  }
}


export default WaterModuleStack;