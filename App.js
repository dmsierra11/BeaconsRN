/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

'use strict';

import React, {
  Component
}                             from 'react';
import {
  Platform,
  AppRegistry,
  StyleSheet,
  View,
  Text,
  ListView,
  DeviceEventEmitter
}                             from 'react-native';
import Beacons                from 'react-native-beacons-manager';
// import BluetoothState         from 'react-native-bluetooth-state';

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    // Create our dataSource which will be displayed in the ListView
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2 }
    );
    this.state = {
      bluetoothState: '',
      // region information
      identifier: 'GemTot for iOS',
      uuid: '6665542b-41a1-5e00-931c-6a82db9b78c1',
      // React Native ListView datasource initialization
      dataSource: ds.cloneWithRows([])
    };
  }

  componentWillMount(){
    //
    // ONLY non component state aware here in componentWillMount
    //
    // Request for authorization while the app is open
    Beacons.requestWhenInUseAuthorization();
    // Define a region which can be identifier + uuid,
    // identifier + uuid + major or identifier + uuid + major + minor
    // (minor and major properties are numbers)
    const regionIBeacon = {
      identifier: 'GemTot for iOS',
      // uuid: '00000000-0000-0000-0000-00000000000b', // => IMPORTANT: replace here with your beacon "uuid"
      uuid: '1ecc80bd-4229-4865-a666-6577fad30496'
    };
    const regionEddy = {
      identifier: 'Apple Watch',
      uuid: '41573219-B028-21D8-790A-60A304C425A1' // => IMPORTANT: replace here with your beacon "uuid"
    };
    // Range for iBeacons inside the region
    Beacons.startRangingBeaconsInRegion(regionIBeacon);
  }

  componentDidMount() {
    // Ranging: Listen for beacon changes
    this.beaconsDidRange = Beacons.BeaconsEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data.beacons)
        });
        console.log("Data: "+JSON.stringify(data))
        console.log("Beacon: "+JSON.stringify(data.beacons))
      }
    );
  }

  componentWillUnMount(){
    this.beaconsDidRange = null;
  }

  render() {
    const { bluetoothState, dataSource } =  this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.btleConnectionStatus}>
          Bluetooth connection status: { bluetoothState ? bluetoothState  : 'NA' }
        </Text>
        <Text style={styles.headline}>
          All beacons in the area
        </Text>
        <ListView
          dataSource={ dataSource }
          enableEmptySections={ true }
          renderRow={this.renderRow}
        />
      </View>
    );
  }

  renderRow = rowData => {
    return (
      <View style={styles.row}>
        <Text style={styles.smallText}>
          UUID: {rowData.uuid ? rowData.uuid  : 'NA'}
        </Text>
        <Text style={styles.smallText}>
          Major: {rowData.major ? rowData.major : 'NA'}
        </Text>
        <Text style={styles.smallText}>
          Minor: {rowData.minor ? rowData.minor : 'NA'}
        </Text>
        <Text>
          RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
        </Text>
        <Text>
          Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
        </Text>
        <Text>
          Distance: {rowData.accuracy ? rowData.accuracy.toFixed(2) : 'NA'}m
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  btleConnectionStatus: {
    fontSize: 20,
    paddingTop: 20
  },
  headline: {
    fontSize: 20,
    paddingTop: 20
  },
  row: {
    padding: 8,
    paddingBottom: 16
  },
    smallText: {
    fontSize: 11
  }
});