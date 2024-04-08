import { View, Button } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import WaterHeader from '../../../../components/Water/WaterHeader'
import requestLocationPermission from '../../Others/requestLoc'
import Geolocation from 'react-native-geolocation-service';

const Map = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [delta, setDelta] = useState({ latitudeDelta: 0.05, longitudeDelta: 0.05 });

  const mapRef = useRef<MapView>(null)
  const {batchname, coordinate} = route.params;

  useEffect(() => {
    mapRef.current.animateToRegion({...coordinate, latitudeDelta: 0.001, longitudeDelta: 0.001})
  },[])

  const getLocation = () => {
    const result = requestLocationPermission();

    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log("Hello");
            setLocation({
              longitude: position.coords.longitude,
              latitude: position.coords.latitude
            });
            setDelta({ latitudeDelta: 0.001, longitudeDelta: 0.001 })
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    // if (result) {
    //   setLocation({ longitude: 123.91016, latitude: 10.32234 })
    //   setDelta({ latitudeDelta: 0.001, longitudeDelta: 0.001 })
    // }
  }

  return (
    <View style={{ flex: 1 }}>
      <WaterHeader navigation={navigation} backBut="Batch Info" data={{ batchname }}/>
      <View style={{ flex: 1 }}>
        { coordinate && <MapView style={{ height: '100%', width: "100%" }} provider={PROVIDER_GOOGLE} initialRegion={{longitude: 123.91016, latitude: 10.32234, latitudeDelta: 0.001, longitudeDelta: 0.001}} mapType='satellite' minZoomLevel={15} ref={mapRef}>
          <Marker coordinate={coordinate} />
        </MapView>}
      </View>
    </View>
  )
}

export default Map