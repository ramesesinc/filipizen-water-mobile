import { View, Text, FlatList, Pressable, Alert, TouchableOpacity } from 'react-native'
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

import { styles } from './styles'
import WaterHeader from '../../../components/Water/WaterHeader';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const WaterHome = ({ navigation }) => {
  const menu = [
    { name: 'Download Batch', icon: <Ionicons style={styles.iconStyle} name="download-sharp" size={60} color="#00669B" /> },
    { name: 'Upload Batch', icon: <Ionicons style={styles.iconStyle} name="cloud-upload-sharp" size={60} color="#00669B" /> },
    { name: 'Read & Bill', icon: <Ionicons style={styles.iconStyle} name="reader" size={60} color="#00669B" /> },
    { name: 'Sync Formula', icon: <MaterialIcons style={styles.iconStyle} name="cloud-sync" size={60} color="#00669B" /> },
  ]

  if (menu.length % 2 !== 0) {
    menu.push({
      name: null,
      icon: null,
    })
  }

  const isFocused = useIsFocused()

  const [formula, setFormula] = useState(null);

  useEffect(() => {
    const retrieveFormula = async () => {
      try {
        const formulaString = await AsyncStorage.getItem('formula');
        if (formulaString) {
          setFormula(formulaString)
        }
      } catch (error) {
        alert(error)
      }
    };


    retrieveFormula();
  },[isFocused, formula])

  const handleSync = async () => {
    try {
      const res = await fetch("http://192.168.2.11:8040/osiris3/json/enterprise/WaterConsumptionFormulaService.getFormula");
      const data = await res.json();
      if (data) {
        const tobeFormula = await AsyncStorage.setItem('formula', data.formula.toString());
        setFormula(tobeFormula)
        alert("Bill formula has been synced")
      }
    } catch (e) {
      alert(`FAILED: ${e}`)
    }
  }

  const handleNav = (name : string) => {

    if (name !== "Read & Bill" && name !== "Sync Formula") {
      navigation.navigate(name)
    } else if (name === "Read & Bill" && !formula) {
      // alert("Please sync the bill formula in the settings first!");
      // Alert.alert("Can't open Read & Bill", "Please sync the bill formula in the settings first!",[], {cancelable: true, onDismiss: () => navigation.navigate("Settings")})
      alert("Can't open Read & Bill ,Please sync the bill formula first!")
    } else if(name === "Sync Formula") {
      handleSync()
    } else {
      navigation.navigate(name)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white'}}>
      <WaterHeader navigation={navigation} />
      <View style={styles.container}>
        <FlatList
          data={menu}
          renderItem={(data) =>
            <TouchableOpacity style={styles.menuItemContainer} onPress={() => handleNav(data.item.name)} disabled={data.item.name === null}>
              <View style={styles.moduleItem}>
                {data.item.icon}
                <Text style={styles.menuTextStyle}>{data.item.name}</Text>
              </View>
            </TouchableOpacity>
          }
          keyExtractor={(item) => item.name}
          numColumns={2}
        />
      </View>
    </View>
  )
}

export default WaterHome