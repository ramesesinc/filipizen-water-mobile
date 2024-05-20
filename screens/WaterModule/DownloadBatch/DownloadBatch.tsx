import { View, Text, Pressable, TextInput, ActivityIndicator, AppState, TouchableOpacity } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


import { styles } from './styles'
import { useEffect, useRef, useState } from 'react'
import WaterHeader from '../../../components/Water/WaterHeader'
import * as Progress from 'react-native-progress'

import * as SQLITE from 'expo-sqlite'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserType } from '../Others/types'
import { SelectList } from 'react-native-dropdown-select-list'

const DownloadBatch = ({ navigation }) => {
  const [batch, setBatch] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [predownloading, setPreDownloading] = useState(false)
  const [error, setError] = useState('');
  const [percent, setPercent] = useState(0);
  const [fileNum, setFileNum] = useState(0);
  const [curr, setCurr] = useState(0);
  const [downloaded, setDownloaded] = useState(false)
  const [selected, setSelected] = useState<any>()
  const [prevFetchNum, setPrevFetchNum] = useState(0)

  const [formula, setFormula] = useState(null);

  const db = SQLITE.openDatabase('example.db');

  const exited = useRef(false)

  const currentBatch = useRef(null)
  const prevStart = useRef(null)
  const batchDownloading = useRef(null)

  useEffect(() => {
    exited.current = false
    const unsubscribe = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        exited.current = true
        console.log("current", prevStart.current, currentBatch.current)
        if (prevStart.current !== null && currentBatch.current !== null && batchDownloading.current === true) {
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

            tx.executeSql(
              `SELECT * FROM ${currentBatch.current}`, null,
              async (txt, resultSet) => {
                console.log("total", resultSet.rows._array.length)
                const total = resultSet.rows._array.length
                if (total === 0) {
                  await AsyncStorage.removeItem(`${batch.replace(/-/g, '')}Start`);
                  await AsyncStorage.removeItem(`${batch.replace(/-/g, '')}`);
                  db.transaction(tx => {
                    tx.executeSql(`DROP TABLE ${currentBatch.current}`, null, (txObj, resultSet) => {
                      // AsyncStorage.setItem(`${currentBatch.current}Start`, JSON.stringify(0));
                      console.log(`${currentBatch.current} now deleted in eventlistener`);
                    },
                      (_, e) => {
                        console.log("table not deleted", e)
                        return false
                      }
                    );
                  })
                }
              }
            )
          });

          // await AsyncStorage.removeItem(`${currentBatch.current.replace(/-/g, '')}Start`);
          // await AsyncStorage.removeItem(`${currentBatch.current.replace(/-/g, '')}`);
          // AsyncStorage.removeItem(`${currentBatch.current.replace(/-/g, '')}Start`);
          // AsyncStorage.removeItem(`${currentBatch.current.replace(/-/g, '')}`);
          console.log(exited.current)
          console.log(currentBatch.current)
          navigation.navigate("Water Home");
          batchDownloading.current = false
        }
      }
    });

    const getPrevFetchSize = async () => {
      const prevFetch = await AsyncStorage.getItem("prevFetchSize");
      if (prevFetch) {
        setPrevFetchNum(Number(prevFetch))
      } else {
        setPrevFetchNum(20)
      }
    }

    getPrevFetchSize();

    const retrieveFormula = async () => {
      try {
        const formulaString = await AsyncStorage.getItem('formula');
        if (formulaString) {
          setFormula(formulaString)
        }
      } catch (error) {
        alert(error)
      }
    };


    retrieveFormula();

    return () => {
      console.log("closing");
      unsubscribe.remove();
      exited.current = true;
    };
  }, [downloaded, batchDownloading]);


  const downloadBatch = async () => {

    const batchTable = batch.replace(/-/g, '')
    currentBatch.current = batchTable

    // let booleanValueToSave;

    const getdata = async () => {
      try {
        batchDownloading.current = true
        setPreDownloading(true)
        console.log("getData function run")

        const checkStartExists = async (key: string) => {
          try {
            const value = await AsyncStorage.getItem(key);
            // If the value is not null, the variable exists
            if (value !== null && value !== "0") {
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

        const start: number = await checkStartExists(`${batchTable}Start`);
        prevStart.current = await start
        const readerInfo = await AsyncStorage.getItem('readerInfo');
        const storedObject = await JSON.parse(readerInfo);

        console.log(`start is : ${start}, limit is : ${selected + 1}`)

        const res = await fetch(`http://192.168.2.11:8040/osiris3/json/enterprise/WaterMobileReadingService.getBatchItems`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            env: {
              CLIENTTYPE: 'mobile',
              USERID: storedObject.USERID
            },
            args: {
              batchid: batch,
              start,
              limit: selected + 1
            },
          }),
        });
        // const res = await fetch(`http://192.168.2.88:8040/osiris3/json/enterprise/WaterMobileReadingService.getBatchItems?batchid=${batch}`);
        const dataRes = await res.json();

        if (dataRes.msg) {
          setError(dataRes.msg)
          setPreDownloading(false)
          await AsyncStorage.removeItem(`${batchTable}Start`);
          await AsyncStorage.removeItem(`${batchTable}`);
          setPreDownloading(false)
          batchDownloading.current = false;
        } else if (dataRes.length !== 0) {
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
                fromdate TEXT,
                todate TEXT,
                location TEXT,
                reader TEXT,
                balance INTEGER,
                pageNum INTEGER,
                note TEXT
              )
            `);
          }, (err) => {
            console.log(err)
          });
          const newData = await dataRes.map((e: any, i: any) => ({
            ...e,
            "pageNum": i + start,
            "note": "",
          }))

          // if (lastRec == limit || lastRec === 0) {
          let data;

          newData.length === selected + 1 ? data = await newData.slice(0, newData.length - 1) : data = await newData;

          setPreDownloading(false)
          setDownloading(true)

          let initCur = 0;
          let newNum = data.length;

          for (let i = 0; i < newNum; i++) {
            await new Promise((res) => setTimeout(res, 50))
            if (exited.current) {
              console.log("break")
              if (prevStart.current !== null && currentBatch.current !== null && batchDownloading.current === true) {
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
                          tx.executeSql(`DROP TABLE ${currentBatch.current}`, null, async (txObj, resultSet) => {
                            await AsyncStorage.removeItem(`${batch.replace(/-/g, '')}Start`);
                            await AsyncStorage.removeItem(`${batch.replace(/-/g, '')}`);
                            // AsyncStorage.setItem(`${currentBatch.current}Start`, JSON.stringify(0));
                            console.log(`${currentBatch.current} now deleted`);
                          },
                            (_, e) => {
                              console.log("table not deleted", e)
                              return false
                            }
                          );
                        })
                      }
                    }
                  )
                })
                console.log(exited.current)
                navigation.navigate("Water Home");
              }
              break;
            } else {
              await new Promise((res) => setTimeout(res, 100))
              db.transaction(tx => {
                tx.executeSql(`INSERT INTO ${batchTable} (batchid, acctno, prevreading, reading, volume, rate, acctname, capacity, brand, meterno, billdate, duedate, discdate, amount, classification, penalty, discount, acctgroup, fromdate, todate, location, reader, balance, pageNum, note) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                  [data[i].batchid, data[i].acctno, data[i].prevreading, data[i].reading, data[i].volume, data[i].rate, data[i].acctname, data[i].meter.capacity, data[i].meter.brand, data[i].meterid, data[i].billdate, data[i].duedate, data[i].discdate, data[i].amount, data[i].classificationid, data[i].penalty, data[i].discount, data[i].acctgroup, data[i].fromdate, data[i].todate, data[i].location.text, data[i].reader.name, data[i].balance, data[i].pageNum, data[i].note],
                  async () => {
                    initCur = initCur + 1
                    setCurr(data[i].pageNum + 1)
                    // setPercent((initCur) / newNum);
                    // console.log(`data ${i + 1} saved`)
                    if (i === newNum - 1 && exited.current !== true) {
                      setFileNum(data[i].pageNum + 1)
                      batchDownloading.current = false
                      await AsyncStorage.setItem(`${batchTable}Start`, JSON.stringify(data[i].pageNum), () => {
                        console.log("new start saved at: " + data[i].pageNum)
                      });
                      // prevStart.current = data[i].pageNum;
                      // console.log(`new pageNum saved:`, data[i].pageNum)
                    }
                  },
                  (_, e) => {
                    console.log("not saved:", e)
                    return false
                  }
                )
              })
            }
          }

          const booleanValueToSave = dataRes.length === selected + 1 ? true : false

          await AsyncStorage.setItem(batchTable, JSON.stringify(booleanValueToSave));
          // await AsyncStorage.setItem("prevFetchSize", JSON.stringify(selected));

          if (booleanValueToSave && !exited.current) {
            await getdata();
          } else {
            setError("All accounts already downloaded")
          }

          setDownloaded(true)
          setError('')

        } else {
          setError("All accounts already downloaded")
        }

      } catch (error) {
        console.log(error)
        setPreDownloading(false)
        setDownloading(false)
        setError(`Error: ${error}`)
      } finally {
        setPercent(0)
        setPreDownloading(false)
        setBatch('')
        batchDownloading.current = false;
      }
    }

    // const checkVariableExists = async (key) => {
    //   try {
    //     const value = await AsyncStorage.getItem(key);
    //     if (value !== null) {
    //       return JSON.parse(value);
    //     } else {
    //       return true;
    //     }
    //   } catch (error) {
    //     console.error('Error checking variable existence:', error);
    //     return true;
    //   }
    // };

    // let lastRec = await checkVariableExists(batchTable);

    // console.log("LastRec is :", lastRec)

    // if (lastRec && !exited.current) {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
        [batchTable],
        (txObj, resultSet) => {
          if (resultSet.rows.length > 0) {
            tx.executeSql(`DROP TABLE ${batchTable}`, null, async (txObj, resultSet) => {
              await AsyncStorage.removeItem(`${batchTable}Start`);
              await AsyncStorage.removeItem(`${batchTable}`);
              console.log("table dropped")
            });
          } else {
            console.log(`Table ${batchTable} does not exist.`);
          }
        },
        (txObj, error) => {
          console.log("Error checking for table existence:", error);
          return false
        }
      );
    });

    await new Promise((res) => setTimeout(res, 100))
    await getdata();
    // } else {
    //   setError("All accounts already downloaded")
    // }

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
                {/* <Progress.Bar progress={percent} width={200} height={20} color='green' /> */}
                <Text>Records Downloaded:  {curr}</Text>
              </View>
            </View>
            :
            <View style={styles.container}>
              <View style={styles.infoContainer}>
                <Text style={{ ...styles.menuText, color: 'green' }}>Download Complete !!!</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <Text>{fileNum} Records Downloaded</Text>
                  <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', gap: 5, borderRadius: 5, borderWidth: 1, paddingHorizontal: 5, borderColor: 'rgba(0, 0, 0, 0.1)' }}
                  onPress={() => {
                    if (formula) {
                      navigation.navigate('Batch Info', { batchname: currentBatch.current })
                    } else {
                      alert("Cannot View Batch items ,Please sync the bill formula first!")
                    }
                  }}>
                    <Text>View</Text>
                    <MaterialIcons name="pageview" size={24} color="#00669B" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("Water Home")} style={styles.goToHomeButton}>
                <Text style={{ color: 'white' }}>Go to Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={downloadAnotherBatch} style={styles.downloadedbackButton}>
                <Text style={{ color: 'black' }}>Download Another Batch</Text>
              </TouchableOpacity>
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
            <View style={{ gap: 15 }}>
              <TextInput placeholder='Enter Batch ID' cursorColor={"black"} style={styles.textInput} value={batch} onChangeText={(inputText) => setBatch(inputText)} />
              {error && <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 2 }}>
                  <TouchableOpacity style={styles.downloadButton} onPress={downloadBatch}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Download</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <SelectList
                    data={[
                      { key: 20, value: 20 },
                      { key: 30, value: 30 },
                      { key: 40, value: 40 },
                      { key: 50, value: 50 }
                    ]}
                    setSelected={setSelected}
                    search={false}
                    defaultOption={{ key: prevFetchNum, value: prevFetchNum }}
                    boxStyles={{ height: 50 }}
                    onSelect={() => {
                      console.log(selected)
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        }

      </View>
    </View>
  )
}

export default DownloadBatch