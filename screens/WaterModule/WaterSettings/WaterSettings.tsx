import { View, Text, Pressable, Modal } from 'react-native'
import { MaterialCommunityIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';


import { styles } from './styles'
import WaterHeader from '../../../components/Water/WaterHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLITE from 'expo-sqlite'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';

const WaterSettings = ({ navigation }) => {
  const db = SQLITE.openDatabase('example.db');

  const [open, setOpen] = useState(false)

  const handleClearData = async () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT IN ('android_metadata', 'sqlite_sequence');`,
        [],
        (_, { rows }) => {
          // Step 2: Iterate over each table and drop it
          rows._array.forEach(({ name }) => {
            tx.executeSql(`DROP TABLE IF EXISTS ${name};`, [],
              () => {
                console.log(`Dropped table ${name}`);
              },
              (_, error) => {
                console.error(`Error dropping table ${name}:`, error);
                return true; // signal that an error occurred
              }
            );
          });
        },
        (_, error) => {
          console.error('Error retrieving table names:', error);
          return true; // signal that an error occurred
        }
      );
    });
    alert("Data Cleared")
    setOpen(false)
  }

  const handleLogout = async () => {
    await handleClearData();
    await AsyncStorage.removeItem('readerInfo')
    navigation.navigate("Login")
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <WaterHeader navigation={navigation} />
      {open &&
        <Modal transparent={true} onRequestClose={() => setOpen(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text>Are you sure you want to Clear All Data ?</Text>
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'space-around' }}>
                <Pressable style={{ ...styles.save, backgroundColor: 'white' }} onPress={() => {
                  setOpen(false)
                }}>
                  <Text style={{ textAlign: 'center' }}>No</Text>
                </Pressable>
                <Pressable style={styles.save} onPress={() => handleClearData()}>
                  <Text style={{ textAlign: 'center', color: 'white' }}>Yes</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      }
      <View style={styles.container}>
        <TouchableOpacity style={styles.options} onPress={() => navigation.navigate("Header Settings")}>
          <MaterialCommunityIcons name="printer" size={20} color="#00669B" />
          <Text style={styles.optionsText}>Headers Set-up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.options} onPress={() => navigation.navigate("Server Settings")}>
          <FontAwesome name="server" size={20} color="#00669B" />
          <Text style={styles.optionsText}>Server Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.options} onPress={() => setOpen(true)}>
          <MaterialCommunityIcons name="archive-remove" size={20} color="#00669B" />
          <Text style={styles.optionsText}>Clear Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.options} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#00669B" />
          <Text style={styles.optionsText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default WaterSettings