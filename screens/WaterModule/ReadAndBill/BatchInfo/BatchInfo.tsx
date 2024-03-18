import { View, Text, Pressable, FlatList, Button, TextInput, Keyboard, KeyboardAvoidingView } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { Ionicons, Feather } from '@expo/vector-icons';

import { styles } from './styles'
import WaterHeader from '../../../../components/Water/WaterHeader';

import * as SQLITE from 'expo-sqlite'
import { useIsFocused } from '@react-navigation/native';
import { UserType } from '../../Others/types';


const BatchInfo = ({ navigation, route }) => {
    const [dataInfo, setDataInfo] = useState<UserType[]>([])
    const [currentPage, setCurrentPage] = useState(0);

    const pageSize = 4;

    const [search, setSearch] = useState('')
    const [searchRes, setSearchRes] = useState([])
    const [error, setError] = useState(false)

    const db = SQLITE.openDatabase('example.db');
    const isFocused = useIsFocused()

    const { batchname } = route.params;

    useEffect(() => {
        if (isFocused) {
            db.transaction(tx => {
                tx.executeSql(`SELECT * FROM ${batchname}`, null,
                    (txObj, resultSet) => {
                        setDataInfo(resultSet.rows._array)
                    }
                )
            })
        }
    }, [isFocused])

    useEffect(() => {
        let timeoutId;
        setError(false)
        const delayedSearch = () => {
            if (search !== "") {
                db.transaction(tx => {
                    tx.executeSql(
                        `SELECT * FROM ${batchname} WHERE acctname LIKE ? OR meterno LIKE ?`,
                        [`%${search}%`,`%${search}%`],
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
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePress = (id) => {
        navigation.navigate('User Info', { userAccNo: id, batchname })
    }

    const clearInput = () => {
        setSearch("")
    }


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <WaterHeader navigation={navigation} backBut='Read And Bill' />
            <View style={styles.container}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior='height' keyboardVerticalOffset={0}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.searchContainer}>
                            <TextInput placeholder='Account Search' value={search} onChangeText={(input) => setSearch(input)} style={{ marginLeft: 10, flex: 1 }} />
                            <Feather onPress={clearInput} name="x" size={30} color="rgba(0, 0, 0, 0.5)" style={search !== "" ? { marginRight: 10 } : { opacity: 0 }} />
                        </View>
                        {
                            (searchRes.length === 0 && !error) ?
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        data={renderUsers()}
                                        renderItem={(data) => (
                                            <Pressable onPress={() => handlePress(data.item.acctno)}>
                                                <View style={data.item.reading === null ? styles.accountContainer : {...styles.accountContainer, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        {data.item.acctno === '1' ?
                                                            <Ionicons name="location-sharp" size={50} color="red" /> :
                                                            <Ionicons name="location-outline" size={50} color="black" />
                                                        }
                                                        <Text>1234</Text>
                                                    </View>
                                                    <View style={{ flex: 3, padding: 5 }}>
                                                        <View style={styles.info}>
                                                            <Text style={{ fontWeight: 'bold' }}>NAME: </Text>
                                                            <Text style={data.item.acctname.length > 20 ? {fontSize: 12} : { fontSize: 15 }}>{data.item.acctname}</Text>
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
                                        showsVerticalScrollIndicator={false}
                                    />
                                    <View style={styles.navContainer}>
                                        {
                                            currentPage === 0 ?
                                                <View style={{ flex: 1 }}></View> :
                                                <Pressable onPress={handlePrevPage} style={{ flex: 1, alignItems: 'center' }}>
                                                    <Text style={styles.prevText}>Previous</Text>
                                                </Pressable>
                                        }
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={styles.pageText}>{currentPage + 1}</Text>
                                        </View>
                                        {
                                            (currentPage + 1) * pageSize >= dataInfo.length ?
                                                <View style={{ flex: 1 }}></View> :
                                                <Pressable onPress={handleNextPage} style={{ flex: 1, alignItems: 'center' }}>
                                                    <Text style={styles.nextText}>Next</Text>
                                                </Pressable>
                                        }
                                    </View>
                                </View> :
                                <View style={{ flex: 15 }}>
                                    {searchRes.length === 0 && <Text style={{ textAlign: 'center', fontSize: 20 }}>No result for "{search}"</Text>}
                                    <FlatList
                                        data={searchRes}
                                        renderItem={(data) => (
                                            <Pressable onPress={() => handlePress(data.item.acctno)}>
                                                <View style={data.item.reading === null ? styles.accountContainer : {...styles.accountContainer, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        {data.item.acctno === '1' ?
                                                            <Ionicons name="location-sharp" size={50} color="red" /> :
                                                            <Ionicons name="location-outline" size={50} color="black" />
                                                        }
                                                        <Text>1234</Text>
                                                    </View>
                                                    <View style={{ flex: 3, padding: 5 }}>
                                                        <View style={styles.info}>
                                                            <Text style={{ fontWeight: 'bold' }}>NAME: </Text>
                                                            <Text style={data.item.acctname.length > 20 ? {fontSize: 12} : { fontSize: 15 }}>{data.item.acctname}</Text>
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
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                        }
                    </View>
                </KeyboardAvoidingView>
            </View>
        </View>
    )
}

export default BatchInfo;