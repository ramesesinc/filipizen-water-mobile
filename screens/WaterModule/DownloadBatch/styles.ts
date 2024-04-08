import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
        backgroundColor:'white'
    },
    infoContainer: {
        flex: 1,
        alignItems: 'center',
        borderColor: '#00669B',
        margin: 10,
        gap: 15,
    },
    menuText: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    textInput: {
        borderWidth: 1,
        height: 50,
        width: 300,
        padding: 10,
        borderRadius: 10,
        textAlign: 'center'
    },
    downloadButton: {
        borderWidth: 1,
        height: 50,
        backgroundColor: 'green',
        padding: 10,
        paddingHorizontal: 40,
        borderRadius: 10,
        alignItems:'center',
        justifyContent: 'center'
    },
    backButton: {
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
    goToHomeButton : {
        position: 'absolute',
        bottom: 10,
        backgroundColor: "#00669B",
        padding: 10,
        marginBottom: 120,
        width: 250,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    },
    downloadedbackButton: {
        position: 'absolute',
        bottom: 10,
        backgroundColor: "white",
        padding: 10,
        marginBottom: 60,
        width: 250,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey'
    }
})