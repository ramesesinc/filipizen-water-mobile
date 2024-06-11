import { View, Text, TextInput, Button, Pressable, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import * as Clipboard from 'expo-clipboard';

import WaterHeader from '../../../../components/Water/WaterHeader';
import { styles } from './styles';

import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';

const ServerSettings = ({ navigation }) => {
    const [etracsIP, setEtracsIP] = useState("")
    const [etracsPort, setEtracsPort] = useState("")
    const [waterIP, setWaterIP] = useState("")
    const [waterPort, setWaterPort] = useState("")

    useEffect(() => {
        const getServerAdd = async () => {
            try {
                const serverObjectString = await AsyncStorage.getItem('serverObject');
                const serverObjectJSON = await JSON.parse(serverObjectString);

                if (serverObjectJSON) {
                    setEtracsIP(serverObjectJSON.etracs.ip)
                    setEtracsPort(serverObjectJSON.etracs.port)
                    setWaterIP(serverObjectJSON.water.ip)
                    setWaterPort(serverObjectJSON.water.port)
                }

            } catch (e) {
                alert(e)
            }
        }
        getServerAdd();
    }, [])

    const handeSaveAddresses = async () => {

        const serverObject = {
            etracs: {
                ip: etracsIP,
                port: etracsPort
            },
            water: {
                ip: waterIP,
                port: waterPort
            }
        }

        await AsyncStorage.setItem('serverObject', JSON.stringify(serverObject));
        console.log(serverObject)
        alert("Server Settings Saved")
        navigation.navigate("Settings Home")
    }


    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='height' keyboardVerticalOffset={0}>
            <View style={styles.container}>
                <WaterHeader navigation={navigation} backBut='Settings Home' />
                <View style={{ flex: 1, marginTop: 20 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ justifyContent: 'space-around', marginHorizontal: 45, gap: 20, height: 200, marginTop: 20 }}>
                            <Text style={{ textAlign: 'center' }}>Server Settings</Text>
                            <Text style={{ marginTop: 20, marginBottom: 10 }}>* ETRACS</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1, alignItems: 'center', marginVertical: 10 }}>
                                <Text style={{ flex: 3 }}>IP</Text>
                                <Text style={{ flex: 1 }}>:</Text>
                                <TextInput style={{ flex: 9 }} placeholder='ex: http://192.168.2.11' onChangeText={(inputText) => setEtracsIP(inputText)} value={etracsIP} />
                                {
                                    etracsIP !== "" &&
                                    <TouchableOpacity style={{marginLeft: 5}} onPress={ async () => {
                                        await Clipboard.setStringAsync(etracsIP)
                                        alert("Copied to Clipboard")
                                        }}>
                                        <FontAwesome5 name="copy" size={15} color="black" />
                                    </TouchableOpacity>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1, alignItems: 'center', marginVertical: 10 }}>
                                <Text style={{ flex: 3 }}>Port</Text>
                                <Text style={{ flex: 1 }}>:</Text>
                                <TextInput style={{ flex: 9 }} maxLength={4} keyboardType='numeric' placeholder='ex: 8040' onChangeText={(inputText) => setEtracsPort(inputText)} value={etracsPort} />
                            </View>
                            <Text style={{ marginTop: 20, marginBottom: 10 }}>* WATER</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1, alignItems: 'center', marginVertical: 10 }}>
                                <Text style={{ flex: 3 }}>IP</Text>
                                <Text style={{ flex: 1 }}>:</Text>
                                <TextInput style={{ flex: 9 }} placeholder='ex: http://192.168.2.11' onChangeText={(inputText) => setWaterIP(inputText)} value={waterIP} />
                                {
                                    waterIP !== "" &&
                                    <TouchableOpacity style={{marginLeft: 5}} onPress={ async () => {
                                        await Clipboard.setStringAsync(waterIP)
                                        alert("Copied to Clipboard")
                                        }}>
                                        <FontAwesome5 name="copy" size={15} color="black" />
                                    </TouchableOpacity>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1, alignItems: 'center', marginVertical: 10 }}>
                                <Text style={{ flex: 3 }}>Port</Text>
                                <Text style={{ flex: 1 }}>:</Text>
                                <TextInput style={{ flex: 9 }} maxLength={4} keyboardType='numeric' placeholder='ex: 8040' onChangeText={(inputText) => setWaterPort(inputText)} value={waterPort} />
                            </View>
                        </View>
                        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <Pressable style={{ padding: 10, borderWidth: 1, borderRadius: 10, backgroundColor: '#00669B' }} onPress={handeSaveAddresses}>
                                <Text style={{ color: 'white' }}>Save Addresses</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default ServerSettings;