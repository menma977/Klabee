import React from 'react'; ''
import { ImageBackground, Text, SafeAreaView, ScrollView, Platform } from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import DecaReptile from '../components/model/DecaReptile';
import TabBarIcon from '../components/TabBarIcon';
import Styles from '../constants/Styles';
import HomeScreen from '../screens/HomeScreen';
import SendBoxScreen from '../screens/SendBoxScreen';
import VaccineScreen from '../screens/VaccineScreen';
import DeadScreen from '../screens/DeadScreen';
import { View } from 'native-base';

const HeaderPatch = require('../assets/images/Header.jpg')

const CustomDrowerNavigator = (props) => {
    return (
        <SafeAreaView style={[Styles.container, Styles.bgOrange]}>
            <ImageBackground style={[{ height: 70 }, Styles.justifyContentCenter, Styles.alignItemCenter]} source={HeaderPatch} >
                <View style={{ backgroundColor: '#00000030' }}>
                    <Text style={[{ fontSize: 30, fontWeight: 'bold' }, Styles.colorOrange, Styles.alignCenter]}>
                        {DecaReptile.prototype.getUsername()}
                    </Text>
                </View>
            </ImageBackground>
            <ScrollView>
                <DrawerItems {...props} />
            </ScrollView>
        </SafeAreaView>
    );
}

export default createDrawerNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            drawerIcon: () => (<TabBarIcon name={Platform.OS === 'ios' ? `ios-home` : 'md-home'} size={25} style={{ color: '#000000' }} />),
        }
    },
    KirimKandang: {
        screen: SendBoxScreen,
        navigationOptions: {
            drawerIcon: () => (<TabBarIcon name={Platform.OS === 'ios' ? `ios-basket` : 'md-basket'} size={25} style={{ color: '#000000' }} />),
        }
    },
    Vaksin: {
        screen: VaccineScreen,
        navigationOptions: {
            drawerIcon: () => (<TabBarIcon name={Platform.OS === 'ios' ? `ios-medkit` : 'md-medkit'} size={25} style={{ color: '#000000' }} />),
        }
    },
    Mati: {
        screen: DeadScreen,
        navigationOptions: {
            drawerIcon: () => (<TabBarIcon name={Platform.OS === 'ios' ? `ios-pulse` : 'md-pulse'} size={25} style={{ color: '#000000' }} />),
        }
    }
}, {
        initialRouteName: 'Home',
        contentComponent: CustomDrowerNavigator,
        contentOptions: {
            activeBackgroundColor: '#fac956',
            activeTintColor: '#000000'
        }
    }
)