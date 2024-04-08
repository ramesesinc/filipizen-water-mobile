import { View, Text, Pressable, Modal, ActivityIndicator, TextInput } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { styles1, styles2 } from './styles'
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WaterHeader from '../../../../components/Water/WaterHeader'
import { UserType } from '../../Others/types';

import * as SQLITE from 'expo-sqlite'
import ThermalPrinterModule from 'react-native-thermal-printer';

import { Asset } from 'expo-asset';
import { useIsFocused } from '@react-navigation/native';
import { printFormat } from '../../Others/printFromat';

const imageAsset = Asset.fromModule(require('../../../../assets/printerLogo.png'));
const imageUrl = imageAsset.uri;

import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');
const db = SQLITE.openDatabase('example.db');

const UserInfo = ({ navigation, route }) => {
    const [open, setOpen] = useState(false)
    const [user, setUser] = useState<UserType>({
        batchid: null,
        acctno: null,
        prevreading: null,
        reading: null,
        volume: null,
        rate: null,
        acctname: null,
        capacity: null,
        brand: null,
        meterno: null,
        billdate: null,
        duedate: null,
        discdate: null,
        amount: null,
        classification: null,
        penalty: null,
        discount: null,
        acctgroup: null,
        pageNum: null
    })
    const [headers, setHeaders] = useState({
        header1: "",
        header2: "",
        header3: ""
    })
    const [numberValue, setNumberValue] = useState([])
    const [decimalValue, setDecimalValue] = useState(["0", "0", "0", "0"]);
    const [formula, setFormula] = useState(null)

    // const hdb = SQLITE.openDatabase('headers.db');

    const isFocused = useIsFocused()
    const { userAccNo, batchname } = route.params;

    let styles = null

    if (height < 600) {
        styles = styles1
    } else if (height > 600 && height < 1000) {
        styles = styles2
    }

    useEffect(() => {
        if (isFocused) {
            db.transaction(
                tx => {
                    tx.executeSql(`SELECT * FROM ${batchname} WHERE acctno = ?`, [userAccNo],
                        (txObj, resultSet) => {
                            setUser(resultSet.rows._array[0]);
                            const numberString = resultSet.rows._array[0].capacity.toString().match(/0/g) || [];
                            const newArr = []
                            numberString.map(() => {
                                newArr.push('0')
                            });

                            if (user.reading !== null) {
                                const val = Math.floor(user.reading).toString()
                                let arrIndex = newArr.length - 1
                                for (let i = val.length - 1; i >= 0; i--) {
                                    newArr[arrIndex] = val[i];
                                    arrIndex = arrIndex - 1
                                }
                                setNumberValue(newArr)
                            }
                        }
                    );
                }
            );

            const retrieveData = async () => {
                try {
                    const storedString = await AsyncStorage.getItem('header');
                    if (storedString !== null) {
                        const storedObject = await JSON.parse(storedString);
                        setHeaders(storedObject)
                    }
                } catch (error) {
                    console.error('Error retrieving object:', error);
                }
            };

            const retrieveFormula = async () => {
                try {
                    const storedString = await AsyncStorage.getItem('formula');
                    if (storedString !== null) {
                        setFormula(storedString)
                    }
                } catch (error) {
                    console.error('Error retrieving object:', error);
                }
            };

            retrieveFormula();
            retrieveData();
        }

    }, [open, isFocused]);

    const printReceipt = async () => {
        try {
            await ThermalPrinterModule.printBluetooth({
                payload: printFormat(imageUrl, user, headers),
                printerWidthMM: 48,
                printerNbrCharactersPerLine: 32
            });
        } catch (err) {
            //error handling
            console.log(err.message);
        }
    };

    const inputRefs = useRef([]);

    const handleInputChange = (text, index) => {
        if (text.length > 0 && index < numberValue.length - 1) {
            inputRefs.current[index + 1].focus();
        }
        const newInputs = [...numberValue];
        newInputs[index] = text;
        setNumberValue(newInputs);
    };

    const decimalRefs = useRef([])

    const handleDecimalChange = (text, index) => {
        if (text.length > 0 && index < decimalValue.length - 1) {
            decimalRefs.current[index + 1].focus();
        }
        const newInputs = [...decimalValue];
        newInputs[index] = text;
        setDecimalValue(newInputs);
    };

    const handleSave = async () => {
        try {
            const newNumber = numberValue.map((item) => item === "" ? item = "0" : item)
            const newDecimal = decimalValue.map((item) => item === "" ? item = "0" : item)
            const newReadStr = newNumber.join('') + '.' + newDecimal.join('');
            const newRead = parseFloat(newReadStr);
            const newVol = newRead - user.prevreading;
            const newFormula = await formula + `({acctgroup: '${user.acctgroup}', volume: ${newVol}})`
            // const result = await eval(formula.replace(/vol/g, newVol.toString()));
            const result = await eval(newFormula)

            db.transaction(
                tx => {
                    tx.executeSql(
                        `UPDATE ${batchname} SET reading = ?, volume = ?, amount = ? WHERE acctno = ?`,
                        [newRead, newVol, result, user.acctno],
                        (txObj, resultSet) => {
                            console.log('Updated reading, volume, and amount');
                        },
                        (txObj, error) => {
                            console.error('Error updating reading, volume, and amount:', error);
                            return false
                        }
                    );
                }
            );
        } catch (e) {
            console.log("error:", e)
        } finally {
            setOpen(false)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <WaterHeader navigation={navigation} backBut="Batch Info" data={{ batchname }} />
            <View style={styles.container}>
                <View style={{ flex: 1, marginBottom: 60, marginTop: 20 }}>
                    <View style={{ flex: 1, flexDirection: 'row', marginBottom: 30 }}>
                        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Pressable onPress={() => console.log(user)}>
                                    {user.acctno === '1' ?
                                        <Ionicons name="location-sharp" size={50} color="red" /> :
                                        <Ionicons name="location-outline" size={50} color="black" />
                                    }
                                </Pressable>
                                <Text style={{ fontWeight: 'bold' }}>1234</Text>
                            </View>
                            {
                                user.reading === null ?
                                    <Pressable onPress={() => setOpen(true)} style={styles.print}>
                                        <Text style={{ color: 'white', fontSize: 17 }}>Read</Text>
                                    </Pressable> :
                                    <View>
                                        <Pressable onPress={() => setOpen(true)} style={styles.reRead}>
                                            <Text style={{ color: 'black', fontSize: 17 }}>Re-read</Text>
                                        </Pressable>
                                        <Pressable onPress={printReceipt} style={styles.print}>
                                            <Text style={{ color: 'white', fontSize: 17 }}>Print</Text>
                                        </Pressable>
                                    </View>
                            }
                        </View>
                        <View style={{ flex: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                            <View style={{ justifyContent: 'space-between', flex: 1 }}>
                                <View style={styles.infoGap}>
                                    <View style={styles.info}>
                                        <Text style={styles.infoName}>Name:</Text>
                                        <Text style={styles.infoValue}>{user.acctname}</Text>
                                    </View>
                                    <View style={styles.info}>
                                        <Text style={styles.infoName}>Address:</Text>
                                        <Text style={styles.infoValue}> 055 Camias St. Cebu CIty</Text>
                                    </View>
                                </View>
                                <View style={styles.infoGap}>
                                    <View style={styles.info}>
                                        <Text style={styles.infoName}>Meter Serial No.:</Text>
                                        <Text style={styles.infoValue}>{user.meterno ? user.meterno.substring(0, user.meterno.indexOf(':')) : null}</Text>
                                    </View>
                                    <View style={styles.info}>
                                        <Text style={styles.infoName}>Brand:</Text>
                                        <Text style={styles.infoValue}>{user.brand}</Text>
                                    </View>
                                    <View style={styles.info}>
                                        <Text style={styles.infoName}>Capacity:</Text>
                                        <Text style={styles.infoValue}>{user.capacity}</Text>
                                    </View>
                                </View>
                                <View style={styles.infoGap}>
                                    <View style={styles.info}>
                                        <Text style={styles.infoName}>Previous Reading:</Text>
                                        <Text style={styles.infoValue}>{user.prevreading}</Text>
                                    </View>
                                    <View style={styles.info}>
                                        <Text style={styles.infoName}>Current Reading:</Text>
                                        {user.reading === 0 ? <Text style={styles.infoValue}>None</Text> :
                                            <Text style={styles.infoValue}>{user.reading}</Text>
                                        }
                                    </View>
                                    {user.reading !== null &&
                                        <View style={styles.info}>
                                            <Text style={styles.infoName}>Volume:</Text>
                                            <Text style={styles.infoValue}>{user.volume}</Text>
                                        </View>
                                    }
                                    {user.amount !== null &&
                                        <View style={styles.info}>
                                            <Text style={styles.infoName}>Bill Amount:</Text>
                                            <Text style={styles.infoValue}>{user.amount}</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>


                    {/* Button will change depending if has been read or not */}
                    {open &&
                        <Modal transparent={true} onRequestClose={() => setOpen(false)}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modal}>
                                    <View style={styles.inputContainer}>
                                        {numberValue.map((value, index) => (
                                            <TextInput
                                                style={styles.inputBox}
                                                value={value}
                                                key={index}
                                                onChangeText={(text) => handleInputChange(text, index)}
                                                maxLength={1}
                                                keyboardType="numeric"
                                                ref={(ref) => (inputRefs.current[index] = ref)}
                                                cursorColor={'black'}
                                                selectTextOnFocus
                                                textAlign='center'
                                            />
                                        ))}
                                    </View>
                                    <View style={styles.inputContainer}>
                                        {decimalValue.map((value, index) => (
                                            <TextInput
                                                style={styles.decimalBox}
                                                value={value}
                                                key={index}
                                                onChangeText={(text) => handleDecimalChange(text, index)}
                                                maxLength={1}
                                                keyboardType="numeric"
                                                ref={(ref) => (decimalRefs.current[index] = ref)}
                                                cursorColor={'black'}
                                                selectTextOnFocus
                                                textAlign='center'
                                            />
                                        ))}
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 30 }}>
                                        <Pressable onPress={() => setOpen(false)} style={{...styles.save, backgroundColor: 'white'}}>
                                            <Text style={{ color: 'black' }}>Back</Text>
                                        </Pressable>
                                        <Pressable onPress={handleSave} style={styles.save}>
                                            <Text style={{ color: 'white' }}>Save</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    }
                </View>
            </View>
            {!open && <Pressable onPress={() => navigation.navigate('Batch Info', { batchname })} style={styles.backButton}>
                <Text style={{ color: 'black' }}>Back to List</Text>
            </Pressable>}
        </View>
    )
}

export default UserInfo