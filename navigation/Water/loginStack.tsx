import { createStackNavigator } from "@react-navigation/stack";
import Terminal from "../../screens/Terminal Registration/Terminal";
import Login from "../../screens/login/login";
import loginServerSettings from "../../screens/login/loginServerSettings/loginServerSettings";

const Stack = createStackNavigator();

const LoginStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login Home">
        <Stack.Screen name="Login Home" component={Login} options={{headerShown: false}} />
        <Stack.Screen name="Login Server Settings" component={loginServerSettings} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default LoginStack