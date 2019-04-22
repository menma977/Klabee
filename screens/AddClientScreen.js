import React from 'react';
import { View, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Spinner,
  Button,
  Text,
  Card,
  CardItem,
  Body,
  Col,
  Row
} from 'native-base';
import { Icon } from 'expo';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';
import Config from '../components/model/Config';
let Configuration = new Config();
import ProcessController from '../components/controller/ProcessController';

export default class AddClientScreen extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      isLoading: true,
      username: '',
      password: '',
      confrimPassword: '',
      name: '',
      address: '',
      email: '',
      hp: '',
      bank: '',
      codeBank: ''
    };
  }

  componentDidMount () {
    this.setState( { isLoading: false } )
  }

  componentWillUnmount () {
    this.setState( { isLoading: true } )
  }

  async onSave () {
    if ( this.state.username == '' ) {
      Configuration.newAlert( 2, "Username tidak boleh kosong", 5000, "top" );
    } else if ( this.state.password == '' || this.state.password != this.state.confrimPassword ) {
      Configuration.newAlert( 2, "Password tidak boleh kosong Atau berbeda dari Konfirmasi Passowrd", 5000, "bottom" );
    } else if ( this.state.name == '' ) {
      Configuration.newAlert( 2, "Nama tidak boleh kosong", 5000, "top" );
    } else if ( this.state.address == '' ) {
      Configuration.newAlert( 2, "Alamat tidak boleh kosong", 5000, "top" );
    } else if ( this.state.email == '' ) {
      Configuration.newAlert( 2, "Email tidak boleh kosong", 5000, "top" );
    } else if ( this.state.hp == '' ) {
      Configuration.newAlert( 2, "No HP tidak boleh kosong", 5000, "top" );
    } else if ( this.state.bank == '' ) {
      Configuration.newAlert( 2, "Bank tidak boleh kosong", 5000, "top" );
    } else if ( this.state.codeBank == '' ) {
      Configuration.newAlert( 2, "No Rekening tidak boleh kosong", 5000, "top" );
    } else {
      let data = await ProcessController.prototype.saveClinet( await AsyncStorage.getItem( 'username' ), this.state.username, this.state.password, this.state.name, this.state.address, this.state.email, this.state.hp, this.state.bank, this.state.codeBank );
      if ( data.Status == 1 ) {
        Configuration.newAlert( 3, data.Pesan, 5000, "top" );
      } else {
        Configuration.newAlert( 1, data.Pesan, 5000, "top" );
      }
    }
  }

  password () {
    if ( this.state.password == this.state.confrimPassword && this.state.password != '' && this.state.confrimPassword != '' ) {
      return ( <View style={ {
        width: '100%'
      } }>
        <Item success>
          <Input style={ Styles.colorOrange } placeholderTextColor='orange' placeholder='Password' value={ this.state.password } onChangeText={ ( value ) => this.setState( { password: value } ) } secureTextEntry={ true } />
        </Item>
        <Item success>
          <Input style={ Styles.colorOrange } placeholderTextColor='orange' placeholder='Konfirmasi Password' value={ this.state.confrimPassword } onChangeText={ ( value ) => this.setState( { confrimPassword: value } ) } secureTextEntry={ true } />
        </Item>
      </View> );
    } else if ( this.state.password != this.state.confrimPassword && this.state.password != '' && this.state.confrimPassword != '' ) {
      return ( <View style={ {
        width: '100%'
      } }>
        <Item error>
          <Input style={ Styles.colorOrange } placeholderTextColor='orange' placeholder='Password' value={ this.state.password } onChangeText={ ( value ) => this.setState( { password: value } ) } secureTextEntry={ true } />
        </Item>
        <Item error>
          <Input style={ Styles.colorOrange } placeholderTextColor='orange' placeholder='Konfirmasi Password' value={ this.state.confrimPassword } onChangeText={ ( value ) => this.setState( { confrimPassword: value } ) } secureTextEntry={ true } />
        </Item>
      </View> );
    } else {
      return ( <View style={ {
        width: '100%'
      } }>
        <Item>
          <Input style={ Styles.colorOrange } placeholderTextColor='orange' placeholder='Password' value={ this.state.password } onChangeText={ ( value ) => this.setState( { password: value } ) } secureTextEntry={ true } />
        </Item>
        <Item>
          <Input style={ Styles.colorOrange } placeholderTextColor='orange' placeholder='Konfirmasi Password' value={ this.state.confrimPassword } onChangeText={ ( value ) => this.setState( { confrimPassword: value } ) } secureTextEntry={ true } />
        </Item>
      </View> );
    }
  }

  render () {
    if ( this.state.isLoading ) {
      return ( <View style={ [
        Styles.container, {
          backgroundColor: '#69594d'
        }
      ] }>
        <View style={ [ Styles.container, Styles.justifyContentCenter ] }>
          <Spinner color='#ffa81d' />
        </View>
      </View> );
    } else {
      return ( <KeyboardAvoidingView style={ {
        flex: 1
      } } behavior='padding' enabled>
        <Container>
          <Header { ...this.props } iconName='user-plus' />
          <Content>
            <Card>
              <CardItem>
                <Body>
                  <Item>
                    <Input style={ Styles.colorOrange } placeholderTextColor='orange' placeholder='Email' value={ this.state.email } onChangeText={ ( value ) => this.setState( { email: value } ) } keyboardType='email-address' />
                  </Item>
                  <Item>
                    <Input style={ Styles.colorOrange } placeholderTextColor='orange' placeholder='Username' value={ this.state.username } onChangeText={ ( value ) => this.setState( { username: value } ) } />
                  </Item>
                  <Item>
                    <Input style={ Styles.colorOrange } placeholderTextColor='orange' placeholder='Nama' value={ this.state.name } onChangeText={ ( value ) => this.setState( { name: value } ) } />
                  </Item>
                  { this.password( this ) }
                  <Item>
                    <Input style={ Styles.colorOrange } placeholderTextColor='orange' placeholder='Telfon yang dapat di hubungi' value={ this.state.hp } onChangeText={ ( value ) => this.setState( { hp: value } ) } keyboardType='phone-pad' />
                  </Item>
                  <Item>
                    <Input style={ Styles.colorOrange } placeholderTextColor='orange' placeholder='Alamat' value={ this.state.address } onChangeText={ ( value ) => this.setState( { address: value } ) } />
                  </Item>
                  <Item>
                    <Input style={ Styles.colorOrange } placeholderTextColor='orange' placeholder='Bank' value={ this.state.bank } onChangeText={ ( value ) => this.setState( { bank: value } ) } />
                  </Item>
                  <Item>
                    <Input style={ Styles.colorOrange } placeholderTextColor='orange' placeholder='No Rekening' value={ this.state.codeBank } onChangeText={ ( value ) => this.setState( { codeBank: value } ) } keyboardType='decimal-pad' />
                  </Item>
                </Body>
              </CardItem>
              <CardItem footer>
                <Button warning block rounded style={ {
                  flex: 1,
                  alignItem: 'center'
                } } onPress={ this.onSave.bind( this ) }>
                  <Icon.FontAwesome name='user-plus' size={ 25 } color='#fff' />
                  <Text>Daftar</Text>
                </Button>
              </CardItem>
            </Card>
          </Content>
        </Container>
      </KeyboardAvoidingView> );
    }
  }
}
