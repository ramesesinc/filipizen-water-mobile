import { View, Text, TextInput, Button, Pressable } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import WaterHeader from '../../../../components/Water/WaterHeader';
import { styles } from './styles';

import * as SQLITE from 'expo-sqlite'
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

const HeaderSettings = ({ navigation }) => {
    const [headers, setHeaders] = useState({
        header1: "",
        header2: "",
        header3: ""
    })

    const isFocused = useIsFocused()
    useEffect(() => {

        const retrieveData = async () => {
            try {
              const storedString = await AsyncStorage.getItem('header');
              if (storedString !== null) {
                const storedObject = JSON.parse(storedString);
                setHeaders(storedObject);
                console.log(storedObject)
              }
            } catch (error) {
              console.error('Error retrieving object:', error);
            }
          };

        retrieveData();
        
    }, [isFocused])

    return (
        <View style={styles.container}>
            <WaterHeader navigation={navigation} backBut='Settings Home' />
            <View style={{ flex: 1 }}>
                <View style={styles.titleBox}>
                    <Text style={styles.titleText}>Printout Headers</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'space-around' }}>
                    <View style={styles.header}>
                        <Text style={{ flex: 1 }}>Header 1:</Text>
                        <Text style={{ flex: 3, textAlign: 'center' }}>{headers.header1 === "" ? "none" : headers.header1}</Text>
                    </View>
                    <View style={styles.header}>
                        <Text style={{ flex: 1 }}>Header 2:</Text>
                        <Text style={{ flex: 3, textAlign: 'center' }}>{headers.header2 === "" ? "none" : headers.header2}</Text>
                    </View>
                    <View style={styles.header}>
                        <Text style={{ flex: 1 }}>Header 3:</Text>
                        <Text style={{ flex: 3, textAlign: 'center' }}>{headers.header3 === "" ? "none" : headers.header3}</Text>
                    </View>



                </View>
                <View style={styles.editContainer}>
                    <Pressable style={styles.editBox} onPress={() => navigation.navigate("Input Headers")}>
                        <Text>Edit Headers</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default HeaderSettings