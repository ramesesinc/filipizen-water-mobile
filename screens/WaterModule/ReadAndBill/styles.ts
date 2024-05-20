import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    backButton: {
        position: 'absolute',
        bottom: 10,
        backgroundColor: "white",
        padding: 10,
        marginBottom: 20,
        width: 150,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    },
    noBatchContainer: {
        flex: 1,
        margin: 30
    },
    goToDownload: {
        position: 'absolute',
        bottom: 60,
        backgroundColor: "#00669B",
        padding: 10,
        width: 150,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    },
    withBatchContainer: {
        flex: 1,
        margin: 30
    },
    select: {
        textAlign: 'center',
        fontSize: 25,
        marginBottom: 20
    },
    view: {
        padding: 5,
        paddingHorizontal: 10,
    },
    batchListitem: {
        padding: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        width: '100%'
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    modal: {
        backgroundColor: 'white',
        height: 200,
        width: 200,
        padding: 20,
        borderRadius: 20,
        justifyContent: 'space-around'
    },
    save: {
        backgroundColor: "green",
        padding: 10,
        width: 70,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    }
})