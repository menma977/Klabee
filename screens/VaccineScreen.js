import React from 'react';
import { View, TouchableOpacity, Platform, Image } from 'react-native';
import {
    Container,
    Content,
    Button,
    Text,
    Card,
    CardItem,
    Body,
    Spinner,
    Left,
    Right,
    List,
    ListItem
} from 'native-base';
import { Camera, Permissions, BarCodeScanner, Location } from 'expo';
import Config from '../components/model/Config';
import LocationController from '../components/controller/LocationController';
import DecaReptilesController from '../components/controller/DecaReptilesController';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';
import TabBarIcon from '../components/TabBarIcon';
let Configuration = new Config();
let getLocationController = new LocationController();

export default class VaccineScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isFocus: true,
            isQRCodeActive: false,
            camera: '',
            hasCameraPermission: null,
            hasLocationPermission: null,
            type: '',
            QRData: [],
            latitude: '',
            longitude: '',
        }
    }

    async componentWillMount() {
        let camera = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        this.setState({
            hasCameraPermission: camera.status == 'granted',
            type: Camera.Constants.Type.back,
        });
        let locationData = await getLocationController.getLocation();
        this.setState({
            hasLocationPermission: locationData.isLocationActive,
            latitude: locationData.latitude,
            longitude: locationData.longitude
        })
        this.setState({ isLoading: false })
    }

    async sendData({ type, data }) {
        this.setState({ isLoading: true })
        let arrayData = data.split('id=');
        let locationData = await getLocationController.getLocation();
        this.setState({
            hasLocationPermission: locationData.isLocationActive,
            latitude: locationData.latitude,
            longitude: locationData.longitude
        })
        this.setState({ isLoading: false })
        if (this.state.hasLocationPermission) {
            let getDecaData = await DecaReptilesController.prototype.Vaccine(
                arrayData[1],
                this.state.longitude,
                this.state.latitude
            );
            if (getDecaData.Status == 0) {
                Configuration.newAlert(1, getDecaData.Pesan, 0, "bottom");
            } else {
                Configuration.newAlert(2, getDecaData.Pesan, 0, "bottom");
            }
        }
    }

    setQRCode() {
        this.props.navigation.openDrawer();
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={Styles.container}>
                    <Header {...this.props} iconNameIos='ios-medkit' iconNameAndroid='md-medkit' />
                    <View style={[Styles.container, Styles.justifyContentCenter]}>
                        <Spinner color='#ffa81d' />
                    </View>
                </View>
            );
        } else if (this.state.hasLocationPermission == null) {
            return (
                <View style={Styles.container}>
                    <Header {...this.props} iconNameIos='ios-medkit' iconNameAndroid='md-medkit' />
                    <View style={[Styles.container, Styles.justifyContentCenter, Styles.alignSelfCenter, Styles.alignItemCenter]}>
                        <Text>GPS Not Running</Text>
                    </View>
                </View>
            );
        } else if (this.state.hasLocationPermission == false) {
            return (
                <View style={Styles.container}>
                    <Header {...this.props} iconNameIos='ios-medkit' iconNameAndroid='md-medkit' />
                    <View style={[Styles.container, Styles.justifyContentCenter, Styles.alignSelfCenter, Styles.alignItemCenter]}>
                        <Text>No access to GPS</Text>
                    </View>
                </View>
            );
        } else if (this.state.hasCameraPermission == null) {
            return (
                <View style={Styles.container}>
                    <Header {...this.props} iconNameIos='ios-medkit' iconNameAndroid='md-medkit' />
                    <View style={[Styles.container, Styles.justifyContentCenter, Styles.alignSelfCenter, Styles.alignItemCenter]}>
                        <Text>Camera Not Running</Text>
                    </View>
                </View>
            );
        } else if (this.state.hasCameraPermission == false) {
            return (
                <View style={Styles.container}>
                    <Header {...this.props} iconNameIos='ios-medkit' iconNameAndroid='md-medkit' />
                    <View style={[Styles.container, Styles.justifyContentCenter, Styles.alignSelfCenter, Styles.alignItemCenter]}>
                        <Text>No access to camera</Text>
                    </View>
                </View>
            );
        } else if (!this.state.isFocus) {
            return <View />;
        } else {
            return (
                <View style={Styles.container}>
                    <BarCodeScanner onBarCodeScanned={this.sendData.bind(this)} style={Styles.container}>
                        <Header {...this.props} iconNameIos='ios-medkit' iconNameAndroid='md-medkit' />
                        <View style={[Styles.container, Styles.row, Styles.bgTransparent]}></View>
                        <View style={[Styles.row]}>
                            <TouchableOpacity style={[Styles.bgTransparent, Styles.alignItemCenter, Styles.justifyContentCenter, Styles.container]}
                                onPress={this.setQRCode.bind(this)}>
                                <TabBarIcon name={Platform.OS === 'ios' ? `ios-exit` : 'md-exit'} size={50} style={Styles.colorOrange} />
                            </TouchableOpacity>
                        </View>
                    </BarCodeScanner>
                </View>
            );
        }
    }
}