import { View, Text, Pressable } from 'react-native'
import { useEffect, useState } from 'react'

import { styles } from './styles'
import WaterHeader from '../../../components/Water/WaterHeader';

import * as SQLITE from 'expo-sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = SQLITE.openDatabase('example.db');

const ReadAndBill = ({ navigation }) => {
  const [list, setList] = useState([])

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM sqlite_master WHERE type='table'`, null!,
        (txObj, resultSet) => {
          setList(resultSet.rows._array.filter((item) => item.name !== ("android_metadata" && "sqlite_sequence")))
        }
      )
    })
  }, [])

  const deleteBatch = (batchName) => {
    db.transaction(tx => {
      tx.executeSql(`DROP TABLE ${batchName}`, null,  (txObj, resultSet) => {
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
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <WaterHeader navigation={navigation} backBut='Water Home' />
      {
        list.length > 0 ?
          <View style={styles.withBatchContainer}>
            <Text style={styles.select}>Select a Batch to View</Text>
            {list.map((item, index) => {
              const newName = `${item.name.slice(0, 2)}-${item.name.slice(2, 6)}-${item.name.slice(6)}`

              return (
                <View key={index} style={styles.batchListitem}>
                  <Text style={{ fontSize: 20, flex: 3 }}>{item.name.slice(0, 12)}</Text>
                  <View style={{ flexDirection: 'row', flex: 2, gap: 10, justifyContent: 'space-between'}}>
                    <Pressable style={{...styles.view, backgroundColor: 'white', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)'}}
                      onPress={() => deleteBatch(item.name)}
                    >
                      <Text style={{ color: 'black' }}>Delete</Text>
                    </Pressable>
                    <Pressable style={styles.view}
                      onPress={() => navigation.navigate('Batch Info', { batchname: item.name })}
                    >
                      <Text style={{ color: 'white' }}>View</Text>
                    </Pressable>
                  </View>
                </View>
              )
            }
            )}
          </View> :
          <View style={styles.noBatchContainer}>
            <Text style={{ textAlign: 'center', fontSize: 25 }}>No Batches Downloaded</Text>
            <Pressable onPress={() => navigation.navigate('Download Batch')} style={styles.goToDownload}>
              <Text style={{ color: 'white' }}>Download Batches</Text>
            </Pressable>
          </View>
      }
      <Pressable onPress={() => navigation.navigate('Water Home')} style={styles.backButton}>
        <Text style={{ color: 'black' }}>Back to Home</Text>
      </Pressable>
    </View>
  )

}

export default ReadAndBill

