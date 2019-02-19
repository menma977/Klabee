import React from 'react';
import {View, KeyboardAvoidingView, ScrollView} from 'react-native';
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
import {Icon} from 'expo';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';

export default class AddClientScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading      : '',
      username       : '',
      password       : '',
      confrimPassword: '',
      name           : '',
      address        : '',
      email          : '',
      hp             : ''
    };
  }

  password() {
    if (this.state.password == this.state.confrimPassword && this.state.password != '' && this.state.confrimPassword != '') {
      return (<View style={{
          width: '100%'
        }}>
        <Item success="success">
          <Input style={Styles.colorOrange} placeholderTextColor='orange' placeholder='Password' value={this.state.password} onChangeText={(value) => this.setState({password: value})} secureTextEntry={true}/>
        </Item>
        <Item success="success">
          <Input style={Styles.colorOrange} placeholderTextColor='orange' placeholder='Konfirmasi Password' value={this.state.confrimPassword} onChangeText={(value) => this.setState({confrimPassword: value})} secureTextEntry={true}/>
        </Item>
      </View>);
    } else if (this.state.password != this.state.confrimPassword && this.state.password != '' && this.state.confrimPassword != '') {
      return (<View style={{
          width: '100%'
        }}>
        <Item error="error">
          <Input style={Styles.colorOrange} placeholderTextColor='orange' placeholder='Password' value={this.state.password} onChangeText={(value) => this.setState({password: value})} secureTextEntry={true}/>
        </Item>
        <Item error="error">
          <Input style={Styles.colorOrange} placeholderTextColor='orange' placeholder='Konfirmasi Password' value={this.state.confrimPassword} onChangeText={(value) => this.setState({confrimPassword: value})} secureTextEntry={true}/>
        </Item>
      </View>);
    } else {
      return (<View style={{
          width: '100%'
        }}>
        <Item>
          <Input style={Styles.colorOrange} placeholderTextColor='orange' placeholder='Password' value={this.state.password} onChangeText={(value) => this.setState({password: value})} secureTextEntry={true}/>
        </Item>
        <Item>
          <Input style={Styles.colorOrange} placeholderTextColor='orange' placeholder='Konfirmasi Password' value={this.state.confrimPassword} onChangeText={(value) => this.setState({confrimPassword: value})} secureTextEntry={true}/>
        </Item>
      </View>);
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
    } else {
      return (<KeyboardAvoidingView style={{
          flex: 1
        }} behavior='padding' enabled="enabled">
        <ScrollView>
          <Container>
            <Header {...this.props} iconName='user-plus'/>
            <Content>
              <Card>
                <CardItem>
                  <Body>
                    <Item>
                      <Input style={Styles.colorOrange} placeholderTextColor='orange' placeholder='Email' value={this.state.email} onChangeText={(value) => this.setState({email: value})}/>
                    </Item>
                    <Item>
                      <Input style={Styles.colorOrange} placeholderTextColor='orange' placeholder='Username' value={this.state.username} onChangeText={(value) => this.setState({username: value})}/>
                    </Item>
                    {this.password(this)}
                    <Item>
                      <Input style={Styles.colorOrange} placeholderTextColor='orange' placeholder='Telfon yang dapat di hubungi' value={this.state.hp} onChangeText={(value) => this.setState({hp: value})}/>
                    </Item>
                    <Item>
                      <Input style={Styles.colorOrange} placeholderTextColor='orange' placeholder='Alamat' value={this.state.address} onChangeText={(value) => this.setState({address: value})}/>
                    </Item>
                  </Body>
                </CardItem>
                <CardItem footer>
                  <Button warning block rounded style={{
                      flex: 1,
                      alignItem: 'center'
                    }}>
                    <Icon.FontAwesome name='user-plus' size={25} color='#fff'/>
                    <Text>Daftar</Text>
                  </Button>
                </CardItem>
              </Card>
            </Content>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>);
    }
  }
}
