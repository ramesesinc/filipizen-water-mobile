import { View, Text, TextInput, Button, Pressable, KeyboardAvoidingView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import WaterHeader from '../../../../components/Water/WaterHeader';
import { styles } from './styles';

import { useIsFocused } from '@react-navigation/native';
import { useState } from 'react';

const ServerSettings = ({ navigation }) => {
    const [downloadApi, setDownloadApi] = useState("")
    const [uploadApi, setUploadApi] = useState("")
    const [formulaApi, setFormulaApi] = useState("")

    const isFocused = useIsFocused()

    const handeSaveAddresses = () => {

    }


    return (
        <View style={styles.container}>
            <WaterHeader navigation={navigation} backBut='Settings Home' />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='height' keyboardVerticalOffset={0}>
                <View style={{ flex: 1 }}>
                    <Text style={{ padding: 10, margin: 10, textAlign: 'center', fontSize: 20, flex: 1 }}>Change Server Address</Text>
                    <View style={{ flex: 4}}>
                        <View style={{ justifyContent: 'space-around', marginHorizontal: 15, gap: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1 }}>
                                <Text style={{ flex: 3 }}>Download</Text>
                                <Text style={{ flex: 1 }}>:</Text>
                                <TextInput style={{ flex: 9 }} onChangeText={(inputText) => setDownloadApi(inputText)} value={downloadApi} />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1 }}>
                                <Text style={{ flex: 3 }}>Upload</Text>
                                <Text style={{ flex: 1 }}>:</Text>
                                <TextInput style={{ flex: 9 }} onChangeText={(inputText) => setUploadApi(inputText)} value={uploadApi} />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1 }}>
                                <Text style={{ flex: 3 }}>Formula</Text>
                                <Text style={{ flex: 1 }}>:</Text>
                                <TextInput style={{ flex: 9 }} onChangeText={(inputText) => setFormulaApi(inputText)} value={formulaApi} />
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <Pressable style={{ padding: 10, borderWidth: 1, borderRadius: 10, backgroundColor: '#00669B' }} onPress={handeSaveAddresses}>
                                <Text style={{ color: 'white' }}>Save Addresses</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                </KeyboardAvoidingView>
        </View>
    )
}

export default ServerSettings;