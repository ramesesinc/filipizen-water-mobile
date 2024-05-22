import { View, Text, Pressable, TouchableOpacity, Modal } from 'react-native'
import { useEffect, useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';


import { styles } from './styles'
import WaterHeader from '../../../components/Water/WaterHeader';

import * as SQLITE from 'expo-sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const db = SQLITE.openDatabase('example.db');

const ReadAndBill = ({ navigation }) => {
  const isFocused = useIsFocused()

  const [list, setList] = useState([])
  const [open, setOpen] = useState(false)
  const [bacthToDelete, setBatchToDelete] = useState("")

  useEffect(() => {
    if(isFocused) {
      db.transaction(tx => {
        tx.executeSql(`SELECT * FROM sqlite_master WHERE type='table'`, null!,
          (txObj, resultSet) => {
            setList(resultSet.rows._array.filter((item) => item.name !== ("android_metadata" && "sqlite_sequence")))
          }
        )
      })
    }
  }, [open, isFocused])

  const deleteBatch = (batchName) => {
    db.transaction(tx => {
      tx.executeSql(`DROP TABLE ${batchName}`, null, (txObj, resultSet) => {
        console.log(`${batchName} has been deleted`)
      });
      tx.executeSql(`SELECT * FROM sqlite_master WHERE type='table'`, null!,
        (txObj, resultSet) => {
          setList(resultSet.rows._array.filter((item) => item.name !== ("android_metadata" && "sqlite_sequence")))
        }
      )
    }, () => console.log("error delete batch"), () => {
      AsyncStorage.removeItem(`${batchName}Start`);
      AsyncStorage.removeItem(`${batchName}`);
    })
    setOpen(false)
  }

  const confirm = (name) => {
    setBatchToDelete(name)
    setOpen(true)
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <WaterHeader navigation={navigation} backBut='Water Home' />
      {
        list.length > 0 ?
          <View style={styles.withBatchContainer}>
            <Text style={styles.select}>Select a Batch to View</Text>
            {list.map((item, index) => {
              const newName = item.name.toUpperCase()

              return (
                <View key={index} style={styles.batchListitem}>
                  <AntDesign name="caretright" size={15} color="black" style={{ marginRight: 10 }} />
                  <Text style={{ fontSize: 20, flex: 3 }}>{newName.slice(0, 10)}</Text>
                  <View style={{ flexDirection: 'row', flex: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pressable style={{ ...styles.view, backgroundColor: 'white' }}
                      onPress={() => confirm(item.name)}
                    >
                      <Ionicons name="trash-outline" size={20} color='rgba(0, 0, 0, 0.5)' />
                    </Pressable>
                    <TouchableOpacity style={{ ...styles.view, backgroundColor: 'white' }}
                      onPress={() => {
                        navigation.navigate('Batch Info', { batchname: item.name })
                      }}
                    >
                      <FontAwesome6 name="magnifying-glass" size={20} color="#00669B" />

                    </TouchableOpacity>
                  </View>
                </View>
              )
            }
            )}
          </View> :
          <View style={styles.noBatchContainer}>
            <Text style={{ textAlign: 'center', fontSize: 25 }}>No Batches Downloaded</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Download Batch')} style={styles.goToDownload}>
              <Text style={{ color: 'white' }}>Download Batches</Text>
            </TouchableOpacity>
          </View>
      }
      <Pressable onPress={() => navigation.navigate('Water Home')} style={styles.backButton}>
        <Text style={{ color: 'black' }}>Back to Home</Text>
      </Pressable>
      {open &&
        <Modal transparent={true} onRequestClose={() => setOpen(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text>Are you sure you want to delete batch {bacthToDelete} ?</Text>
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'space-around' }}>
                <TouchableOpacity style={{...styles.save, backgroundColor: 'white'}} onPress={() => {
                  setBatchToDelete("")
                  setOpen(false)
                }}>
                  <Text style={{textAlign: 'center'}}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.save} onPress={() => deleteBatch(bacthToDelete)}>
                  <Text style={{textAlign: 'center', color: 'white'}}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      }
    </View>
  )

}

export default ReadAndBill

