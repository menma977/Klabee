import React from 'react';
import {ImageBackground, Text, SafeAreaView, ScrollView, Platform} from 'react-native';
import {createDrawerNavigator, DrawerItems} from 'react-navigation';
import KlabeeModel from '../components/model/KlabeeModel';
import TabBarIcon from '../components/TabBarIcon';
import Styles from '../constants/Styles';
import HomeScreen from '../screens/HomeScreen';
import SendBoxScreen from '../screens/SendBoxScreen';
import VaccineScreen from '../screens/VaccineScreen';
import DeadScreen from '../screens/DeadScreen';
import {View} from 'native-base';

const HeaderPatch = require('../assets/images/icon.png')

const CustomDrowerNavigator = (props) => {
  return (<SafeAreaView style={[Styles.container, {backgroundColor: '#69594d'}]}>
    <ImageBackground style={[
        {
          flex: 1
        },
        Styles.justifyContentCenter,
        Styles.alignItemCenter
      ]} source={HeaderPatch}>
      <View style={{
          backgroundColor: '#c7997870'
        }}>
        <Text style={[
            {
              fontSize: 30,
              fontWeight: 'bold'
            },
            Styles.colorOrange,
            Styles.alignCenter
          ]}>
          {KlabeeModel.prototype.getUsername()}
        </Text>
      </View>
    </ImageBackground>
    <ScrollView>
      <DrawerItems {...props}/>
    </ScrollView>
  </SafeAreaView>);
}

export default createDrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      drawerIcon: ({tintColor}) => (<TabBarIcon name={Platform.OS === 'ios'
          ? `ios-home`
          : 'md-home'} size={25} style={{
          color: tintColor
        }}/>)
    }
  },
  KirimKandang: {
    screen: SendBoxScreen,
    navigationOptions: {
      drawerIcon: ({tintColor}) => (<TabBarIcon name={Platform.OS === 'ios'
          ? `ios-basket`
          : 'md-basket'} size={25} style={{
          color: tintColor
        }}/>)
    }
  },
  Vaksin: {
    screen: VaccineScreen,
    navigationOptions: {
      drawerIcon: ({tintColor}) => (<TabBarIcon name={Platform.OS === 'ios'
          ? `ios-medkit`
          : 'md-medkit'} size={25} style={{
          color: tintColor
        }}/>)
    }
  },
  Mati: {
    screen: DeadScreen,
    navigationOptions: {
      drawerIcon: ({tintColor}) => (<TabBarIcon name={Platform.OS === 'ios'
          ? `ios-pulse`
          : 'md-pulse'} size={25} style={{
          color: tintColor
        }}/>)
    }
  }
}, {
  initialRouteName: 'Home',
  contentComponent: CustomDrowerNavigator,
  contentOptions: {
    activeBackgroundColor: '#fac956',
    activeTintColor: '#f8f9fa',
    inactiveTintColor: '#fac956',
  }
})
