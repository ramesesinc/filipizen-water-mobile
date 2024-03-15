import { View, Text, Pressable } from "react-native"
import WaterHeader from "../../../components/Water/WaterHeader"
import { TextInput } from "react-native-gesture-handler"


const TerminalSettings = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <WaterHeader navigation={navigation} backBut="Terminal Home" />
            <View style={{ flex: 1 }}>
                <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                    <View>
                        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>Connection Setting</Text>
                        <Text style={{ fontSize: 18 }}>
                            The information below determines your device's connectivity to the server. Make Sure the entries are correct.
                        </Text>
                    </View>
                    <View style={{ marginVertical: 20, gap: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 2, fontSize: 18, fontWeight: '700', alignSelf: 'flex-end' }}>Ip address</Text>
                            <TextInput style={{ flex: 3, borderBottomWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)' }} placeholder="Ip address" />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 2, fontSize: 18, fontWeight: '700', alignSelf: 'flex-end' }}>Port Number</Text>
                            <TextInput style={{ flex: 3, borderBottomWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)' }} placeholder="port" />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 2, fontSize: 18, fontWeight: '700', alignSelf: 'flex-end' }}>Context</Text>
                            <TextInput style={{ flex: 3, borderBottomWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)' }} placeholder="context" />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 2, fontSize: 18, fontWeight: '700', alignSelf: 'flex-end' }}>Cluster</Text>
                            <TextInput style={{ flex: 3, borderBottomWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)' }} placeholder="cluster" />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 2, fontSize: 18, fontWeight: '700', alignSelf: 'flex-end' }}>Read Timeout</Text>
                            <TextInput style={{ flex: 3, borderBottomWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)' }} placeholder="timeout" />
                        </View>
                    </View>
                    <Pressable style={{ alignSelf: 'center', backgroundColor: "green", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginVertical: 20 }} onPress={() => console.log("Save Button Clicked")}>
                        <Text style={{ fontSize: 15, color: "white" }}>Save</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default TerminalSettings