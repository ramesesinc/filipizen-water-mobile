import { View, Text, Pressable} from 'react-native'
import { useEffect, useState } from 'react'

import { styles } from './styles'
import WaterHeader from '../../../components/Water/WaterHeader';

import * as SQLITE from 'expo-sqlite'

const ReadAndBill = ({ navigation }) => {
  const [list, setList] = useState([])

  useEffect(() => {
    const db = SQLITE.openDatabase('example.db');
    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM sqlite_master WHERE type='table'`, null!,
        (txObj, resultSet) => {
          setList(resultSet.rows._array.filter((item) => item.name !== ("android_metadata" || "headertable")))
        }
      )
    })
    return () => {
      db.closeAsync()
      console.log("db closed")
    }
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <WaterHeader navigation={navigation} backBut='Water Home'/>
      {
        list.length > 0 ?
          <View style={styles.withBatchContainer}>
            <Text style={styles.select}>Select a Batch to View</Text>
            {list.map((item, index) => {
              const newName = `${item.name.slice(0, 2)}-${item.name.slice(2, 6)}-${item.name.slice(6)}`

              return (
                <View key={index} style={styles.batchListitem}>
                  <Text style={{ fontSize: 20 }}>{newName}</Text>
                  <Pressable style={styles.view}
                    onPress={() => navigation.navigate('Batch Info', { batchname: item.name })}
                  >
                    <Text style={{ color: 'white' }}>View</Text>
                  </Pressable>
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

