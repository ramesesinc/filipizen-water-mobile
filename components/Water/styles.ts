import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    componentContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        gap: 80,
        backgroundColor: 'white'
    },
    backButContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    etracsLogo: {
        width: 100,
        height: 60,
        marginTop: 10,
        alignSelf: 'center'
    },
    modal: {
        flex: 1,
        paddingHorizontal: 20,
        borderColor: 'grey'
    },
    settingContainer: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    optionsContainer: {
        gap: 20,
        margin: 20
    }
})