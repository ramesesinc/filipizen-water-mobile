import { View, Text, Pressable } from "react-native"
import { RadioButton } from 'react-native-paper';
import { useEffect, useState } from "react";

import WaterHeader from "../../components/Water/WaterHeader"

const Terminal = ({ navigation }) => {
    const [checked, setChecked] = useState('Terminal Register')

    useEffect(() => {
        console.log(checked)
    }, [checked])

    const handlePress = () => {
        navigation.navigate(checked)
    }

    return (
        <View style={{ flex: 1 }}>
            <WaterHeader navigation={navigation} option="Terminal Settings" />
            <View style={{ flex: 1 }}>
                <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                    <Text style={{ fontSize: 18 }}>
                        This device is not yet registered. Terminal Registration is required for performing secured transactions. Please choose a type of action.
                    </Text>
                    <View style={{ padding: 20, marginVertical: 20 }}>
                        <RadioButton.Group onValueChange={newValue => setChecked(newValue)} value={checked}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton value="Terminal Register" color="#00669B" />
                                <Text style={{ fontSize: 20 }}>Register New Terminal</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton value="Terminal Recover" color="#00669B" />
                                <Text style={{ fontSize: 20 }}>Recover Existing Terminal</Text>
                            </View>
                        </RadioButton.Group>
                    </View>
                    <Pressable style={{ alignSelf: 'center', backgroundColor: "#00669B", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }} onPress={handlePress}>
                        <Text style={{ fontSize: 15, color: "white" }}>Select</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default Terminal