import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    backToList: {
        position: 'absolute',
        bottom: 85,
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
        bottom: 10,
        backgroundColor: "white",
        padding: 10,
        marginBottom: 10,
        width: 150,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    },
    searchContainer: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'rgba(0, 0, 0, 0.3)'
    },
    accountContainer: {
        flexDirection: 'row',
        height: 100,
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.2)'
    },
    info: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 5,
        alignItems: 'center',
    },
    infoName: {
        fontWeight: '600'
    },
    navContainer: {
        flexDirection: 'row',
        width: 300,
        alignSelf: 'center',
        marginTop: 15
    },
    prevText: {
        textAlign: 'center',
        borderWidth: 1,
        width: 100, padding: 10,
        borderRadius: 10
    },
    pageText: {
        textAlign: 'center',
        width: 50,
        padding: 5,
        borderBottomWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    nextText: {
        textAlign: 'center',
        borderWidth: 1,
        width: 100,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#00669B',
        color: 'white'
    },
    indicationBox: {
        width: 35,
        height: 50,
        borderWidth: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
})