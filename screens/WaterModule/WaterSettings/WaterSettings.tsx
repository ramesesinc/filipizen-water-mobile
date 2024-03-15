import { View, Text, Pressable } from 'react-native'
import { MaterialCommunityIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';


import { styles } from './styles'
import WaterHeader from '../../../components/Water/WaterHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WaterSettings = ({ navigation }) => {


  const handleSync = async () => {
    try {
      const res = await fetch("http://192.168.2.198:3007/formula");
      const data = await res.json();
      if (data) {
        await AsyncStorage.setItem('formula', data.formula);
        alert("Bill formula has been synced")
      }
    } catch (e) {
      alert(`FAILED: ${e}`)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <WaterHeader navigation={navigation} />
      <View style={styles.container}>
        <Pressable style={styles.options} onPress={() => navigation.navigate("Header Settings")}>
          <MaterialCommunityIcons name="printer" size={20} color="#00669B" />
          <Text style={styles.optionsText}>Headers Set-up</Text>
        </Pressable>
        <Pressable style={styles.options} onPress={handleSync}>
          <FontAwesome5 name="sync-alt" size={20} color="#00669B" />
          <Text style={styles.optionsText}>Sync Bill Formula</Text>
        </Pressable>
        <Pressable style={styles.options} onPress={() => navigation.navigate("Login")}>
          <MaterialCommunityIcons name="logout" size={20} color="#00669B" />
          <Text style={styles.optionsText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default WaterSettings