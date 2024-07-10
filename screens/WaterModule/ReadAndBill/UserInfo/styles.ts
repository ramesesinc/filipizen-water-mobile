import { StyleSheet } from 'react-native'

export const styles1 = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: 'white'
    },
    backToList: {
        position: 'absolute',
        bottom: 10,
        backgroundColor: "#00669B",
        padding: 10,
        width: 150,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    },
    backButton: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: "white",
        padding: 10,
        marginBottom: 30,
        width: 150,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    },
    info: {
        flexDirection: 'row',
        gap: 0,
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    infoGap: {
        gap: 0
    },
    infoName: {
        fontWeight: '700'
    },
    infoValue: {
        fontSize: 15,
        textAlign: 'left'
    },
    print: {
        backgroundColor: "green",
        padding: 10,
        width: 100,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    modal: {
        backgroundColor: 'white',
        height: 250,
        padding: 20,
        borderRadius: 20,
        justifyContent: 'space-around'
    },
    noteModal: {
        backgroundColor: 'white',
        height: 250,
        width: 250,
        padding: 20,
        borderRadius: 20,
        justifyContent: 'space-around',
        gap: 20
    },
    signModal: {
        backgroundColor: 'white',
        height: 350,
        width: 350,
        padding: 20,
        borderRadius: 20,
        justifyContent: 'space-around',
        gap: 20
    },
    save: {
        backgroundColor: "green",
        padding: 10,
        width: 150,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    },
    reRead: {
        backgroundColor: "white",
        padding: 10,
        width: 100,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5
    },
    inputBox: {
        borderWidth: 1,
        padding: 10,
        paddingHorizontal: 15,
        fontWeight: 'bold',
        fontSize: 30
    },
    decimalBox: {
        borderWidth: 1,
        padding: 10,
        paddingHorizontal: 15,
        fontWeight: 'bold',
        fontSize: 15
    },
    hold : {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: 10,
        width: 100,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }
})

export const styles2 = StyleSheet.create({
    container: {
        height: 600,
        padding: 10,
        backgroundColor: 'white'
    },
    backToList: {
        position: 'absolute',
        bottom: 10,
        backgroundColor: "#00669B",
        padding: 10,
        width: 150,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    },
    backButton: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: "white",
        padding: 10,
        marginBottom: 40,
        width: 150,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    },
    info: {
        flexDirection: 'row',
        gap: 20,
        flexWrap: 'wrap',
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    infoGap: {
        gap: 10
    },
    infoName: {
        fontWeight: '700',
        fontSize: 15
    },
    infoValue: {
        backgroundColor: 'red',
        flex: 1,
        fontSize: 15,
        textAlign: 'right'
    },
    print: {
        backgroundColor: "green",
        padding: 10,
        width: 100,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
        fontSize: 20
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    modal: {
        backgroundColor: 'white',
        height: 250,
        padding: 20,
        borderRadius: 20,
        justifyContent: 'space-around',
        gap: 20
    },
    noteModal: {
        backgroundColor: 'white',
        height: 250,
        width: 250,
        padding: 20,
        borderRadius: 20,
        justifyContent: 'space-around',
        gap: 20
    },
    save: {
        backgroundColor: "green",
        padding: 10,
        width: 100,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    },
    reRead: {
        backgroundColor: "white",
        padding: 10,
        width: 100,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5
    },
    inputBox: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        paddingHorizontal: 15,
        fontWeight: 'bold',
        fontSize: 30
    },
    decimalBox: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 5,
        paddingHorizontal: 10,
        fontWeight: 'bold',
        fontSize: 15
    },
    hold : {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: 10,
        width: 100,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10
    }
})