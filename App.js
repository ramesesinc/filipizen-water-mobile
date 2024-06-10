import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar, View } from "react-native";

import Login from "./screens/login/login";
import WaterModuleTab from "./navigation/Water/WaterModuleTab";

const Stack = createStackNavigator();

export default function App() {

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
          <Stack.Screen options={{
            headerShown: false,
            title: 'Water Module',
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#00669B'
            }
          }}
            name="Water"
            component={WaterModuleTab} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}