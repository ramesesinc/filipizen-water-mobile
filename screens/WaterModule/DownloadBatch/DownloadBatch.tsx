import { View, Text, Pressable, TextInput, ActivityIndicator, AppState } from 'react-native'

import { styles } from './styles'
import { useEffect, useRef, useState } from 'react'
import WaterHeader from '../../../components/Water/WaterHeader'
import * as Progress from 'react-native-progress'
import { useIsFocused, useNavigationState } from '@react-navigation/native';

import * as SQLITE from 'expo-sqlite'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserType } from '../Others/types'

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
  const fetchSize = 100
  const limit = fetchSize + 1

  const db = SQLITE.openDatabase('example.db');

  const exited = useRef(false)

  const currentBatch = useRef(null)
  const prevStart = useRef(null)

  const isFocused = useIsFocused()

  console.log("focs:", isFocused)

  useEffect(() => {
    const unsubscribe = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive' || isFocused === false) {
        // If app goes to background or inactive state, navigate away from the current component
        exited.current = true
        console.log("current", prevStart.current, currentBatch.current)
        if (prevStart.current !== null && currentBatch.current !== null) {
          db.transaction(tx => {
            tx.executeSql(
              `DELETE FROM ${currentBatch.current} WHERE pageNum >= ?`,
              [prevStart.current],
              (_, resultSet) => {
                console.log('Rows deleted successfully');
              },
              (_, error) => {
                console.error('Error deleting rows:', error);
                return false
              }
            );
          });
          db.transaction(tx => {
            tx.executeSql(
              `SELECT * FROM ${currentBatch.current}`, null,
              (txt, resultSet) => {
                console.log("total", resultSet.rows._array.length)
                const total = resultSet.rows._array.length
                if (total === 0) {
                  db.transaction(tx => {
                    tx.executeSql(`DROP TABLE ${currentBatch.current}`, null, (txObj, resultSet) => {
                      AsyncStorage.setItem(`${currentBatch.current}Start`, JSON.stringify(0));
                      console.log(`${currentBatch.current} now deleted`);
                    },
                    (_,e) => {
                      console.log("table not deleted", e)
                      return false
                    }
                    );
                  })
                }
              }
            )
          })
        }
        console.log(exited.current)
        navigation.navigate("Water Home"); // Replace "Water Home" with the name of the screen you want to navigate to
      }
    });

    return () => {
      console.log("closing")
      unsubscribe.remove(); // Unsubscribe from AppState changes when the component unmounts
    };
  }, []);


  const downloadBatch = async () => {
    // navigation.navigate("Downloading", {batch})
    // let start = 0;
    const batchTable = batch.replace(/-/g, '')
    currentBatch.current = batchTable

    const checkStartExists = async (key) => {
      try {
        const value = await AsyncStorage.getItem(key);
        // If the value is not null, the variable exists
        if (value !== null) {
          // console.log(`Variable ${key} exists with value:`, value);
          const toStart = Number(value) + 1
          return toStart;
        } else {
          return 0;
        }
      } catch (error) {
        console.error('Error checking variable existence:', error);
        return 0;
      }
    };

    let start: any = await checkStartExists(`${batchTable}Start`);
    prevStart.current = start
    try {
      console.log("start is:", start)

      const res = await fetch(`http://192.168.2.11:8040/osiris3/json/enterprise/WaterMobileReadingService.getBatchItems?batchid=${batch}&start=${start}&limit=${limit}`);
      // const res = await fetch(`http://192.168.2.88:8040/osiris3/json/enterprise/WaterMobileReadingService.getBatchItems?batchid=${batch}`);
      const dataRes = await res.json();

      if (dataRes.msg) {
        setError(dataRes.msg)
      } else {
        db.transaction(tx => {
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS ${batchTable} (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              batchid TEXT,
              acctno TEXT,
              prevreading INTEGER,
              reading INTEGER,
              volume INTEGER,
              rate INTEGER,
              acctname TEXT,
              capacity INTEGER,
              brand TEXT,
              meterno TEXT,
              billdate TEXT,
              duedate TEXT,
              discdate TEXT,
              amount INTEGER,
              classification TEXT,
              penalty INTEGER,
              discount INTEGER,
              acctgroup TEXT,
              pageNum INTEGER
            )
          `);
        }, (err) => {
          console.log(err)
        });
        const newData = await dataRes.map((e : any, i: any) => ({
          ...e,
          "pageNum": i + start
        }))

        const checkVariableExists = async (key) => {
          try {
            const value = await AsyncStorage.getItem(key);
            // If the value is not null, the variable exists
            if (value !== null) {
              // console.log(`Variable ${key} exists with value:`, value);
              return Number(value);
            } else {
              // console.log(`Variable ${key} does not exist`);
              AsyncStorage.setItem(batchTable, JSON.stringify(dataRes.length));
              return 0;
            }
          } catch (error) {
            console.error('Error checking variable existence:', error);
            return false;
          }
        };
  
        let lastRec = await checkVariableExists(batchTable);
        if (lastRec === limit || lastRec === 0) {
          let data;
  
          newData.length === limit ? data = newData.slice(0, newData.length - 1) : data = newData;
  
          setPreDownloading(false)
          setDownloading(true)
  
          let initCur = 0;
          let newNum = data.length;
  
          setFileNum(newNum)
  
          for (let i = 0; i < newNum; i++) {
            await new Promise((res) => setTimeout(res, 50))
            if (exited.current) {
              // db.transaction(tx => {
              //   tx.executeSql(
              //     `DELETE FROM ${batchTable} WHERE pageNum >= ?`,
              //     [start],
              //     (_, resultSet) => {
              //       console.log('Rows deleted successfully');
              //     },
              //     (_, error) => {
              //       console.error('Error deleting rows:', error);
              //       return false
              //     }
              //   );
              // });
              // db.transaction(tx => {
              //   tx.executeSql(
              //     `SELECT * FROM ${batchTable}`, null,
              //     (txt, resultSet) => {
              //       console.log("total",resultSet.rows._array.length)
              //       const total = resultSet.rows._array.length
              //       if (total === 0) {
              //         db.transaction(tx => {
              //           tx.executeSql(`DROP TABLE ${batchTable}`, null, (txObj, resultSet) => {
              //             AsyncStorage.setItem(`${batchTable}Start`, JSON.stringify(0));
              //             console.log(`${batchTable} now deleted`);
              //           });
              //         })
              //       }
              //     }
              //   )
              // })
              break;
            }
            db.transaction(tx => {
              tx.executeSql(`INSERT INTO ${batchTable} (batchid, acctno, prevreading, reading, volume, rate, acctname, capacity, brand, meterno, billdate, duedate, discdate, amount, classification, penalty, discount, acctgroup, pageNum) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [data[i].batchid, data[i].acctno, data[i].prevreading, data[i].reading, data[i].volume, data[i].rate, data[i].acctname, data[i].meter.capacity, data[i].meter.brand, data[i].meterid, data[i].billdate, data[i].duedate, data[i].discdate, data[i].amount, data[i].classificationid, data[i].penalty, data[i].discount, data[i].acctgroup, data[i].pageNum],
                () => {
                  initCur = initCur + 1
                  setCurr(initCur)
                  setPercent((initCur) / newNum);
                  console.log(`data ${i + 1} saved`)
                  if (i === newNum - 1 && exited.current !== true) {
                    AsyncStorage.setItem(`${batchTable}Start`, JSON.stringify(data[i].pageNum));
                    prevStart.current = data[i].pageNum;
                    console.log(`new start saved:`, data[i].pageNum)
                  }
                },
                (_, e) => {
                  console.log("not saved:", e)
                  return false
                }
              )
            })
          }
  
          console.log("done")
          AsyncStorage.setItem(batchTable, JSON.stringify(dataRes.length));
          setPercent(0)
          setPreDownloading(false)
          setDownloaded(true)
          setBatch('')
          setError('')
  
        } else {
          setError("All accounts already downloaded")
        }
      }


      // console.log(start)

    } catch (error) {
      console.log(error)
      setPreDownloading(false)
      setDownloading(false)
      setError(`Error: ${error}`)
    } finally {

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
          <ActivityIndicator style={{ flex: 1 }} size={100} color="#00669B" /> :
          <View style={styles.infoContainer}>
            <Text style={styles.menuText}>Download Batch</Text>
            <TextInput placeholder='Enter Batch Number' style={styles.textInput} value={batch} onChangeText={(inputText) => setBatch(inputText)} />
            <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
            <Pressable style={styles.downloadButton} onPress={downloadBatch}>
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