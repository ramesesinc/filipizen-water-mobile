import {StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    titleBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        textAlign: 'center',
        fontSize: 20
    },
    header: {
        marginHorizontal: 30,
        padding: 10,
        borderBottomWidth: 1,
        flexDirection: 'row'
    },
    editContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    editBox: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 10
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