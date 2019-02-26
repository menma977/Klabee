import React from 'react';
import {View, KeyboardAvoidingView, ScrollView, TouchableOpacity, Platform, Image, AsyncStorage, StyleSheet, Dimensions} from 'react-native';
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
import KlabeeModel from '../components/model/KlabeeModel';
import ProcessController from '../components/controller/ProcessController';

const { width } = Dimensions.get('window');

export default class SendBeeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isSell: false,
      isButton: false,
      isCameraPermission: false,
      isLocationPermission: false,
      pickerVisible: false,
      type: '',
      user: '',
      sell: 0,
      latitude: '',
      longitude: '',
      switchCamera: false,
      switchQRCode: false,
      pictureUrl: null,
      pictureData: [],
      dataQR: [],
      client: [],
    };
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
    let username = await AsyncStorage.getItem('username');
    let data     = await ProcessController.prototype.Balance(username);
    await AsyncStorage.setItem('balance', data.Saldo);
    KlabeeModel.prototype.setBalance(data.Saldo);
    await this.getClinet();
    this.setState({isLoading: false})
  }

  componentWillUnmount() {
    clearInterval(this.getLocation);
  }

  async makeNew() {
    this.setState({
      isLoading: true,
      isSell: false,
      isButton: false,
      isCameraPermission: true,
      isLocationPermission: true,
      pickerVisible: false,
      type: '',
      user: '',
      sell: 0,
      latitude: '',
      longitude: '',
      switchCamera: false,
      switchQRCode: false,
      pictureUrl: null,
      pictureData: [],
      dataQR: [],
      client: [],
    });
    await this.componentDidMount(this);
    this.setState({isLoading: false});
  }

  async getClinet() {
    this.state.client = [];
    let data = await ProcessController.prototype.getClient(await AsyncStorage.getItem('username'));
    data.map((value, key) => {
      this.state.client.push({
        key: value.User,
        label: value.User
      });
    });
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

  async handleBarCodeScanned({type, data}) {
    let username    = KlabeeModel.prototype.getUsername().toUpperCase();
    let dataRespone = await ProcessController.prototype.validate(data, username);
    if(dataRespone.Status == 0) {
      if((KlabeeModel.prototype.getBalance() - ((this.state.dataQR.length + 1) * 250000)) < 0) {
        Configuration.newAlert(2, "Saldo anda kurang untuk menambah Stup", 10000, "bottom");
        this.setState({switchQRCode: false});
      } else {
        let found = this.state.dataQR.find(function(element) {
          return element == data;
        });
        if (found) {
          this.state.dataQR.splice(this.state.dataQR.indexOf(data), 1);
          this.state.dataQR.push(data);
        } else {
          this.state.dataQR.push(data);
        }
        this.setState({sell: this.state.dataQR.length * 250000, switchQRCode: false});
      }
    } else {
      Configuration.newAlert(2, "Barcode belum terdafter", 5000, "top");
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

  async sendBee() {
    this.setState({isLoading: true});
    let username      = KlabeeModel.prototype.getUsername().toUpperCase();
    let balance       = String(KlabeeModel.prototype.getBalance() - this.state.sell);
    let sendImageData = await Configuration.sendImage(this.state.pictureData);
    if (sendImageData.kode == 0) {
      let data = await ProcessController.prototype.SendBee(username, this.state.user, this.state.dataQR, sendImageData.taregetFile, this.state.longitude, this.state.latitude, balance);
      if(data.Status == 1) {
        Configuration.newAlert(2, data.Pesan, 0, "bottom");
        this.setState({
          dataQR: [],
          sell: 0,
        });
        this.setState({isSell: false, isLoading: false});
      } else {
        Configuration.newAlert(1, "Berhasil menjual Stup", 0, "bottom");
        this.setState({
          dataQR: [],
          pictureUrl: null,
          user: '',
          sell: 0,
        });
        KlabeeModel.prototype.setBalance(balance);
        this.setState({isSell: false, isLoading: false});
      }
    } else {
        Configuration.newAlert(3, 'Terjadi keslasahan saat mengupload gambar', 0, "bottom");
        this.setState({isSell: false, isLoading: false});
    }
  }

  sendBeeButton() {
    if (this.state.user != '' && this.state.dataQR.length > 0 && this.state.isCameraPermission && this.state.isLocationPermission  && this.state.pictureUrl != null) {
      return (<Button warning block rounded style={{
          flex: 1,
          alignItem: 'center'
        }} onPress={()=>{this.setState({isSell: true})}}>
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
    const options = this.state.client;
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
      return (<BarCodeScanner onBarCodeScanned={this.handleBarCodeScanned.bind(this)} style={[StyleSheet.absoluteFill, styles.container]}>
        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom}>
          <TouchableOpacity style={[Styles.alignItemCenter, Styles.justifyContentCenter, Styles.container]}
            onPress={()=>{this.setState({switchQRCode: false})}}>
            <Icon.Ionicons name='md-exit' size={50} color='#edba21'/>
          </TouchableOpacity>
        </View>
      </BarCodeScanner>);
    } else if(this.state.isSell) {
      // saldo awal
      let balance = String(KlabeeModel.prototype.getBalance());
      sisa            = balance.length % 3;
      rupiah          = balance.substr(0, sisa);
      ribuan          = balance.substr(sisa).match(/\d{3}/g);
      if (ribuan) {
        separator = sisa
          ? '.'
          : '';
        rupiah += separator + ribuan.join('.');
      }
      // saldo akir
      let lastBalance = String(KlabeeModel.prototype.getBalance() - this.state.sell);
      sisa            = lastBalance.length % 3;
      rupiahLast      = lastBalance.substr(0, sisa);
      ribuan          = lastBalance.substr(sisa).match(/\d{3}/g);
      if (ribuan) {
        separator = sisa
          ? '.'
          : '';
        rupiahLast += separator + ribuan.join('.');
      }
      return (<Container>
        <Header {...this.props} iconName='archive'/>
        <Content>
          <Card>
            <CardItem header>
              <Text>Konfrimasi</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Label>Agen :</Label>
                <Text>{KlabeeModel.prototype.getUsername()}</Text>
                <Text>{'\n'}</Text>
                <Label>Client :</Label>
                <Text>{this.state.user}</Text>
                <Text>{'\n'}</Text>
                <Label>Saldo Awal :</Label>
                <Text>Rp.{rupiah}</Text>
                <Text>{'\n'}</Text>
                <Label>Hasil QR Code :</Label>
                <List style={{width: '100%'}}>
                  {this.state.dataQR.map((value, key) => {
                    return (<ListItem key={key} style={{justifyContent: 'center'}}>
                      <Text>{value}</Text>
                    </ListItem>);
                  })}
                </List>
                <Text>{'\n'}</Text>
                <Label>Hasil Foto :</Label>
                <Image source={{ uri: this.state.pictureUrl }} style={{ minHeight: 200, width: '100%', flex: 1, resizeMode: 'contain' }} />
                <Text>{'\n'}</Text>
                <Label>Total Saldo Saat Ini :</Label>
                <Text>Rp.{rupiahLast}</Text>
              </Body>
            </CardItem>
            <CardItem footer>
              <Row>
                <Col>
                  <Button info block rounded style={{
                      flex: 1,
                      alignItem: 'center'
                    }} onPress={()=>{this.setState({isSell: false})}}>
                    <Icon.Ionicons name='ios-arrow-round-back' size={25} color='#fff'/>
                    <Text>kembali</Text>
                  </Button>
                </Col>
                <Col>
                  <Button warning block rounded style={{
                      flex: 1,
                      alignItem: 'center'
                    }} onPress={this.sendBee.bind(this)}>
                    <Icon.MaterialCommunityIcons name='cube-send' size={25} color='#fff'/>
                    <Text>kirim Stup</Text>
                  </Button>
                </Col>
              </Row>
            </CardItem>
         </Card>
        </Content>
      </Container>);
    } else {
      let username = KlabeeModel.prototype.getUsername();
      let balance  = String(KlabeeModel.prototype.getBalance() - this.state.sell);
      sisa         = balance.length % 3,
      rupiah       = balance.substr(0, sisa),
      ribuan       = balance.substr(sisa).match(/\d{3}/g);
      if (ribuan) {
        separator = sisa
          ? '.'
          : '';
        rupiah += separator + ribuan.join('.');
      }
      return (<KeyboardAvoidingView style={{
          flex: 1
        }} behavior='padding' enabled>
        <Container>
          <Header {...this.props} iconName='archive'/>
          <Content>
            {this.seeLocation(this)}
            <Text>{'\n'}</Text>
            <Button warning block style={{
                alignItem: 'center'
              }} onPress={this.makeNew.bind(this)}>
              <Icon.Entypo name='new-message' size={25} color='#fff'/>
              <Text style={{
                  color: '#fff'
                }}>Buat Baru</Text>
            </Button>
            <Text>{'\n'}</Text>
            <Row>
              <Col>
                <Button info block style={{
                    alignItem: 'center'
                  }}>
                  <Icon.AntDesign name='user' size={25} color='#fff'/>
                  <Text style={{
                      color: '#fff'
                    }}> {username}</Text>
                </Button>
              </Col>
              <Col>
                <Button info block style={{
                    alignItem: 'center'
                  }}>
                  <Icon.MaterialCommunityIcons name='coins' size={25} color='#fff'/>
                  <Text style={{
                      color: '#fff'
                    }}> Rp.{rupiah}</Text>
                </Button>
              </Col>
            </Row>
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
            <Card>
              <CardItem>
                <Body>
                  <Row>
                    <Col>
                      <Button warning block rounded style={{
                          flex: 1,
                          alignItem: 'center'
                        }} onPress={this.onShow}>
                        <Icon.FontAwesome name='user-circle-o' size={25} color='#fff'/>
                        <Text>Pilih Client</Text>
                      </Button>
                    </Col>
                    <Col>
                      <Button success block rounded style={{
                          flex: 1,
                          alignItem: 'center'
                        }} onPress={this.getClinet.bind(this)}>
                        <Icon.MaterialIcons name='update' size={25} color='#fff'/>
                        <Text>Update</Text>
                      </Button>
                    </Col>
                  </Row>
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
          </Content>
        </Container>
      </KeyboardAvoidingView>);
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
    backgroundColor: opacity,
  },
});
