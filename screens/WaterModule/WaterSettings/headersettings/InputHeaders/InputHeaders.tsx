import { View, Text, TextInput, Button, Pressable, KeyboardAvoidingView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';


import WaterHeader from '../../../../../components/Water/WaterHeader';
import { styles } from '../styles';

import * as SQLITE from 'expo-sqlite'
import { useEffect, useState } from 'react';

const InputHeaders = ({ navigation }) => {
  const [input1, setInput1] = useState("")
  const [input2, setInput2] = useState("")
  const [input3, setInput3] = useState("")

  const hdb = SQLITE.openDatabase('headers.db');

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const storedString = await AsyncStorage.getItem('header');
        if (storedString !== null) {
          const storedObject = JSON.parse(storedString);
          setInput1(storedObject.header1)
          setInput2(storedObject.header2)
          setInput3(storedObject.header3)
        }
      } catch (error) {
        console.error('Error retrieving object:', error);
      }
    };
    
    retrieveData();
  }, [])

  const handleSave = async () => {
    try {
      const objectToStore = { header1: input1, header2: input2, header3: input3 }; // Example object
      await AsyncStorage.setItem('header', JSON.stringify(objectToStore));
      console.log('Object saved successfully!');
    } catch (error) {
      console.error('Error saving object:', error);
    }

    navigation.navigate("Header Settings")
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <WaterHeader navigation={navigation} backBut='Header Settings' />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior='height' keyboardVerticalOffset={0}>
        <View style={{ flex: 1 }}>
          <View style={{ height: 300, justifyContent: 'space-around' }}>
            <TextInput style={{ marginHorizontal: 30, padding: 10, borderBottomWidth: 1 }} onChangeText={(inputText) => setInput1(inputText)} value={input1} placeholder={input1 === "" ? "Input Header 1" : ""} maxLength={30}/>
            <TextInput style={{ marginHorizontal: 30, padding: 10, borderBottomWidth: 1 }} onChangeText={(inputText) => setInput2(inputText)} value={input2} placeholder={input2 === "" ? "Input Header 2" : ""} maxLength={30}/>
            <TextInput style={{ marginHorizontal: 30, padding: 10, borderBottomWidth: 1 }} onChangeText={(inputText) => setInput3(inputText)} value={input3} placeholder={input3 === "" ? "Input Header 3" : ""} maxLength={30}/>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Pressable style={{ padding: 10, borderWidth: 1, borderRadius: 10, backgroundColor: '#00669B' }} onPress={handleSave}>
              <Text style={{ color: 'white' }}>Save Headers</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default InputHeaders;