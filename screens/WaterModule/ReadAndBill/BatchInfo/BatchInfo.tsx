import { View, Text, Pressable, FlatList, Button, TextInput, Keyboard, KeyboardAvoidingView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'


import { Ionicons, Feather } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';

import { styles } from './styles'
import WaterHeader from '../../../../components/Water/WaterHeader';

import * as SQLITE from 'expo-sqlite'
import { useIsFocused } from '@react-navigation/native';
import { UserType } from '../../Others/types';


const BatchInfo = ({ navigation, route }) => {
    const [dataInfo, setDataInfo] = useState<UserType[]>([])
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(1)
    const [nextButton, setNextButton] = useState(false)

    const [records, setRecords] = useState(0)
    const [maxRec, setMaxRec] = useState(null)
    const [maxPage, setMaxPage] = useState(null)

    const [loading, setLoading] = useState(false)

    const pageSize = 10;

    const [search, setSearch] = useState('')
    const [searchRes, setSearchRes] = useState([])
    const [error, setError] = useState(false)

    const isFocused = useIsFocused()

    const { batchname } = route.params;

    const db = SQLITE.openDatabase('example.db');


    const inputRef = useRef(null)

    const [offset, setOffSet] = useState(0);

    useEffect(() => {
        if (isFocused) {
            db.transaction(tx => {
                tx.executeSql(`SELECT * FROM ${batchname} LIMIT ? OFFSET ?`, [11, offset],
                    (txObj, resultSet) => {
                        if (resultSet.rows._array.length === 11) {
                            const newArr = resultSet.rows._array.slice(0, -1)
                            setDataInfo(newArr)
                            setNextButton(true)
                            setRecords(newArr.length + ((pageCount - 1) * 10))
                        } else {
                            setDataInfo(resultSet.rows._array)
                            setNextButton(false)
                            setRecords(resultSet.rows._array.length + ((pageCount - 1) * 10))
                        }
                        setLoading(false)
                    }
                )
            })

            const getMaxNum = async () => {
                const maxNum = await AsyncStorage.getItem(`${batchname}Max`);
                setMaxRec(maxNum)
                setMaxPage(Math.ceil(Number(maxNum) / 10))
            }

            getMaxNum();
        }
    }, [isFocused, batchname, currentPage, nextButton, offset])

    useEffect(() => {
        let timeoutId;
        setError(false)
        const delayedSearch = () => {
            if (search !== "") {
                db.transaction(tx => {
                    tx.executeSql(
                        `SELECT * FROM ${batchname} WHERE acctname LIKE ? OR meterno LIKE ?  OR acctno LIKE ?`,
                        [`%${search}%`, `%${search}%`, `%${search}%`],
                        (txObj, resultSet) => {
                            setSearchRes([]);
                            if (resultSet.rows._array.length > 0) {
                                setSearchRes(resultSet.rows._array);
                            } else {
                                setError(true)
                            }
                        }
                    );
                });
            } else {
                setSearchRes([]);
                setError(false)
            }
        };

        clearTimeout(timeoutId);
        const timeOutTime = search === "" ? 0 : 600;

        timeoutId = setTimeout(delayedSearch, timeOutTime);

        return () => clearTimeout(timeoutId);
    }, [search])

    const renderUsers = () => {
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        return dataInfo.slice(startIndex, endIndex);
    };

    const handleNextPage = () => {
        // setCurrentPage(currentPage + 1);
        setLoading(true)
        // setCurrentPage(currentPage + 10);
        setOffSet(offset + 10)
        setPageCount(pageCount + 1)
    };

    const handlePrevPage = () => {
        // if (currentPage > 0) {
        //     setCurrentPage(currentPage - 1);
        // }
        setLoading(true)
        // setCurrentPage(currentPage - 10);
        setOffSet(offset - 10)
        setPageCount(pageCount - 1)
    };

    const handlePress = (id) => {
        navigation.navigate('User Info', { userAccNo: id, batchname })
    }

    const clearInput = () => {
        inputRef.current.blur();
        setSearch("")
    }

    const seeLoc = (coordinate) => {
        console.log(coordinate)
        navigation.navigate("Map", { batchname, coordinate })
    }

    // onPress={() =>seeLoc({longitude: 123.91016, latitude: 10.32234})}


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <WaterHeader navigation={navigation} backBut='Read & Bill' />
            <View style={styles.container}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior='height' keyboardVerticalOffset={0}>
                    {!loading ?
                        <View style={{ flex: 1 }}>
                            <View style={styles.searchContainer}>
                                <TextInput ref={inputRef} placeholder='Account Search' value={search} onChangeText={(input) => setSearch(input)} style={{ marginLeft: 10, flex: 1 }} />
                                <Feather onPress={clearInput} name="x" size={30} color="rgba(0, 0, 0, 0.5)" style={search !== "" ? { marginRight: 10 } : { opacity: 0 }} />
                            </View>
                            {
                                (searchRes.length === 0 && !error) ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            data={dataInfo}
                                            renderItem={(data) => (
                                                <View>
                                                    <View style={styles.accountContainer}>
                                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                                                            {/* {data.item.acctno === '1' ?
                                                                <Ionicons name="location-sharp" size={50} color="red" /> :
                                                                <Ionicons name="location-outline" size={50} color="black" />
                                                            } */}
                                                            {/* <View style={data.item.reading === null? styles.indicationBox : {...styles.indicationBox, backgroundColor: 'green'}}></View>
                                                            <Pressable style={{ backgroundColor: 'white', width: 35, justifyContent: 'center', borderWidth: 1 }}>
                                                                <Text style={{textAlign: 'center'}}>{data.item.pageNum + 1}</Text>
                                                            </Pressable> */}
                                                            {data.item.reading !== null ?
                                                                <AntDesign name="checkcircle" size={24} color="green" /> :
                                                                // <Fontisto name="checkbox-passive" size={20} color="black" />
                                                                <AntDesign name="exclamationcircleo" size={24} color="rgba(0, 0, 0, 0.5)" />
                                                            }
                                                        </View>
                                                        <TouchableOpacity onPress={() => handlePress(data.item.acctno)} style={{ flex: 5, padding: 5, borderStartWidth: 0 }}>
                                                            <View style={styles.info}>
                                                                <Text style={{ fontWeight: 'bold' }}>NAME: </Text>
                                                                <Text style={{ fontSize: 12 }}>{data.item.acctname}</Text>
                                                            </View>
                                                            <View style={styles.info}>
                                                                <Text style={{ fontWeight: 'bold' }}>ACCOUNT NUMBER: </Text>
                                                                <Text>{data.item.acctno}</Text>
                                                            </View>
                                                            <View style={styles.info}>
                                                                <Text style={{ fontWeight: 'bold' }}>CURRENT READING: </Text>
                                                                <Text>{data.item.reading}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )}
                                            showsVerticalScrollIndicator={true}
                                        />
                                        <View style={styles.navContainer}>
                                            <View style={styles.pageInfo}>
                                                <Text>Page {pageCount} of {maxPage}</Text>
                                                <Text>{records} / {maxRec} records</Text>
                                            </View>
                                            <View style={styles.constroller}>
                                                <TouchableOpacity onPress={handlePrevPage} style={{ flex: 1, alignItems: 'center', borderRightWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)' }} disabled={pageCount === 1}>
                                                    <Entypo name="arrow-with-circle-left" size={30} color={pageCount === 1 ? 'rgba(0, 0, 0, 0.1)' : "#00669B"} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={handleNextPage} style={{ flex: 1, alignItems: 'center', borderLeftWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)' }} disabled={!nextButton}>
                                                    <Entypo name="arrow-with-circle-right" size={30} color={nextButton ? "#00669B" : 'rgba(0, 0, 0, 0.1)'} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View> :
                                    <View style={{ flex: 15 }}>
                                        {searchRes.length === 0 && <Text style={{ textAlign: 'center', fontSize: 20 }}>No result for "{search}"</Text>}
                                        <FlatList
                                            data={searchRes}
                                            renderItem={(data) => (
                                                <Pressable onPress={() => handlePress(data.item.acctno)}>
                                                    <View style={styles.accountContainer}>
                                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                                                            {data.item.reading !== null ?
                                                                <AntDesign name="checkcircle" size={24} color="green" /> :
                                                                // <Fontisto name="checkbox-passive" size={20} color="black" />
                                                                <AntDesign name="exclamationcircleo" size={24} color="rgba(0, 0, 0, 0.5)" />
                                                            }
                                                        </View>
                                                        <View style={{ flex: 3, padding: 5 }}>
                                                            <View style={styles.info}>
                                                                <Text style={{ fontWeight: 'bold' }}>NAME: </Text>
                                                                <Text style={{ fontSize: 12 }}>{data.item.acctname}</Text>
                                                            </View>
                                                            <View style={styles.info}>
                                                                <Text style={{ fontWeight: 'bold' }}>CLASSIFICATION: </Text>
                                                                <Text>{data.item.classification}</Text>
                                                            </View>
                                                            <View style={styles.info}>
                                                                <Text style={{ fontWeight: 'bold' }}>CURRENT READING: </Text>
                                                                <Text>{data.item.reading}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </Pressable>
                                            )}
                                            showsVerticalScrollIndicator={true}
                                        />
                                    </View>
                            }
                        </View> :
                        <View style={styles.container}>
                            <ActivityIndicator style={{ flex: 1 }} size={50} color="#00669B" />
                        </View>

                    }
                </KeyboardAvoidingView>
            </View>
        </View>
    )
}

export default BatchInfo;