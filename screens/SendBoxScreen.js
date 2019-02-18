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
    Col,
    Item,
    List,
    ListItem
} from 'native-base';
import { Camera, Permissions, BarCodeScanner, Location } from 'expo';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';
import TabBarIcon from '../components/TabBarIcon';
import Config from '../components/model/Config';
import LocationController from '../components/controller/LocationController';
import DecaReptilesController from '../components/controller/DecaReptilesController';
let Configuration = new Config();
let getLocationController = new LocationController();

export default class SendBoxScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isFocus: true,
            isCameraActive: false,
            isQRCodeActive: false,
            isTakePicture: false,
            camera: '',
            hasCameraPermission: null,
            hasLocationPermission: null,
            type: '',
            pictureUrl: null,
            pictureData: [],
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

    async snapPhoto() {
        if (this.camera) {
            let options = {
                quality: 0.5, base64: true, fixOrientation: true,
                exif: true
            };
            await this.camera.takePictureAsync(options).then(photo => {
                photo.exif.Orientation = 1;
                this.setState({
                    pictureUrl: photo.uri,
                    pictureData: photo,
                })
            }).done(() => {
                this.setState({ isLoading: true });
                this.setCamera();
                this.setState({ isLoading: false });
            });
        }
    }

    handleBarCodeScanned = ({ type, data }) => {
        let arrayData = data.split('id=');
        let found = this.state.QRData.find(function (element) {
            return element == arrayData[1];
        });
        if (found) {
            this.state.QRData.splice(this.state.QRData.indexOf(arrayData[1]), 1);
            this.state.QRData.push(arrayData[1]);
        } else {
            this.state.QRData.push(arrayData[1]);
        }
        this.setState({
            isQRCodeActive: false
        })
    }

    setCamera() {
        this.setState({ isLoading: true })
        if (this.state.isCameraActive) {
            this.setState({
                isCameraActive: false,
            });
            this.setState({ isLoading: false })
        } else {
            this.setState({
                isCameraActive: true
            })
            this.setState({ isLoading: false })
        }
    }

    setQRCode() {
        this.setState({ isLoading: true })
        if (this.state.isQRCodeActive) {
            this.setState({
                isQRCodeActive: false,
            });
            this.setState({ isLoading: false })
        } else {
            this.setState({
                isQRCodeActive: true
            })
            this.setState({ isLoading: false })
        }
    }

    async sendData() {
        this.setState({ isLoading: true });
        let locationData = await getLocationController.getLocation();
        if (locationData.isLocationActive == null) {
            Configuration.newAlert(2, "Anda Tidak mengijinkan GPS untuk berjalan mohon izinkan GPS untuk aktif", 0, "bottom");
        } else if (locationData.isLocationActive == false) {
            Configuration.newAlert(3, "Tidak ada akses ke GPS Mohon nyalakan GPS anda", 0, "bottom");
        } else {
            if (this.state.pictureUrl && this.state.QRData) {
                let sendImageData = await Configuration.sendImage(this.state.pictureData);
                if (sendImageData.kode == 0) {
                    let getDecaData = await DecaReptilesController.prototype.SendBox(
                        this.state.QRData,
                        sendImageData.taregetFile,
                        locationData.latitude,
                        locationData.longitude
                    );
                    if (getDecaData.Status == 0) {
                        this.restartFrame();
                        Configuration.newAlert(1, getDecaData.Pesan, 50000, 'bottom');
                    } else {
                        Configuration.newAlert(2, getDecaData.Pesan, 50000, 'bottom');
                    }
                } else {
                    Configuration.newAlert(3, 'Terjadi keslasahan saat mengupload gambar', 0, "bottom");
                }
            } else {
                Configuration.newAlert(3, 'Tidak ada yang di kirim', 0, "bottom");
            }
        }
        this.setState({ isLoading: false });
    }

    async restartFrame() {
        this.setState({
            isLoading: true,
            isFocus: true,
            isCameraActive: false,
            isQRCodeActive: false,
            isTakePicture: false,
            camera: '',
            // hasCameraPermission: null,
            // hasLocationPermission: null,
            type: '',
            pictureUrl: null,
            pictureData: [],
            QRData: [],
            latitude: '',
            longitude: '',
        })
        await this.componentWillMount();
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={Styles.container}>
                    <Header {...this.props} iconNameIos='ios-basket' iconNameAndroid='md-basket' />
                    <View style={[Styles.container, Styles.justifyContentCenter]}>
                        <Spinner color='#ffa81d' />
                    </View>
                </View>
            );
        } else if (this.state.hasLocationPermission == null) {
            return (
                <View style={Styles.container}>
                    <Header {...this.props} iconNameIos='ios-basket' iconNameAndroid='md-basket' />
                    <View style={[Styles.container, Styles.justifyContentCenter, Styles.alignSelfCenter, Styles.alignItemCenter]}>
                        <Text>GPS Not Running</Text>
                    </View>
                </View>
            );
        } else if (this.state.hasLocationPermission == false) {
            return (
                <View style={Styles.container}>
                    <Header {...this.props} iconNameIos='ios-basket' iconNameAndroid='md-basket' />
                    <View style={[Styles.container, Styles.justifyContentCenter, Styles.alignSelfCenter, Styles.alignItemCenter]}>
                        <Text>No access to GPS</Text>
                    </View>
                </View>
            );
        } else if (this.state.hasCameraPermission == null) {
            return (
                <View style={Styles.container}>
                    <Header {...this.props} iconNameIos='ios-basket' iconNameAndroid='md-basket' />
                    <View style={[Styles.container, Styles.justifyContentCenter, Styles.alignSelfCenter, Styles.alignItemCenter]}>
                        <Text>Camera Not Running</Text>
                    </View>
                </View>
            );
        } else if (this.state.hasCameraPermission == false) {
            return (
                <View style={Styles.container}>
                    <Header {...this.props} iconNameIos='ios-basket' iconNameAndroid='md-basket' />
                    <View style={[Styles.container, Styles.justifyContentCenter, Styles.alignSelfCenter, Styles.alignItemCenter]}>
                        <Text>No access to camera</Text>
                    </View>
                </View>
            );
        } else if (!this.state.isFocus) {
            return <View />;
        } else {
            if (this.state.isCameraActive && !this.state.isQRCodeActive) {
                return (
                    <View style={Styles.container}>
                        <Camera style={Styles.container} type={this.state.type} ref={(ref) => { this.camera = ref }}>
                            <View style={[Styles.container, Styles.row, Styles.bgTransparent]}></View>
                            <View style={[Styles.row]}>
                                <TouchableOpacity style={[Styles.bgTransparent, Styles.alignItemStart, Styles.justifyContentStart, Styles.container]} />
                                <TouchableOpacity style={[Styles.bgTransparent, Styles.alignItemCenter, Styles.justifyContentCenter, Styles.container]}
                                    onPress={this.snapPhoto.bind(this)}>
                                    <TabBarIcon name={Platform.OS === 'ios' ? `ios-aperture` : 'md-aperture'} size={50} style={Styles.colorOrange} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[Styles.bgTransparent, Styles.alignItemEnd, Styles.justifyContentEnd, Styles.container]}
                                    onPress={this.setCamera.bind(this)}>
                                    <TabBarIcon name={Platform.OS === 'ios' ? `ios-exit` : 'md-exit'} size={50} style={Styles.colorOrange} />
                                </TouchableOpacity>
                            </View>
                        </Camera>
                    </View>
                );
            } else if (!this.state.isCameraActive && this.state.isQRCodeActive) {
                return (
                    <View style={Styles.container}>
                        <BarCodeScanner onBarCodeScanned={this.handleBarCodeScanned} style={Styles.container}>
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
            } else {
                return (
                    <Container>
                        <Header {...this.props} iconNameIos='ios-basket' iconNameAndroid='md-basket' />
                        <Content>
                            <Card>
                                <CardItem header bordered style={[Styles.bgOrange]} >
                                    <Left>
                                        <Text style={Styles.colorBlack}>Camera</Text>
                                    </Left>
                                    <Right>
                                        <Button info onPress={this.restartFrame.bind(this)}>
                                            <Text>New</Text>
                                        </Button>
                                    </Right>
                                </CardItem>
                                <CardItem bordered>
                                    <Left>
                                        <Button bordered block warning onPress={this.setCamera.bind(this)}>
                                            <Text>Open Camera</Text>
                                        </Button>
                                    </Left>
                                    <Right>
                                        <Button bordered block warning onPress={this.setQRCode.bind(this)}>
                                            <Text>Open QR Code</Text>
                                        </Button>
                                    </Right>
                                </CardItem>
                                <CardItem footer>
                                    <Body>
                                        <Button bordered block warning onPress={this.sendData.bind(this)}>
                                            <Text>Send Data</Text>
                                        </Button>
                                    </Body>
                                </CardItem>
                            </Card>
                            <Col>
                                <Card>
                                    <CardItem header bordered style={[Styles.bgOrange]} >
                                        <Text style={Styles.colorBlack}>Foto Lokasi</Text>
                                    </CardItem>
                                    <CardItem bordered cardBody>
                                        <Item>
                                            <Image source={{ uri: this.state.pictureUrl }}
                                                style={{ minHeight: 200, width: null, flex: 1, resizeMode: 'contain' }} />
                                        </Item>
                                    </CardItem>
                                </Card>
                            </Col>
                            <Col>
                                <Card>
                                    <CardItem header bordered style={[Styles.bgOrange]} >
                                        <Text style={Styles.colorBlack}>List QR Code</Text>
                                    </CardItem>
                                    <CardItem bordered>
                                        <Body>
                                            <List>
                                                {this.state.QRData.map((value, key) => {
                                                    return (
                                                        <ListItem key={key}>
                                                            <Text>{key + 1}     </Text>
                                                            <Text>               {value}</Text>
                                                        </ListItem>
                                                    )
                                                })}
                                            </List>
                                        </Body>
                                    </CardItem>
                                </Card>
                            </Col>
                        </Content>
                    </Container>
                );
            }
        }
    }
}