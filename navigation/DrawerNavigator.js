import React from 'react';
import {
  ImageBackground,
  Text,
  SafeAreaView,
  ScrollView,
  Platform,
  AsyncStorage
} from 'react-native';
import {
  Container,
  Content,
  Button,
  Card,
  CardItem,
} from 'native-base';
import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import Styles from '../constants/Styles';
import HomeScreen from '../screens/HomeScreen';
import AddClientScreen from '../screens/AddClientScreen';
import SendBeeScreen from '../screens/SendBeeScreen';
import CheckBeeScreen from '../screens/CheckBeeScreen';
import BuyBackScreen from '../screens/BuyBackScreen';
import BrokenBoxScreen from '../screens/BrokenBoxScreen';
import EmptyStupScreen from '../screens/EmptyStupScreen';
import KlabeeModel from '../components/model/KlabeeModel';
import RequestDepositScreen from '../screens/RequestDepositScreen';
import { Icon } from 'expo';
import TestimoniesScreen from '../screens/TestimoniesScreen';

const CustomDrowerNavigator = ( props ) => {
  let username = KlabeeModel.prototype.getUsername();
  let balance = String( KlabeeModel.prototype.getBalance() );
  sisa = balance.length % 3,
    rupiah = balance.substr( 0, sisa ),
    ribuan = balance.substr( sisa ).match( /\d{3}/g );
  if ( ribuan ) {
    separator = sisa
      ? '.'
      : '';
    rupiah += separator + ribuan.join( '.' );
  }
  return ( <SafeAreaView style={ [ Styles.container, {
    backgroundColor: '#69594d',
  } ] }>
    <Container style={ {
      backgroundColor: '#69594d',
      top: 20,
    } }>
      <Content>
        <Button warning block style={ {
          flex: 1,
          alignItem: 'center'
        } }>
          <Icon.AntDesign name='user' size={ 25 } color='#fff' />
          <Text> { username }</Text>
        </Button>
        <Button warning block style={ {
          flex: 1,
          alignItem: 'center'
        } }>
          <Icon.MaterialCommunityIcons name='coins' size={ 25 } color='#fff' />
          <Text> Rp.{ rupiah }</Text>
        </Button>
        <ScrollView>
          <DrawerItems { ...props } />
        </ScrollView>
      </Content>
    </Container>
  </SafeAreaView> );
}

export default createDrawerNavigator( {
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      drawerLabel: 'Home',
      drawerIcon: ( { tintColor } ) => ( <Icon.Ionicons name={ Platform.OS === 'ios'
        ? `ios-home`
        : 'md-home' } size={ 20 } style={ {
          color: tintColor
        } } /> )
    }
  },
  AddClient: {
    screen: AddClientScreen,
    navigationOptions: {
      drawerLabel: 'Add Client',
      drawerIcon: ( { tintColor } ) => ( <Icon.FontAwesome name={ 'user-plus' } size={ 20 } style={ {
        color: tintColor
      } } /> )
    }
  },
  SendBee: {
    screen: SendBeeScreen,
    navigationOptions: {
      drawerLabel: 'Penjualan Stup',
      drawerIcon: ( { tintColor } ) => ( <Icon.MaterialCommunityIcons name={ 'coins' } size={ 20 } style={ {
        color: tintColor
      } } /> )
    }
  },
  checkBee: {
    screen: CheckBeeScreen,
    navigationOptions: {
      drawerLabel: 'Check Stup',
      drawerIcon: ( { tintColor } ) => ( <Icon.FontAwesome name={ 'question-circle' } size={ 20 } style={ {
        color: tintColor
      } } /> )
    }
  },
  buyBack: {
    screen: BuyBackScreen,
    navigationOptions: {
      drawerLabel: 'Buy Back',
      drawerIcon: ( { tintColor } ) => ( <Icon.FontAwesome name={ 'refresh' } size={ 20 } style={ {
        color: tintColor
      } } /> )
    }
  },
  BrokenBox: {
    screen: BrokenBoxScreen,
    navigationOptions: {
      drawerLabel: 'Segel Rusak',
      drawerIcon: ( { tintColor } ) => ( <Icon.MaterialIcons name={ 'broken-image' } size={ 20 } style={ {
        color: tintColor
      } } /> )
    }
  },
  EmptyStup: {
    screen: EmptyStupScreen,
    navigationOptions: {
      drawerLabel: 'Stup Kosong',
      drawerIcon: ( { tintColor } ) => ( <Icon.FontAwesome name={ 'dropbox' } size={ 20 } style={ {
        color: tintColor
      } } /> )
    }
  },
  RequestDeposit: {
    screen: RequestDepositScreen,
    navigationOptions: {
      drawerLabel: 'Request Deposit',
      drawerIcon: ( { tintColor } ) => ( <Icon.FontAwesome name={ 'plus' } size={ 20 } style={ {
        color: tintColor
      } } /> )
    }
  },
  Testimonies: {
    screen: TestimoniesScreen,
    navigationOptions: {
      drawerLabel: 'Test Timoni',
      drawerIcon: ( { tintColor } ) => ( <Icon.FontAwesome name={ 'thumbs-o-up' } size={ 20 } style={ {
        color: tintColor
      } } /> )
    }
  }
}, {
    initialRouteName: 'Home',
    contentComponent: CustomDrowerNavigator,
    contentOptions: {
      activeBackgroundColor: '#fac956',
      activeTintColor: '#f8f9fa',
      inactiveTintColor: '#fac956'
    }
  } )
