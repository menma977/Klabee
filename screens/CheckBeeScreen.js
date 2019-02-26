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

const {width} = Dimensions.get('window');

export default class SendBeeScreen extends React.Component {
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
      switchQRCode: true,
      dataResponQR: []
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
    let dataQR = await ProcessController.prototype.checkBee(data, this.state.username);
    this.setState({dataResponQR: dataQR});
    this.setState({switchQRCode: false});
  }

  validate() {
    if (this.state.dataResponQR.Status == 1) {
      return (<Text>Belum di distribusi atau bukan peternak anda</Text>);
    } else if (this.state.dataResponQR.Status == 0) {
      return (<List style={{
          width: '100%'
        }}>
        <ListItem>
          <Left>
            <Text>Agen</Text>
          </Left>
          <Body>
            <Text>{this.state.dataResponQR.Agen}</Text>
          </Body>
        </ListItem>
        <ListItem>
          <Left>
            <Text>Nama</Text>
          </Left>
          <Body>
            <Text>{this.state.dataResponQR.Nama}</Text>
          </Body>
        </ListItem>
        <ListItem>
          <Left>
            <Text>Username</Text>
          </Left>
          <Body>
            <Text>{this.state.dataResponQR.Username}</Text>
          </Body>
        </ListItem>
        <ListItem>
          <Left>
            <Text>Bulan Ke 1</Text>
          </Left>
          <Body>
            <Text>{this.state.dataResponQR.Bln1}</Text>
          </Body>
        </ListItem>
        <ListItem>
          <Left>
            <Text>Bulan Ke 2</Text>
          </Left>
          <Body>
            <Text>{this.state.dataResponQR.Bln2}</Text>
          </Body>
        </ListItem>
        <ListItem>
          <Left>
            <Text>Bulan Ke 3</Text>
          </Left>
          <Body>
            <Text>{this.state.dataResponQR.Bln3}</Text>
          </Body>
        </ListItem>
      </List>);
    } else {
      return (<Text>Belum scanne stup</Text>);
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
    } else if (this.state.switchQRCode) {
      return (<BarCodeScanner onBarCodeScanned={this.handleBarCodeScanned.bind(this)} style={[StyleSheet.absoluteFill, styles.container]}>
        <Header {...this.props} iconName='question-circle'/>
        <View style={styles.layerTop}/>
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft}/>
          <View style={styles.focused}/>
          <View style={styles.layerRight}/>
        </View>
        <View style={styles.layerBottom}>
          <TouchableOpacity style={[Styles.alignItemCenter, Styles.justifyContentCenter, Styles.container]} onPress={() => {
              this.setState({switchQRCode: false})
            }}>
            <Icon.Ionicons name='md-exit' size={50} color='#edba21'/>
          </TouchableOpacity>
        </View>
      </BarCodeScanner>);
    } else {
      return (<KeyboardAvoidingView style={{
          flex: 1
        }} behavior='padding' enabled>
        <Container>
          <Header {...this.props} iconName='question-circle'/>
          <Content>
            <Button warning block style={{
                flex: 1,
                alignItem: 'center'
              }} onPress={() => {
                this.setState({switchQRCode: true})
              }}>
              <Icon.MaterialCommunityIcons name='qrcode-scan' size={25} color='#fff'/>
              <Text>Scanner</Text>
            </Button>
            <Card>
              <CardItem>
                {this.validate(this)}
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
    backgroundColor: opacity
  }
});
