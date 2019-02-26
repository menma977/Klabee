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
import ProcessController from '../components/controller/ProcessController';
import KlabeeModel from '../components/model/KlabeeModel';

const {width} = Dimensions.get('window');

export default class BuyBackScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isButton: false,
      isCameraPermission: true,
      username: '',
      type: '',
      user: '',
      latitude: '',
      longitude: '',
      switchQRCode: false,
      codeQR: ''
    };
    AsyncStorage.getItem('username', (error, result) => {
      if (result) {
        this.setState({username: result});
      }
    });
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
    this.setState({isLoading: false})
  }

  async handleBarCodeScanned({type, data}) {
    this.setState({
      codeQR: data,
      switchQRCode: false
    });
  }

  async sendBarcode() {
    this.setState({isLoading: true});
    let dataQR = await ProcessController.prototype.BuyBack(this.state.codeQR, this.state.username);
    if(dataQR.Status == 1) {
      let username = await AsyncStorage.getItem('username');
      let data = await ProcessController.prototype.Balance(username);
      await AsyncStorage.setItem('balance', data.Saldo);
      await KlabeeModel.prototype.setBalance(data.Saldo);
      await KlabeeModel.prototype.setBalanceBonus(data.Saldobon);
      Configuration.newAlert(2, dataQR.Pesan, 0, "bottom");
    } else {
      Configuration.newAlert(1, dataQR.Pesan, 0, "bottom");
    }
    this.setState({isLoading: false});
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
    } else if (this.state.switchQRCode) {
      return (<BarCodeScanner onBarCodeScanned={this.handleBarCodeScanned.bind(this)} style={[StyleSheet.absoluteFill, styles.container]}>
        <View style={styles.layerTop}/>
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft}/>
          <View style={styles.focused}/>
          <View style={styles.layerRight}/>
        </View>
        <View style={styles.layerBottom}>
          <TouchableOpacity style={[Styles.alignItemCenter, Styles.justifyContentCenter, Styles.container]}
            onPress={()=>{this.setState({switchQRCode: false})}}>
            <Icon.Ionicons name='md-exit' size={50} color='#edba21'/>
          </TouchableOpacity>
        </View>
      </BarCodeScanner>);
    } else {
      let balance = String(KlabeeModel.prototype.getBalanceBonus());
      sisa            = balance.length % 3;
      rupiah          = balance.substr(0, sisa);
      ribuan          = balance.substr(sisa).match(/\d{3}/g);
      if (ribuan) {
        separator = sisa
          ? '.'
          : '';
        rupiah += separator + ribuan.join('.');
      }
      return (<Container>
        <Header {...this.props} iconName='refresh'/>
        <Content padder>
          <Card>
            <CardItem header warning>
              <Left>
                <Text>Buy Back</Text>
              </Left>
              <Right>
                <Text>Bonus : Rp.{rupiah}</Text>
              </Right>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Button success block onPress={()=>{this.setState({switchQRCode: true})}}>
                  <Text>Buka QRCode</Text>
                </Button>
                <Text>{'\n'}</Text>
                <Label>QR Code : {this.state.codeQR}</Label>
              </Body>
            </CardItem>
            <CardItem footer>
              <Button warning block onPress={this.sendBarcode.bind(this)} style={{flex: 1}}>
                <Text>Kirim QRCode</Text>
              </Button>
            </CardItem>
          </Card>
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
