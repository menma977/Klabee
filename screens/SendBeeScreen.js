import React from 'react';
import {View, KeyboardAvoidingView, ScrollView, TouchableOpacity, Platform, Image} from 'react-native';
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
import ModalFilterPicker from 'react-native-modal-filter-picker';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';
import Config from '../components/model/Config';
let Configuration = new Config();
import LocationController from '../components/controller/LocationController';
let getLocationController = new LocationController();

export default class SendBeeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isButton: false,
      isCameraPermission: true,
      isLocationPermission: true,
      pickerVisible: false,
      type: '',
      user: '',
      latitude: '',
      longitude: '',
      switchCamera: false,
      switchQRCode: false,
      pictureUrl: null,
      pictureData: [],
      dataQR: [],
    };
  }

  async componentWillMount() {
    let camera = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    this.setState({
      isCameraPermission: camera.status == 'granted',
      type: Camera.Constants.Type.back
    });
    if (!this.state.isCameraPermission) {
      Configuration.newAlert(2, "Anda Tidak mengijinkan CAMERA untuk berjalan mohon izinkan CAMERA untuk aktif", 0, "bottom");
    }
    await setInterval(async () => {
      let locationData = await getLocationController.getLocation();
      this.setState({
          isLocationPermission: locationData.isLocationActive,
          latitude: locationData.latitude,
          longitude: locationData.longitude
      })
    }, 10000);
    this.setState({isLoading: false})
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
        this.setState({pictureUrl: photo.uri, pictureData: photo})
      }).done(() => {
        this.setState({switchCamera: false});
        this.setState({isLoading: false});
      });
    }
  }

  handleBarCodeScanned = ({type, data}) => {
    let found = this.state.dataQR.find(function(element) {
      return element == data;
    });
    if (found) {
      this.state.dataQR.splice(this.state.dataQR.indexOf(data), 1);
      this.state.dataQR.push(data);
    } else {
      this.state.dataQR.push(data);
    }
    this.setState({isQRCodeActive: false});
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

  sendBeeButton() {
    if (this.state.isButton && this.state.isCameraPermission && this.state.isLocationPermission  && this.state.camera != null) {
      return (<Button warning block rounded style={{
          flex: 1,
          alignItem: 'center'
        }}>
        <Icon.MaterialCommunityIcons name='cube-send' size={25} color='#fff'/>
        <Text>kirim Stup</Text>
      </Button>);
    } else {
      return (<Button warning disabled block rounded style={{
          flex: 1,
          alignItem: 'center'
        }}>
        <Icon.MaterialCommunityIcons name='cube-send' size={25} color='#fff'/>
        <Text>kirim Stup</Text>
      </Button>);
    }
  }

  onShow = () => {
    this.setState({pickerVisible: true});
  }

  onSelect = (picked) => {
    this.setState({user: picked, pickerVisible: false})
  }

  onCancel = () => {
    this.setState({pickerVisible: false})
  }

  render() {
    const options = [
      {
        key: 'Wisnu Putra Dewa',
        label: 'Wisnu Putra Dewa'
      }, {
        key: 'uganda',
        label: 'Uganda'
      }, {
        key: 'libya',
        label: 'Libya'
      }, {
        key: 'morocco',
        label: 'Morocco'
      }, {
        key: 'estonia',
        label: 'Estonia'
      }
    ];
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
    } else if(this.state.switchQRCode) {
      return (<View style={Styles.container}>
        <BarCodeScanner onBarCodeScanned={this.handleBarCodeScanned} style={Styles.container}>
            <View style={[Styles.container, Styles.row, Styles.bgTransparent]}></View>
            <View style={[Styles.row]}>
                <TouchableOpacity style={[Styles.bgTransparent, Styles.alignItemCenter, Styles.justifyContentCenter, Styles.container]}
                    onPress={()=>{this.setState({switchQRCode: false})}}>
                    <Icon.Ionicons name='md-exit' size={50} color='#edba21'/>
                </TouchableOpacity>
            </View>
        </BarCodeScanner>
      </View>);
    } else {
      return (<KeyboardAvoidingView style={{
          flex: 1
        }} behavior='padding' enabled>
        <Container>
          <Header {...this.props} iconName='archive'/>
          <Content>
            {this.seeLocation(this)}
            <Card>
              <CardItem>
                <Body>
                  <Button warning block rounded style={{
                      flex: 1,
                      alignItem: 'center'
                    }} onPress={this.onShow}>
                    <Icon.FontAwesome name='user-circle-o' size={25} color='#fff'/>
                    <Text>Pilih Client</Text>
                  </Button>
                  <Text>{'\n'}</Text>
                  <Button info block style={{
                      flex: 1,
                      alignItem: 'center'
                    }}>
                    <Text>{this.state.user}</Text>
                  </Button>
                  <ModalFilterPicker visible={this.state.pickerVisible} onSelect={this.onSelect} onCancel={this.onCancel} options={options}/>
                </Body>
              </CardItem>
              <CardItem footer>
                {this.sendBeeButton(this)}
              </CardItem>
            </Card>
            <Card>
              <CardItem header bordered style={{
                  backgroundColor: '#69594d'
                }}>
                <Left>
                  <Text style={{
                      color: '#edba21'
                    }}>QR Code</Text>
                </Left>
                <Right>
                  <Button warning block rounded style={{
                      flex: 1,
                      alignItem: 'center'
                    }} onPress={()=>{this.setState({switchQRCode: true})}}>
                    <Icon.AntDesign name='qrcode' size={25} color='#fff'/>
                    <Text>QR</Text>
                  </Button>
                </Right>
              </CardItem>
              <CardItem>
                <Body>
                  <List style={{width: '100%'}}>
                    {this.state.dataQR.map((value, key) => {
                      return (<ListItem key={key} style={{justifyContent: 'center'}}>
                        <Text>{value}</Text>
                      </ListItem>);
                    })}
                  </List>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem header bordered style={{
                  backgroundColor: '#69594d'
                }}>
                  <Left>
                    <Text style={{
                        color: '#edba21'
                      }}>Camera</Text>
                  </Left>
                  <Right>
                    <Button warning block rounded style={{
                        flex: 1,
                        alignItem: 'center'
                      }} onPress={()=>{this.setState({switchCamera: true})}}>
                      <Icon.AntDesign name='camera' size={25} color='#fff'/>
                      <Text>Camera</Text>
                    </Button>
                  </Right>
              </CardItem>
              <CardItem>
                <Body>
                  <Image source={{ uri: this.state.pictureUrl }}
                      style={{ minHeight: 200, width: '100%', flex: 1, resizeMode: 'contain' }} />
                </Body>
              </CardItem>
            </Card>
          </Content>
        </Container>
      </KeyboardAvoidingView>);
    }
  }
}
