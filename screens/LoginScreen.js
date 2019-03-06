import React from 'react';
import { View, KeyboardAvoidingView, ScrollView, Image, AsyncStorage } from 'react-native';
import {
  Container,
  Content,
  Button,
  Text,
  Spinner,
  Item,
  Form,
  Label,
  Input
} from 'native-base';
import Styles from '../constants/Styles';
import Config from '../components/model/Config';
import LoginController from '../components/controller/LoginController';
import KlabeeModel from '../components/model/KlabeeModel';
import { Icon } from 'expo';
const Configuration = new Config();
const Login = new LoginController();

export default class LoginScreen extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      isLoading: true,
      username: '',
      password: ''
    }
  }

  async componentDidMount () {
    let username = await AsyncStorage.getItem( 'username' );
    let password = await AsyncStorage.getItem( 'password' );
    KlabeeModel.prototype.setUsername( username );
    KlabeeModel.prototype.setPassword( password );
    let data = await Login.DataLogin( username, password );
    if ( data.Status == 0 ) {
      setTimeout( () => {
        this.props.navigation.navigate( 'Home' );
      }, 1000 );
    } else {
      await this.setState( { isLoading: false } );
    }
  }

  async gotToDashboard () {
    this.setState( { isLoading: true } );
    let data = await Login.DataLogin( this.state.username, this.state.password );
    if ( data.Status == 1 ) {
      this.setState( { isLoading: false } );
      Configuration.newAlert( 3, data.Pesan, 5000, "bottom" );
    } else {
      AsyncStorage.setItem( 'username', this.state.username );
      AsyncStorage.setItem( 'password', this.state.password );
      KlabeeModel.prototype.setUsername( this.state.username );
      KlabeeModel.prototype.setPassword( this.state.password );
      this.setState( { username: '', password: '' } )
      setTimeout( () => {
        this.props.navigation.navigate( 'Home' );
      }, 1000 );
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
      return ( <KeyboardAvoidingView behavior="padding" style={ {
        flex: 1
      } }>
        <ScrollView>
          <Container style={ {
            backgroundColor: '#69594d'
          } }>
            <Content contentContainerStyle={ {
              flex: 1,
              paddingTop: 50
            } }>
              <Image source={ require( '../assets/images/icon.png' ) } style={ {
                height: 200,
                width: 200,
                resizeMode: 'contain',
                alignSelf: 'center'
              } } />
              <Form style={ [ Styles.alignItemCenter ] }>
                <Item floatingLabel>
                  <Label style={ [ Styles.colorOrange ] }>Username</Label>
                  <Input style={ Styles.colorOrange } value={ this.state.username } onChangeText={ ( username ) => this.setState( { username } ) } />
                </Item>
                <Item floatingLabel>
                  <Label style={ [ Styles.colorOrange ] }>Password</Label>
                  <Input style={ Styles.colorOrange } onChangeText={ ( password ) => this.setState( { password } ) } secureTextEntry={ true } onSubmitEditing={ this.gotToDashboard.bind( this ) } />
                </Item>
              </Form>
              <Button warning rounded block style={ {
                top: 50
              } } onPress={ this.gotToDashboard.bind( this ) }>
                <Icon.AntDesign name='login' size={ 25 } color='#fff' />
                <Text>Login</Text>
              </Button>
            </Content>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView> );
    }
  }
}
