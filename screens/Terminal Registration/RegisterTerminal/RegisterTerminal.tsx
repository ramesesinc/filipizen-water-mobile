import { View, Text, TextInput, Pressable } from "react-native"
import WaterHeader from "../../../components/Water/WaterHeader"


const RegisterTerminal = ({ navigation }) => {

    return (
        <View style={{ flex: 1 }}>
            <WaterHeader navigation={navigation} backBut="Terminal Home" />
            <View style={{ flex: 1 }}>
                <View style={{ margin: 20 }}>
                    <View>
                        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>Terminal Registration</Text>
                        <Text style={{ fontSize: 18 }}>
                            Please fill in the information below. You may contact your system administrator for assistance
                        </Text>
                        <View style={{ marginVertical: 20, gap: 10 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 2, fontSize: 18, fontWeight: '700', alignSelf: 'flex-end' }}>Terminal Key</Text>
                                <TextInput style={{ flex: 3, borderBottomWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)' }} placeholder="key" />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 2, fontSize: 18, fontWeight: '700', alignSelf: 'flex-end' }}>Registered by</Text>
                                <TextInput style={{ flex: 3, borderBottomWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)' }} placeholder="name" />
                            </View>
                        </View>
                        <Pressable style={{ alignSelf: 'center', backgroundColor: "green", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginVertical: 20 }} onPress={() => console.log("Register Button Clicked")}>
                            <Text style={{ fontSize: 15, color: "white" }}>Register</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default RegisterTerminal