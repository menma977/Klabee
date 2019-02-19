import React from 'react';
import {ImageBackground, Text, SafeAreaView, ScrollView, Platform} from 'react-native';
import {createDrawerNavigator, DrawerItems} from 'react-navigation';
import KlabeeModel from '../components/model/KlabeeModel';
import TabBarIcon from '../components/TabBarIcon';
import Styles from '../constants/Styles';
import HomeScreen from '../screens/HomeScreen';
import AddClientScreen from '../screens/AddClientScreen';
import SendBeeScreen from '../screens/SendBeeScreen';
import {View} from 'native-base';
import { Icon } from 'expo';

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
      drawerLabel: 'Home',
      drawerIcon: ({tintColor}) => (
        <Icon.Ionicons name={Platform.OS === 'ios'? `ios-home`: 'md-home'} size={20} style={{color: tintColor}}/>
      )
    }
  },
  AddClient: {
    screen: AddClientScreen,
    navigationOptions: {
      drawerLabel: 'Add Client',
      drawerIcon: ({tintColor}) => (
        <Icon.FontAwesome name={'user-plus'} size={20} style={{color: tintColor}}/>
      )
    }
  },
  SendBee: {
    screen: SendBeeScreen,
    navigationOptions: {
      drawerLabel: 'Kirim Stup',
      drawerIcon: ({tintColor}) => (
        <Icon.FontAwesome name={'archive'} size={20} style={{color: tintColor}}/>
      )
    }
  },
}, {
  initialRouteName: 'Home',
  contentComponent: CustomDrowerNavigator,
  contentOptions: {
    activeBackgroundColor: '#fac956',
    activeTintColor: '#f8f9fa',
    inactiveTintColor: '#fac956',
  }
})
