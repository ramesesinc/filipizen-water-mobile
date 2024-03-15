import { createStackNavigator } from "@react-navigation/stack";

import DownloadBatch from "../DownloadBatch/DownloadBatch";
import ReadAndBill from "../ReadAndBill/ReadAndBill";
import UserInfo from "../ReadAndBill/UserInfo/UserInfo";
import BatchInfo from "../ReadAndBill/BatchInfo/BatchInfo";


const Stack = createStackNavigator();

const ReandAndBIllStack = () => {

  return (
    <Stack.Navigator>
        <Stack.Screen name="Read And Bill" component={ReadAndBill} options={{headerShown: false}} />
        <Stack.Screen name="User Info" component={UserInfo} options={{headerShown: false}} />
        <Stack.Screen name="Batch Info" component={BatchInfo} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default ReandAndBIllStack