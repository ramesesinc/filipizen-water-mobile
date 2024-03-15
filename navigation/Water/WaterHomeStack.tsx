import { createStackNavigator } from "@react-navigation/stack";

import WaterHome from "../../screens/WaterModule/WaterHome/WaterHome";
import UploadBatch from "../../screens/WaterModule/UploadBatch/UploadBatch";
import DownloadBatch from "../../screens/WaterModule/DownloadBatch/DownloadBatch";
import ReandAndBIllStack from "../../screens/WaterModule/Navigations/ReandAndBIllStack";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";

const Stack = createStackNavigator();

const WaterHomeStack = ({navigation}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      navigation.replace("Water Home")
    }
  }, [isFocused]);

  return (
    <Stack.Navigator initialRouteName="Water Home">
        <Stack.Screen name="Water Home" component={WaterHome} options={{headerShown: false}} />
        <Stack.Screen name="Download Batch" component={DownloadBatch} options={{headerShown: false}} />
        <Stack.Screen name="Upload Batch" component={UploadBatch} options={{headerShown: false}} />
        <Stack.Screen name="Read & Bill" component={ReandAndBIllStack} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default WaterHomeStack