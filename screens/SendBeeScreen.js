import React from 'react';
import {View, KeyboardAvoidingView, ScrollView} from 'react-native';
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
  Picker
} from 'native-base';
import {Icon} from 'expo';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';

export default class SendBeeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: '',
      user: '',
    };
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
                    <Picker mode="dropdown" iosHeader="Pilih User" style={{width: '100%'}} selectedValue={this.state.user}
                      iosIcon={<Icon.FontAwesome name='user-plus'/>} onValueChange={(value) => {this.setState({user: value})}}>
                      <Picker.Item label="Wallet" value="key0"/>
                      <Picker.Item label="ATM Card" value="key1"/>
                      <Picker.Item label="Debit Card" value="key2"/>
                      <Picker.Item label="Credit Card" value="key3"/>
                      <Picker.Item label="Net Banking" value="key4"/>
                    </Picker>
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
