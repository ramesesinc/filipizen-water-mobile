import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    infoContainer: {
        flex: 1,
        margin: 10,
        marginBottom: 80,
        gap: 15,
        padding: 20,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.3)'
    },
    pagesContainer: {
        flexDirection: 'row',
    },
    pages: {
        flex: 1,
        textAlign: 'center',
        padding: 10,
        borderBottomWidth: 3,
        borderBottomColor: 'grey',
        marginHorizontal: 5
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
    pendintListitem: {
        padding: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: 10,
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.3)'
    },
    toUpload: {
        marginHorizontal: 20,
        marginBottom: 100
    },
    toUploadTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        padding: 5,
        backgroundColor: '#00669B'
    },
    toBeUploadedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 10
    },
    // for uploading state
    uploading: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        gap: 50
    },
    uploadingContent: {
        flex: 1,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        fontSize: 20
    },
    doneBox: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})