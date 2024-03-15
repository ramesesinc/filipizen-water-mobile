import { View, Text, Image, TextInput, Pressable, ActivityIndicator } from 'react-native'
import { styles } from './styles'
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

const etracslogo = require('../../assets/entracslogo.png')

// 557a4295dcca1a044b690f8b6486f33d

export default function Login({ navigation }) {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)

    const handleUserChange = (inputText) => {
        setUserName(inputText)
    }
    const handlePasswordChange = (inputText) => {
        setPassword(inputText)
    }

    // const handleLogin = () => {
    //     navigation.navigate('Water')
    //     setUserName('');
    //     setPassword('');
    // }

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

        const hash = await generateHmacMD5(username, password);

        try {
            const res = await fetch('http://192.168.2.11:8070/osiris3/json/etracs25/LoginService.login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    env: {
                        CLIENTTYPE: 'mobile',
                    },
                    args: {
                        username,
                        password: hash,
                    },
                }),
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();

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
            setError('An error occurred. Please try again later.');
            console.error('Error during login:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator style={{ flex: 1 }} size={50} color="#00669B" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
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
    )
}