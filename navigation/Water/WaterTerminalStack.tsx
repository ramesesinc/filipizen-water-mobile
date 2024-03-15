import { createStackNavigator } from "@react-navigation/stack";
import Terminal from "../../screens/Terminal Registration/Terminal";
import TerminalSettings from "../../screens/Terminal Registration/TerminalSettings/TerminalSettings";
import RegisterTerminal from "../../screens/Terminal Registration/RegisterTerminal/RegisterTerminal";
import RecoverTerminal from "../../screens/Terminal Registration/RecoverTerminal/RecoverTerminal";

const Stack = createStackNavigator();

const WaterTerminalStack = () => {
  return (
    <Stack.Navigator initialRouteName="Terminal Home">
        <Stack.Screen name="Terminal Home" component={Terminal} options={{headerShown: false}} />
        <Stack.Screen name="Terminal Settings" component={TerminalSettings} options={{headerShown: false}} />
        <Stack.Screen name="Terminal Register" component={RegisterTerminal} options={{headerShown: false}} />
        <Stack.Screen name="Terminal Recover" component={RecoverTerminal} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default WaterTerminalStack