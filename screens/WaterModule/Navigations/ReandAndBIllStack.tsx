import { createStackNavigator } from "@react-navigation/stack";

import ReadAndBill from "../ReadAndBill/ReadAndBill";
import UserInfo from "../ReadAndBill/UserInfo/UserInfo";
import BatchInfo from "../ReadAndBill/BatchInfo/BatchInfo";
import Map from "../ReadAndBill/Map/Map";


const Stack = createStackNavigator();

const ReandAndBIllStack = () => {

  return (
    <Stack.Navigator>
        <Stack.Screen name="Read And Bill" component={ReadAndBill} options={{headerShown: false}} />
        <Stack.Screen name="User Info" component={UserInfo} options={{headerShown: false}} />
        <Stack.Screen name="Batch Info" component={BatchInfo} options={{headerShown: false}} />
        <Stack.Screen name="Map" component={Map} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default ReandAndBIllStack