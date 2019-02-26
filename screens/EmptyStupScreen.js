import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  AsyncStorage,
  Dimensions,
  StyleSheet
} from 'react-native';
import {
  Container,
  Content,
  Item,
  Input,
  Label,
  Spinner,
  Button,
  Text,
  Card,
  CardItem,
  Body,
  Picker,
  Row,
  Col,
  List,
  ListItem,
  Left,
  Right
} from 'native-base';
import {Camera, Permissions, BarCodeScanner, Location, Icon} from 'expo';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';
import Config from '../components/model/Config';
let Configuration = new Config();
import LocationController from '../components/controller/LocationController';
let getLocationController = new LocationController();
import ProcessController from '../components/controller/ProcessController';
import KlabeeModel from '../components/model/KlabeeModel';

const {width} = Dimensions.get('window');

export default class EmptyStupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading           : true,
      isButton            : false,
      isCameraPermission  : true,
      isLocationPermission: false,
      username            : '',
      type                : '',
      user                : '',
      latitude            : '',
      longitude           : '',
      switchCamera        : '',
      switchQRCodeOne     : false,
      switchQRCodeTow     : false,
      codeQROne           : '',
      codeQRTow           : '',
      pictureData         : [],
    };
    AsyncStorage.getItem('username', (error, result) => {
      if (result) {
        this.setState({username: result});
      }
    });
  }

  async componentDidMount() {
    let camera = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    this.setState({
      isCameraPermission: camera.status == 'granted',
      type: Camera.Constants.Type.back
    });
    if (!this.state.isCameraPermission) {
      Configuration.newAlert(2, "Anda Tidak mengijinkan CAMERA untuk berjalan mohon izinkan CAMERA untuk aktif", 0, "bottom");
    }
    this.getLocation = await setInterval(async () => {
      let locationData = await getLocationController.getLocation();
      this.setState({
          isLocationPermission: locationData.isLocationActive,
          latitude: locationData.latitude,
          longitude: locationData.longitude
      })
    }, 10000);
    this.setState({isLoading: false})
  }

  componentWillUnmount() {
    clearInterval(this.getLocation);
  }

  async snapPhoto() {
    if (this.camera) {
      let options = {
        quality: 0.5,
        base64: true,
        fixOrientation: true,
        exif: true
      };
      await this.camera.takePictureAsync(options).then(photo => {
        photo.exif.Orientation = 1;
        this.setState({pictureData: photo})
      }).done(() => {
        this.setState({switchCamera: false});
        this.setState({isLoading: false});
      });
    }
  }

  async handleBarCodeScannedOne({type, data}) {
    this.setState({
      codeQROne: data,
      switchQRCodeOne: false
    });
  }

  async handleBarCodeScannedTow({type, data}) {
    this.setState({
      codeQRTow: data,
      switchQRCodeTow: false
    });
  }

  async sendBarcode() {
    this.setState({isLoading: true});
    let username      = KlabeeModel.prototype.getUsername();
    let sendImageData = await Configuration.sendImage(this.state.pictureData);
    if (sendImageData.kode == 0) {
      let codeQROne = this.state.codeQROne;
      let codeQRTow = this.state.codeQRTow;
      let imageULR = sendImageData.taregetFile;
      let long = this.state.longitude;
      let lat = this.state.latitude;
      let dataQR = await ProcessController.prototype.EmptyStup(codeQROne, codeQRTow, imageULR, long, lat, username);
      if(dataQR.Status == 1) {
        Configuration.newAlert(2, dataQR.Pesan, 0, "bottom");
      } else {
        let username = await AsyncStorage.getItem('username');
        let data = await ProcessController.prototype.Balance(username);
        await AsyncStorage.setItem('balance', data.Saldo);
        await KlabeeModel.prototype.setBalance(data.Saldo);
        await KlabeeModel.prototype.setBalanceBonus(data.Saldobon);
        this.setState({
          codeQROne   : '',
          codeQRTow   : '',
          pictureData : [],
        });
        Configuration.newAlert(1, dataQR.Pesan, 0, "bottom");
      }
      this.setState({isLoading: false});
    } else {
        Configuration.newAlert(3, 'Terjadi keslasahan saat mengupload gambar', 0, "bottom");
        this.setState({isLoading: false});
    }
  }

  seeLocation() {
    if(this.state.isLocationPermission) {
      return (<Button success block style={{
          flex: 1,
          alignItem: 'center'
        }}>
        <Icon.Ionicons name='md-locate' size={25} color='#fff'/>
        <Text>Lokasi Aktif</Text>
      </Button>);
    } else {
      return (<Button danger block style={{
          flex: 1,
          alignItem: 'center'
        }}>
        <Icon.Ionicons name='md-locate' size={25} color='#fff'/>
        <Text>Lokasi belum Aktif</Text>
      </Button>);
    }
  }

  activationButton() {
    if(this.state.isLocationPermission && this.state.codeQROne && this.state.codeQRTow && this.state.pictureData) {
      return (<Button warning block onPress={this.sendBarcode.bind(this)} style={{flex: 1}}>
        <Text>Kirim QRCode</Text>
      </Button>);
    } else {
      return (<Button warning block disabled style={{flex: 1}}>
        <Text>Kirim QRCode</Text>
      </Button>);
    }
  }

  render() {
    if (this.state.isLoading) {
      return (<View style={[
          Styles.container, {
            backgroundColor: '#69594d'
          }
        ]}>
        <View style={[Styles.container, Styles.justifyContentCenter]}>
          <Spinner color='#ffa81d'/>
        </View>
      </View>);
    } else if(this.state.switchCamera) {
      return (
          <View style={Styles.container}>
              <Camera style={Styles.container} type={this.state.type} ref={(ref) => { this.camera = ref }}>
                  <View style={[Styles.container, Styles.row, Styles.bgTransparent]}></View>
                  <View style={[Styles.row]}>
                      <TouchableOpacity style={[Styles.bgTransparent, Styles.alignItemStart, Styles.justifyContentStart, Styles.container]} />
                      <TouchableOpacity style={[Styles.bgTransparent, Styles.alignItemCenter, Styles.justifyContentCenter, Styles.container]}
                          onPress={this.snapPhoto.bind(this)}>
                          <Icon.Ionicons name='md-aperture' size={50} color='#edba21'/>
                      </TouchableOpacity>
                      <TouchableOpacity style={[Styles.bgTransparent, Styles.alignItemEnd, Styles.justifyContentEnd, Styles.container]}
                          onPress={()=>{this.setState({switchCamera: false})}}>
                          <Icon.Ionicons name='md-exit' size={50} color='#edba21'/>
                      </TouchableOpacity>
                  </View>
              </Camera>
          </View>
      );
    } else if (this.state.switchQRCodeOne) {
      return (<BarCodeScanner onBarCodeScanned={this.handleBarCodeScannedOne.bind(this)} style={[StyleSheet.absoluteFill, styles.container]}>
        <View style={styles.layerTop}/>
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft}/>
          <View style={styles.focused}/>
          <View style={styles.layerRight}/>
        </View>
        <View style={styles.layerBottom}>
          <TouchableOpacity style={[Styles.alignItemCenter, Styles.justifyContentCenter, Styles.container]}
            onPress={()=>{this.setState({switchQRCodeOne: false})}}>
            <Icon.Ionicons name='md-exit' size={50} color='#edba21'/>
          </TouchableOpacity>
        </View>
      </BarCodeScanner>);
    } else if (this.state.switchQRCodeTow) {
      return (<BarCodeScanner onBarCodeScanned={this.handleBarCodeScannedTow.bind(this)} style={[StyleSheet.absoluteFill, styles.container]}>
        <View style={styles.layerTop}/>
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft}/>
          <View style={styles.focused}/>
          <View style={styles.layerRight}/>
        </View>
        <View style={styles.layerBottom}>
          <TouchableOpacity style={[Styles.alignItemCenter, Styles.justifyContentCenter, Styles.container]}
            onPress={()=>{this.setState({switchQRCodeTow: false})}}>
            <Icon.Ionicons name='md-exit' size={50} color='#edba21'/>
          </TouchableOpacity>
        </View>
      </BarCodeScanner>);
    } else {
      return (<Container>
        <Header {...this.props} iconName='dropbox'/>
        <Content padder>
          {this.seeLocation(this)}
          <Card>
            <CardItem header bordered style={{
                backgroundColor: '#69594d'
              }}>
              <Button warning block style={{
                  flex: 1,
                  alignItem: 'center'
                }} onPress={()=>{this.setState({switchCamera: true})}}>
                <Icon.AntDesign name='camera' size={25} color='#fff'/>
                <Text>Camera</Text>
              </Button>
            </CardItem>
            <CardItem>
              <Body>
                <Image source={{ uri: this.state.pictureData.uri }}
                    style={{ minHeight: 200, width: '100%', flex: 1, resizeMode: 'contain' }} />
              </Body>
            </CardItem>
          </Card>
          <Card>
            <CardItem header bordered style={{
                backgroundColor: '#69594d'
              }}>
              <Button warning block style={{
                  flex: 1,
                  alignItem: 'center'
                }} onPress={()=>{this.setState({switchQRCodeOne: true})}}>
                <Icon.FontAwesome name='qrcode' size={25} color='#fff'/>
                <Text>QRCode Stup Kosong</Text>
              </Button>
            </CardItem>
            <CardItem>
              <Body>
                <Label>QRCode Stup Kosong : {this.state.codeQROne}</Label>
              </Body>
            </CardItem>
          </Card>
          <Card>
            <CardItem header bordered style={{
                backgroundColor: '#69594d'
              }}>
              <Button warning block style={{
                  flex: 1,
                  alignItem: 'center'
                }} onPress={()=>{this.setState({switchQRCodeTow: true})}}>
                <Icon.FontAwesome name='qrcode' size={25} color='#fff'/>
                <Text>QRCode Stup Pengganti</Text>
              </Button>
            </CardItem>
            <CardItem>
              <Body>
                <Label>QRCode Stup Pengganti : {this.state.codeQRTow}</Label>
              </Body>
            </CardItem>
          </Card>
          {this.activationButton()}
        </Content>
      </Container>);
    }
  }
}

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  layerTop: {
    flex: 1,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row'
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 10
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 1,
    backgroundColor: opacity
  }
});
