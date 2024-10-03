import { View, Text, Image, TextInput, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native'
import { styles } from './styles'
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import { useIsFocused } from '@react-navigation/native';

const etracslogo = require('../../assets/etracsLogo.png')

// 557a4295dcca1a044b690f8b6486f33d

export default function Login({ navigation }) {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true)

    const [etracsIP, setEtracsIP] = useState("")
    const [etracsPort, setEtracsPort] = useState("")

    const handleUserChange = (inputText) => {
        setUserName(inputText)
    }
    const handlePasswordChange = (inputText) => {
        setPassword(inputText)
    }

    const isFocused = useIsFocused()

    useEffect(() => {
        const getReaderInfo = async () => {
            const readerInfo = await AsyncStorage.getItem('readerInfo');
            if (readerInfo) {
                navigation.navigate("Water")
            }
            setLoading(false)
        }

        getReaderInfo();
    }, [])

    useEffect(() => {
        const getServerAdd = async () => {
            try {
                const serverObjectString = await AsyncStorage.getItem('serverObject');
                const serverObjectJSON = await JSON.parse(serverObjectString);
 
                if (serverObjectJSON) {
                    setEtracsIP(serverObjectJSON.etracs.ip)
                    setEtracsPort(serverObjectJSON.etracs.port)
                } else {
                    setEtracsIP("localhost")
                    setEtracsPort("8070")
                }

            } catch (e) {
                alert(e)
            }
        }
        if (isFocused) {
            getServerAdd();
        }
    }, [isFocused])

    function generateHmacMD5(seed: string, v: string) {
        const hmac = CryptoJS.HmacMD5(v, seed);
        return hmac.toString();
    }

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please provide both username and password');
            return;
        }

        setLoading(true);

        const lowercasedUsername = username.toLowerCase().toString()
        const hash = await generateHmacMD5(lowercasedUsername, password);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort()
        }, 30000);

        try {
            const res = await fetch(`http://${etracsIP}:${etracsPort}/osiris3/json/etracs25/LoginService.login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    env: {
                        CLIENTTYPE: 'mobile',
                    },
                    args: {
                        username: username,
                        password: hash,
                    },
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();

            console.log("data",data)

            if (data.status === 'ERROR') {
                setError('Incorrect username or password');
            } else {
                delete data.env.ROLES;
                await AsyncStorage.setItem('readerInfo', JSON.stringify(data));
                setError('');
                setUserName('');
                setPassword('');
                navigation.navigate('Water');
            }
        } catch (error) {
            setError(`${error}`);
            console.error('Error during login:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleServerSettings = () => {
        navigation.navigate("Login Server Settings")
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator style={{ flex: 1 }} size={50} color="#00669B" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, alignSelf: 'flex-end', justifyContent: 'center', marginRight: 20 }}>
                <TouchableOpacity onPress={handleServerSettings}>
                    <Ionicons name="settings-sharp" size={25} color={'#00669B'} />
                </TouchableOpacity>
            </View>
            <View style={{
                flex: 9,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Image
                    source={etracslogo}
                    style={styles.etracsLogo}
                />
                {error !== "" ? <Text style={styles.errorMsg}>{error}</Text> : null}
                <View style={styles.credentials}>
                    <AntDesign name="mail" size={17} color="grey" />
                    <TextInput placeholder='Username' value={username} onChangeText={handleUserChange} style={{ flex: 1 }} />
                </View>
                <View style={styles.credentials}>
                    <Feather name="lock" size={17} color="grey" />
                    <TextInput placeholder='Password' secureTextEntry={true} value={password} onChangeText={handlePasswordChange} style={{ flex: 1 }} />
                </View>
                <Pressable style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginText}>Login</Text>
                </Pressable>
                <Text></Text>
            </View>

        </View>
    )
}