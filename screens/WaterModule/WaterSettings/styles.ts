import {StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    options: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        padding: 10,
        margin: 20,
        borderRadius: 30,
        width: 300
    },
    optionsText: {
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