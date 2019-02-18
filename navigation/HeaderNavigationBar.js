import React, {Component} from 'react';
import {View, TouchableHighlight, StyleSheet, Platform, AsyncStorage} from 'react-native';
import Styles from '../constants/Styles';
import TabBarIcon from '../components/TabBarIcon';
import KlabeeModel from '../components/model/KlabeeModel';

export default class HeaderNavigationBar extends Component {
  onLogout() {
    AsyncStorage.clear();
    KlabeeModel.prototype.setUsername('');
    KlabeeModel.prototype.setPassword('');
    this.props.navigation.navigate('Login');
  }

  render() {
    return (<View style={{
          height: 70,
          backgroundColor: '#69594d'
        }}>
      <View style={[Styles.container, Styles.row]}>
        <TouchableHighlight style={[styles.sizePerRowHeader, Styles.justifyContentStart, Styles.alignSelfCenter]} onPress={() => {
            this.props.navigation.openDrawer()
          }} underlayColor='#c79978'>
          <TabBarIcon name={Platform.OS === 'ios'
              ? `ios-menu`
              : 'md-menu'} size={25} style={{
              color: '#edba21'
            }}/>
        </TouchableHighlight>
        <View style={[styles.sizePerRowHeader, Styles.justifyContentCenter, Styles.alignSelfCenter]}>
          <TabBarIcon name={Platform.OS === 'ios'
              ? this.props.iconNameIos
              : this.props.iconNameAndroid} size={25} style={{
              color: '#edba21'
            }}/>
        </View>
        <TouchableHighlight style={[styles.sizePerRowHeader, Styles.justifyContentEnd, Styles.alignSelfCenter]} onPress={this.onLogout.bind(this)} underlayColor='#c79978'>
          <TabBarIcon name={Platform.OS === 'ios'
              ? `ios-log-out`
              : 'md-log-out'} size={25} style={{
              color: '#edba21'
            }}/>
        </TouchableHighlight>
      </View>
    </View>);
  }
}

const styles = StyleSheet.create({
  sizePerRowHeader: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
    flexDirection: "row"
  }
});
