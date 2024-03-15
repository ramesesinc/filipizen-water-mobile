import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
    },
    menuItemContainer: {
        flex: 1,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    moduleItem: {
        height: 150,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center'

    },
    iconStyle: {
        textAlign: 'center',
        padding: 5,
        borderBottomWidth: 1,
        borderColor: '#00669B'
    },
    menuTextStyle: {
        margin: 10,
        color: '#00669B'
    }
})