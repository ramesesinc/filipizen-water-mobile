import { View, Text, Pressable } from "react-native"
import { styles } from "./styles"
import WaterHeader from "../../../../components/Water/WaterHeader"


const Formula = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <WaterHeader navigation={navigation} backBut="Settings Home" />
            <View style={styles.container}>
                <View style={{ flex: 1 }}>

                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Pressable style={styles.syncButton}>
                        <Text style={{ color: 'white' }}>Sync Formula</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default Formula