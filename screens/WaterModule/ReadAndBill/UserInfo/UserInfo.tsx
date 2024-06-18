import { View, Text, Pressable, Modal, ActivityIndicator, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { styles1, styles2 } from './styles'
import { Ionicons, FontAwesome6, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WaterHeader from '../../../../components/Water/WaterHeader'
import { UserType } from '../../Others/types';

import * as SQLITE from 'expo-sqlite'
import * as FileSystem from 'expo-file-system';
import ThermalPrinterModule from 'react-native-thermal-printer';

import { Asset } from 'expo-asset';
import { useIsFocused } from '@react-navigation/native';
import { printFormat } from '../../Others/printFromat';

import { Dimensions } from 'react-native';
import { currencyFormat } from '../../Others/formatCurrency';

const { height } = Dimensions.get('window');
const db = SQLITE.openDatabase('example.db');

const UserInfo = ({ navigation, route }) => {
    const [open, setOpen] = useState(false)
    const [noteOpen, setNoteOpen] = useState(false)
    const [edit, setEdit] = useState(false)
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
        fromdate: null,
        todate: null,
        location: null,
        reader: null,
        balance: null,
        pageNum: null,
        note: null
    })
    const [headers, setHeaders] = useState({
        header1: "",
        header2: "",
        header3: ""
    })
    const [numberValue, setNumberValue] = useState([])
    const [decimalValue, setDecimalValue] = useState(["0", "0", "0", "0"]);
    const [noteInput, setNoteInput] = useState("")
    const [formula, setFormula] = useState(null)

    // const hdb = SQLITE.openDatabase('headers.db');

    const isFocused = useIsFocused()
    const { userAccNo, batchname } = route.params;

    const [imageUrl, setImageUrl] = useState(null)

    let styles = null

    if (height < 600) {
        styles = styles1
    } else if (height > 600 && height < 1000) {
        styles = styles2
    }

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

    useEffect(() => {
        const dlPicture = async () => {
            const imageAsset = Asset.fromModule(require('../../../../assets/printerLogoExample.jpg'));

            if (!imageAsset.localUri) {
                await imageAsset.downloadAsync();
            }
            // const exampleImageUri = Image.resolveAssetSource(imageAsset).uri
            let printLogoUri: string;

            const localUri = `${FileSystem.cacheDirectory}printerLogoExample.jpg`;

            const fileInfo = await FileSystem.getInfoAsync(localUri);
            console.log(`file Exist? ${fileInfo.exists}`)
            if (!fileInfo.exists) {
                await FileSystem.copyAsync({
                    from: imageAsset.localUri || imageAsset.uri,
                    to: localUri,
                });
            }
            // Load the copied asset
            const copiedAsset = Asset.fromURI(localUri);
            copiedAsset.localUri = localUri; // Need to set the localUri for loadAsync() to work
            const [copy] = await Asset.loadAsync(
                copiedAsset.localUri || copiedAsset.uri
            );

            printLogoUri = copy.localUri ?? copy.uri;

            // alert(printLogoUri)
            setImageUrl(printLogoUri)

        }

        dlPicture();
    }, [])

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

                                const retrievedDecimal = user.reading.toFixed(4).split(".")[1].split("")
                                setDecimalValue(retrievedDecimal)
                            } else if (user.prevreading !== 0 && user.prevreading !== null) {
                                const val = Math.floor(user.prevreading).toString()
                                let arrIndex = newArr.length - 1
                                for (let i = val.length - 1; i >= 0; i--) {
                                    newArr[arrIndex] = val[i];
                                    arrIndex = arrIndex - 1
                                }
                                setNumberValue(newArr)

                                if (user.reading) {
                                    const retrievedDecimal = user.reading.toFixed(4).split(".")[1].split("")
                                    setDecimalValue(retrievedDecimal)
                                }
                            } else {
                                setNumberValue(numberString)
                            }
                        }
                    );
                }
            );

            retrieveFormula();
            retrieveData();
        }

    }, [open, isFocused, noteOpen]);

    const printReceipt = async () => {
        try {
            await ThermalPrinterModule.printBluetooth({
                payload: printFormat(user, headers, imageUrl),
                printerWidthMM: 48,
                printerNbrCharactersPerLine: 32
            });
        } catch (err) {
            //error handling
            alert(err)
            console.log(err.message);
        }
    };

    const inputRefs = useRef([]);

    const handleInputChange = (text, index) => {
        // if (text.length > 0 && index < numberValue.length - 1) {
        //     inputRefs.current[index + 1].focus();
        // } else {
        //     inputRefs.current[index].blur();
        // }
        const newInputs = [...numberValue];
        newInputs[index] = text;
        setNumberValue(newInputs);
    };

    const decimalRefs = useRef([])

    const handleDecimalChange = (text, index) => {
        // if (text.length > 0 && index < decimalValue.length - 1) {
        //     decimalRefs.current[index + 1].focus();
        // }
        const newInputs = [...decimalValue];
        newInputs[index] = text;
        setDecimalValue(newInputs);
    };

    const handleSave = async () => {
        try {
            const newNumber = numberValue.map((item) => item === "" ? item = "0" : item)
            const newDecimal = decimalValue.map((item) => item === "" ? item = "0" : item)
            const newReadStr = newNumber.join('') + '.' + newDecimal.join('');
            const newRead = Number(newReadStr);

            // console.log(newNumber, newDecimal, newRead)

            if (newRead !== 0) {
                let toSubstractFrom = newRead
                if (user.prevreading > newRead) {
                    toSubstractFrom = (user.capacity + toSubstractFrom) - 1

                }


                // user.volume = Number((toSubstractFrom - user.prevreading).toFixed(4));
                const newVol = Number((toSubstractFrom - user.prevreading).toFixed(4));
                console.log(user.prevreading, newRead, user.volume)
                const func = eval(formula)
                const result = func({ ...user, volume: newVol })

                // const newVol = (toSubstractFrom - user.prevreading) - 1;
                // const newFormula = await formula + `(${user})`
                // const result = await eval(formula.replace(/vol/g, newVol.toString()));
                // console.log(user)
                // const result = await eval(newFormula)
                // const finalRes = result ? result : null

                db.transaction(
                    tx => {
                        tx.executeSql(
                            `UPDATE ${batchname} SET reading = ?, volume = ?, rate = ? WHERE acctno = ?`,
                            [newRead, newVol, result, user.acctno],
                            (txObj, resultSet) => {
                                console.log('Updated reading, volume, and rate');
                            },
                            (txObj, error) => {
                                console.error('Error updating reading, volume, and rate:', error);
                                return false
                            }
                        );
                    }
                );
            }

        } catch (e) {
            console.log("error:", e)
        } finally {
            setOpen(false)
        }
    }

    const saveNote = () => {
        db.transaction(
            tx => {
                tx.executeSql(
                    `UPDATE ${batchname} SET note = ? WHERE acctno = ?`,
                    [noteInput, user.acctno],
                    (txObj, resultSet) => {
                        console.log('Updated note');
                    },
                    (txObj, error) => {
                        console.error('Error updating note:', error);
                        return false
                    }
                );
            }
        );
        setNoteInput("")
        setNoteOpen(false)
    }

    const unHold = () => {
        db.transaction(
            tx => {
                tx.executeSql(
                    `UPDATE ${batchname} SET note = ? WHERE acctno = ?`,
                    ["", user.acctno],
                    (txObj, resultSet) => {
                        console.log('Updated note');
                    },
                    (txObj, error) => {
                        console.error('Error updating note:', error);
                        return false
                    }
                );
            }
        );
        db.transaction(
            tx => {
                tx.executeSql(`SELECT * FROM ${batchname} WHERE acctno = ?`, [userAccNo],
                    (txObj, resultSet) => {
                        setUser(resultSet.rows._array[0]);
                        // const numberString = resultSet.rows._array[0].capacity.toString().match(/0/g) || [];
                        // const newArr = []
                        // numberString.map(() => {
                        //     newArr.push('0')
                        // });

                        // if (user.reading !== null) {
                        //     const val = Math.floor(user.reading).toString()
                        //     let arrIndex = newArr.length - 1
                        //     for (let i = val.length - 1; i >= 0; i--) {
                        //         newArr[arrIndex] = val[i];
                        //         arrIndex = arrIndex - 1
                        //     }
                        //     setNumberValue(newArr)
                        // }
                    }
                );
            }
        );

        // retrieveFormula();
        // retrieveData();

        setEdit(false)
    }

    const editNote = () => {
        db.transaction(
            tx => {
                tx.executeSql(`SELECT * FROM ${batchname} WHERE acctno = ?`, [userAccNo],
                    (txObj, resultSet) => {
                        setNoteInput(resultSet.rows._array[0].note)
                    }
                );
            }
        );
        setEdit(true)
        setNoteOpen(true)
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <WaterHeader navigation={navigation} backBut="Batch Info" data={{ batchname }} />
            <View style={styles1.container}>
                <View style={{ flex: 1, marginBottom: 0, marginTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10 }}>
                        <View style={{ flex: 3, alignItems: 'flex-start' }}>
                            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                                    <Pressable >
                                        {user.acctno === '1' ?
                                            <Ionicons name="location-sharp" size={50} color="red" /> :
                                            <Ionicons name="location-outline" size={50} color="black" />
                                        }
                                    </Pressable>
                                    <Text></Text>
                                    {/* <Text style={{ fontWeight: 'bold' }}>{user.pageNum + 1}</Text> */}
                                </View>
                                {
                                    user.reading === null ?
                                        <TouchableOpacity onPress={() => setOpen(true)} style={styles1.print}>
                                            <Text style={{ color: 'white', fontSize: 17 }}>Read</Text>
                                        </TouchableOpacity> :
                                        <View>
                                            {!user.note ? <View style={{ justifyContent: 'space-between', gap: 10 }}>
                                                <TouchableOpacity onPress={() => setNoteOpen(true)} style={styles1.hold}>
                                                    <Text style={{ color: 'black', fontSize: 17 }}>Hold</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => {
                                                    setOpen(true)
                                                }} style={styles1.reRead}>
                                                    <Text style={{ color: 'black', fontSize: 17 }}>Re-read</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={printReceipt} style={styles1.print}>
                                                    <Text style={{ color: 'white', fontSize: 17 }}>Print</Text>
                                                </TouchableOpacity>
                                            </View> :
                                                <View style={{ justifyContent: 'space-between', gap: 10 }}>
                                                    <TouchableOpacity onPress={unHold} style={styles1.hold}>
                                                        <Text style={{ color: 'black', fontSize: 17 }}>Un-hold</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => setOpen(true)} style={styles1.reRead}>
                                                        <Text style={{ color: 'black', fontSize: 17 }}>Re-read</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            }
                                        </View>
                                }
                            </View>

                        </View>
                        <View style={{ flex: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                            <View style={{ justifyContent: 'space-between', flex: 1 }}>
                                <View style={styles1.infoGap}>
                                    <View style={styles1.info}>
                                        <Text style={styles1.infoName}>Account No:</Text>
                                        <Text style={styles1.infoValue}>{user.acctno}</Text>
                                    </View>
                                    <View style={styles1.info}>
                                        <Text style={styles1.infoName}>Name:</Text>
                                        <Text style={styles1.infoValue}>{user.acctname}</Text>
                                    </View>
                                    <View style={styles1.info}>
                                        <Text style={styles1.infoName}>Address:</Text>
                                        <Text style={styles1.infoValue}>{user.location}</Text>
                                    </View>
                                </View>
                                <View style={styles1.infoGap}>
                                    <View style={styles1.info}>
                                        <Text style={styles1.infoName}>Meter Serial No.:</Text>
                                        <Text style={styles1.infoValue}>{user.meterno}</Text>
                                    </View>
                                    <View style={styles1.info}>
                                        <Text style={styles1.infoName}>Brand:</Text>
                                        <Text style={styles1.infoValue}>{user.brand}</Text>
                                    </View>
                                    <View style={styles1.info}>
                                        <Text style={styles1.infoName}>Capacity:</Text>
                                        <Text style={styles1.infoValue}>{user.capacity}</Text>
                                    </View>
                                </View>
                                <View style={styles1.infoGap}>
                                    <View style={styles1.info}>
                                        <Text style={styles1.infoName}>Previous Reading:</Text>
                                        <Text style={styles1.infoValue}>{user.prevreading}</Text>
                                    </View>
                                    <View style={styles1.info}>
                                        <Text style={styles1.infoName}>Current Reading:</Text>
                                        {user.reading === 0 ? <Text style={styles1.infoValue}>None</Text> :
                                            <Text style={styles1.infoValue}>{user.reading}</Text>
                                        }
                                    </View>
                                    {user.reading !== null &&
                                        <View style={styles1.info}>
                                            <Text style={styles1.infoName}>Volume:</Text>
                                            <Text style={styles1.infoValue}>{user.volume}</Text>
                                        </View>
                                    }
                                    {user.rate !== null &&
                                        <View style={styles1.info}>
                                            <Text style={styles1.infoName}>Bill Amount:</Text>
                                            <Text style={styles1.infoValue}>{user.rate !== 0 ? currencyFormat({ val: user.rate, decimal: 2 }) : 0}</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>


                    {/* Button will change depending if has been read or not */}
                    {open &&
                        <Modal transparent={true} onRequestClose={() => setOpen(false)}>
                            <View style={styles1.modalContainer}>
                                <View style={styles1.modal}>
                                    <View style={styles1.inputContainer}>
                                        {numberValue.map((value, index) => (
                                            <TextInput
                                                style={styles1.inputBox}
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
                                    <View style={styles1.inputContainer}>
                                        {decimalValue.map((value, index) => (
                                            <TextInput
                                                style={styles1.decimalBox}
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
                                        <TouchableOpacity onPress={() => setOpen(false)} style={{ ...styles1.save, backgroundColor: 'white' }}>
                                            <Text style={{ color: 'black' }}>Back</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleSave} style={styles1.save}>
                                            <Text style={{ color: 'white' }}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    }
                    {noteOpen &&
                        <Modal transparent={true} onRequestClose={() => setOpen(false)}>
                            <View style={styles1.modalContainer}>
                                <View style={styles1.noteModal}>
                                    <View style={{ gap: 10 }}>
                                        {!edit && <Text style={{ alignSelf: 'center' }}>Hold the account</Text>}
                                        <Text>{edit ? "Edit note:" : "Put a note:"}</Text>
                                        <TextInput
                                            style={{ borderWidth: 1, height: 100, textAlignVertical: 'top', padding: 5 }}
                                            value={noteInput}
                                            multiline={true}
                                            numberOfLines={10}
                                            onChangeText={(inputText) => setNoteInput(inputText)}
                                        />

                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 }}>
                                        <TouchableOpacity onPress={() => setNoteOpen(false)} style={{ ...styles1.save, backgroundColor: 'white', width: 100 }}>
                                            <Text style={{ color: 'black' }}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={saveNote} style={{ ...styles1.save, width: 100 }}>
                                            <Text style={{ color: 'white' }}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    }
                </View>
                <View style={{ gap: 10, height: 80, paddingHorizontal: 20, alignItems: 'center' }}>
                    {user.note &&
                        <View>
                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>Note</Text>
                                <Pressable onPress={editNote}>
                                    <FontAwesome6 name="edit" size={15} color="black" />
                                </Pressable>
                            </View>
                            <Text style={{ flex: 1, marginTop: 10 }}>{user.note}</Text>
                        </View>
                    }
                </View>
            </View>
            {/* {(!open && !noteOpen) && <TouchableOpacity onPress={() => navigation.navigate('Batch Info', { batchname })} style={styles.backButton}>
                <Text style={{ color: 'black' }}>Back to List</Text>
            </TouchableOpacity>} */}
        </View>
    )
}

export default UserInfo