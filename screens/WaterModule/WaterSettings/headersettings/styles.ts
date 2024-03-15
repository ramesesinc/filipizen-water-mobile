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
    }

})