import { View, Text, Pressable, TextInput, ActivityIndicator} from 'react-native'

import { styles } from './styles'
import { useState } from 'react'
import WaterHeader from '../../../components/Water/WaterHeader'
import * as Progress from 'react-native-progress'

import * as SQLITE from 'expo-sqlite'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const DownloadBatch = ({ navigation }) => {
  const [batch, setBatch] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [predownloading, setPreDownloading] = useState(false)
  const [error, setError] = useState('');
  const [percent, setPercent] = useState(0);
  const [fileNum, setFileNum] = useState(0);
  const [curr, setCurr] = useState(0);
  const [downloaded, setDownloaded] = useState(false)

  // Math.floor(((initCur) / data.length) * 10) / 10
  const num = 2

  const download = async () => {
    const db = SQLITE.openDatabase('example.db');
    try {
        const storedString = await AsyncStorage.getItem('readerInfo');
        if (storedString !== null) {
          const readerObj = JSON.parse(storedString);
          const res = await fetch(`http://192.168.2.88:8040/osiris3/json/enterprise/WaterMobileReadingService.getBatchItems?batchid=${batch}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  env: {
                      CLIENTTYPE: "mobile",
                      USERID: readerObj.USERID,
                      SESSIONID: readerObj.env.SESSIONID
                  }
              })
          });
          const data = await res.json();

          if (data.status !== "ERROR") {
              const batchTable = batch.replace(/-/g, '')

              db.transaction(tx => {
                  tx.executeSql(`CREATE TABLE IF NOT EXISTS ${batchTable} (batchid TEXT, acctno TEXT, prevreading INTEGER, reading INTEGER, volume INTEGER, rate INTEGER, acctname TEXT, capacity INTEGER, brand TEXT, meterno TEXT, billdate TEXT, duedate TEXT, discdate TEXT, amount INTEGER, classification TEXT, penalty INTEGER, discount INTEGER)`);
              }, (err) => {
                  console.log(err)
              });

              db.transaction(tx => {
                  tx.executeSql(`SELECT * FROM ${batchTable}`, null,
                      (txObj, resultSet) => {
                          if (resultSet.rows._array.length !== data.length) {
                              setPreDownloading(false)
                              setDownloading(true)
                              // setFileNum(data.length)
                              db.transaction(tx => {
                                  let initCur = 0;
                                  let x = resultSet.rows._array.length;
                                  const newData = data.slice(x);
                                  let newNum = 0;

                                  if (newData.length > num) {
                                    newNum = num
                                  } else {
                                    newNum = newData.length
                                  }

                                  setFileNum(newNum)
                                  for (let i = 0; i < newNum; i++) {
                                      tx.executeSql(`INSERT INTO ${batchTable} (batchid, acctno, prevreading, reading, volume, rate, acctname, capacity, brand, meterno, billdate, duedate, discdate, amount, classification, penalty, discount) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                                          [newData[i].batchid, newData[i].acctno, newData[i].prevreading, newData[i].reading, newData[i].volume, newData[i].rate, newData[i].acctname, newData[i].meter.capacity, newData[i].meter.brand, newData[i].meterid, newData[i].billdate, newData[i].duedate, newData[i].discdate, newData[i].amount, newData[i].classification.name, newData[i].penalty, newData[i].discount],
                                          () => {
                                            setTimeout(() => {
                                              initCur = initCur + 1
                                              setCurr(initCur)
                                              setPercent((initCur) / newNum);
                                            }, 1500 * i)
                                          }
                                      )
                                  }

                                  // data.forEach((user, index) => {
                                  //     tx.executeSql(`INSERT INTO ${batchTable} (batchid, acctno, prevreading, reading, volume, rate, acctname, capacity, brand, meterno, billdate, duedate, discdate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                                  //         [user.batchid, user.acctno, user.prevreading, user.reading, user.volume, user.rate, user.acctname, user.meter.capacity, user.meter.brand, user.meterid, user.billdate, user.duedate, user.discdate],
                                  //         () => {
                                  //           setTimeout(() => {
                                  //             initCur = initCur + 1
                                  //             setCurr(initCur)
                                  //             setPercent((initCur) / data.length);
                                  //           }, 1500 * index)
                                              
                                  //         }
                                  //     )
                                  // })
                              }, (err) => {
                                  setPreDownloading(false)
                                  setDownloading(false);
                                  setError('Data not saved in device')
                                  console.log(err);
                              }, () => {
                                  setTimeout(() => {
                                    setPercent(0)
                                    setPreDownloading(false)
                                      setDownloaded(true)
                                      setBatch('')
                                      setError('')
                                  }, (1500 * data.length) - 1000)
                                  console.log(`${batch} has been downloaded`)
                                  db.closeAsync();
                              })
                          } else if (resultSet.rows.length > 0) {
                              setError('All of the accounts of this batch is already downloaded')
                          }
                      }
                  )
              })
          } else {
              setError('Input a valid Batch')
          }
      }
        
    } catch (error) {
        console.log(error)
        setPreDownloading(false)
        setDownloading(false)
        setError('Server is Offline')
    } 

}

const downloadAnotherBatch = () => {
  setDownloaded(false);
  setDownloading(false)
}

  if (downloading) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <WaterHeader navigation={navigation} />
        {
          !downloaded ?
            <View style={styles.container}>
              <View style={styles.infoContainer}>
                <Text style={{ ...styles.menuText, color: 'green' }}>Downloading ...</Text>
                <Text style={{ fontSize: 20, fontWeight: '400' }}>Batch: {batch}</Text>
                <Progress.Bar progress={percent} width={200} height={20} color='green' />
                <Text>Records Downloaded:  {curr} / {fileNum}</Text>
              </View>
            </View>
            :
            <View style={styles.container}>
              <View style={styles.infoContainer}>
                <Text style={{ ...styles.menuText, color: 'green' }}>Download Complete !!!</Text>
                <Text>{fileNum}/{fileNum} records downloaded.</Text>
              </View>
              <Pressable onPress={() => navigation.navigate('Water Home')} style={styles.goToHomeButton}>
                <Text style={{ color: 'white' }}>Go to Home</Text>
              </Pressable>
              <Pressable onPress={downloadAnotherBatch} style={styles.downloadedbackButton}>
                <Text style={{ color: 'black' }}>Download Another Batch</Text>
              </Pressable>
            </View>
        }

      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <WaterHeader navigation={navigation} backBut='Water Home' />
      <View style={styles.container}>
        {predownloading ?
        <ActivityIndicator style={{flex: 1}} size={100} color="#00669B" /> :
        <View style={styles.infoContainer}>
          <Text style={styles.menuText}>Download Batch</Text>
          <TextInput placeholder='Enter Batch Number' style={styles.textInput} value={batch} onChangeText={(inputText) => setBatch(inputText)} />
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
          <Pressable style={styles.downloadButton} onPress={download}>
            <Text style={{ color: 'white' }}>Download</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Water Home')} style={styles.backButton}>
            <Text style={{ color: 'black' }}>Back</Text>
          </Pressable>
        </View>
      }
  
      </View>
    </View>
  )
}

export default DownloadBatch

// const downloadBatch = async (batchTable) => {
//   try {
//     setDownloading(true)
//     const res = await fetch(`http://192.168.2.207:8040/osiris3/json/enterprise/WaterMobileReadingService.getBatchItems?batchid=${batch}`);
//     const data = await res.json();

//     setFileNum(data.length)
//     db.transaction(tx => {
//       let initCur = 0
//       data.forEach((user) => {
//         tx.executeSql(`INSERT INTO ${batchTable} (batchid, acctno, prevreading, reading, volume, rate, acctname, capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//           [user.batchid, user.acctno, user.prevreading, user.reading, user.volume, user.rate, user.acctname, user.meter.capacity],
//           () => {
//             initCur = initCur + 1
//             setCurr(initCur)
//             setPercent(Math.floor(((initCur) / data.length) * 10) / 10);
//           }
//         )
//       })
//     }, (err) => {
//       console.log(err);
//     }, () => {
//       setTimeout(() => {
//         setDownloaded(true)
//         setBatch('')
//         setError('')
//       }, 1000)
//       console.log(`${batch} has been downloaded`)
//     })


//   } catch (error) {
//     setDownloading(false)
//     console.error(error)
//   }
// }

// const download = async () => {
//   try {
//     const res = await fetch(`http://192.168.2.207:8040/osiris3/json/enterprise/WaterMobileReadingService.getBatchItems?batchid=${batch}`);
//     const data = await res.json();

//     console.log(data.status === "ERROR")

//     if (data.status !== "ERROR") {
//       const batchTable = batch.replace(/-/g, '')

//       db.transaction(tx => {
//         tx.executeSql(`CREATE TABLE IF NOT EXISTS ${batchTable} (batchid TEXT, acctno TEXT, prevreading INTEGER, reading INTEGER, volume INTEGER, rate INTEGER, acctname TEXT, capacity INTEGER)`);
//       }, (err) => {
//         console.log(err)
//       });

//       db.transaction(tx => {
//         tx.executeSql(`SELECT * FROM ${batchTable}`, null,
//           (txObj, resultSet) => {
//             if (resultSet.rows.length < 1) {
//               downloadBatch(batchTable)
//             } else if (resultSet.rows.length > 0) {
//               setError('Batch is already downloaded')
//             }
//           }
//         )
//       })
//     } else {
//       setError('Input a valid Batch')
//     }
//   } catch (error) {
//     console.log(error)
//     setError('Server is Offline')
//   }
  
// }