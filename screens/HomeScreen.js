import React from 'react';
import {WebView, View, ScrollView, AsyncStorage} from 'react-native';
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
  Right,
  Accordion
} from 'native-base';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';
import ProcessController from '../components/controller/ProcessController';
import KlabeeModel from '../components/model/KlabeeModel';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      username: '',
      balance: '',
      balanceBonus: ''
    }
  }

  async componentDidMount() {
    this.setState({isLoading: true});
    let username = await AsyncStorage.getItem('username');
    let data = await ProcessController.prototype.Balance(username);
    await AsyncStorage.setItem('balance', data.Saldo);
    KlabeeModel.prototype.setBalance(data.Saldo);
    KlabeeModel.prototype.setBalanceBonus(data.Saldobon);
    this.setState({username: username, balance: KlabeeModel.prototype.getBalance(), balanceBonus: KlabeeModel.prototype.getBalanceBonus()});
    this.setState({isLoading: false});
  }

  render() {
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
    let lastBalance = String(KlabeeModel.prototype.getBalanceBonus());
    sisa            = lastBalance.length % 3;
    bonus           = lastBalance.substr(0, sisa);
    ribuan          = lastBalance.substr(sisa).match(/\d{3}/g);
    if (ribuan) {
      separator = sisa
        ? '.'
        : '';
      bonus += separator + ribuan.join('.');
    }
    const dataArray = [
      {
        title: "Add Client",
        content: "Halaman Add Client di gunakan untuk menambah client dengan mengisi data yang sudah di siapkan"
      }, {
        title: "Pejualan Stup",
        content: "1.Pastikan lokasi(GPS) anda aktif dan anda berada di lokasi Client \n\n"+
          "2.Pastikan anda memiliki saldo yang mencukupi \n\n"+
          "3.Scan QRBarcode yang berada pada kotak Stup dengan menekan tombol QR (jika gagal anda harus mescan QRBarcode lagi) \n\n"+
          "4.Pastikan anda memfoto rumah/kandang Stup dengan menekan tombol Camera \n\n"+
          "5.Pilih Client dengan memencet tombol PILIH CLIENT yang berada di bawah camera (jika client belum ada anda bisa memencet tombol UPDATE yang berada di sebelah tombol PILIH CLIENT) \n\n"+
          "6.Setelah semua terisi tombol Kirim Stup akan aktif dan anda bisa mengirim stup ke Client \n\n"
      }, {
        title: "Check Stup",
        content: "Arahkan kamera pada barcode dan status Stup akan muncul dan anda bisa mengulanginya lagi"
      }, {
        title: "Buy Back",
        content: "1.tekan tombol BUKA QRCODE untuk scan barcode yang akan di Buy Back \n\n"+
          "2.Pastikan Code QRnya benar \n\n"+
          "3.Setlah Code Benar tekan tombol KIRIM QRCODE untuk mengirimkan barcode jika sukses bonus anda akan bertambah \n\n"
      }, {
        title: "Segel Rusak",
        content: "1.tekan tombol BUKA QRCODE untuk scan barcode yang segelnya rusak \n\n"+
          "2.Pastikan Code QRnya benar \n\n"+
          "3.Setlah Code Benar tekan tombol KIRIM QRCODE untuk mengirimkan barcode jika sukses QRCode sudah tidak bisa digunakan lagi \n\n"
      }, {
        title: "Stup Kosong",
        content: "1.Pastikan lokasi(GPS) anda aktif dan anda berada di lokasi Client \n\n"+
          "2.Pastikan anda memfoto Stup yang kosong dengan menekan tombol Camera \n\n"+
          "3.tekan tombol QRCODE STUP KOSONG untuk scan barcode stup yang kosong \n\n"+
          "4.tekan tombol QRCODE STUP PENGGANTI untuk scan barcode stup yang menjadi pengganti \n\n"+
          "5.Setelah semua terisi tombol Kirim Stup akan aktif dan anda bisa mengganti Stup dengan menekan tombol KIRIM QRCODE \n\n"
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
    }
    return (<Container>
      <Header {...this.props} iconName='home'/>
      <Content>
        <Card>
          <CardItem header>
            <Text>Data User</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Button warning block>
                <Text>
                  {this.state.username}
                </Text>
              </Button>
              <Text>{'\n'}</Text>
              <Row>
                <Col>
                  <Button info>
                    <Text>
                      Saldo : Rp.{rupiah}
                    </Text>
                  </Button>
                </Col>
                <Col>
                  <Button primary>
                    <Text>
                      Bonus: Rp.{bonus}
                    </Text>
                  </Button>
                </Col>
              </Row>
              <Text>{'\n'}</Text>
              <Button success block onPress={this.componentDidMount.bind(this)}>
                <Text>
                  Refresh
                </Text>
              </Button>
            </Body>
          </CardItem>
        </Card>
        <Text>{'\n'}</Text>
        <Label style={Styles.alignSelfCenter}>Panduan Penggunaan Aplikasi</Label>
        <Text>{'\n'}</Text>
        <Accordion dataArray={dataArray}/>
      </Content>
    </Container>);
  }
}
