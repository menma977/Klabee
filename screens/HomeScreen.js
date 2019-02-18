import React from 'react';
import { WebView, View, ScrollView } from 'react-native';
import {
  Spinner,
} from 'native-base';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={Styles.container}>
          <Header {...this.props} iconNameIos='ios-home' iconNameAndroid='md-home' />
          <View style={[Styles.container, Styles.justifyContentCenter]}>
            <Spinner color='#ffa81d' />
          </View>
        </View>
      );
    }
    return (
      <View style={Styles.container}>
        <Header {...this.props} iconNameIos='ios-home' iconNameAndroid='md-home' />
        <View style={[Styles.container, Styles.justifyContentCenter]}>
          <WebView
            source={{ uri: 'https://decareptiles.com/depanapk/' }}
            style={{ marginTop: 20 }}
          />
        </View>
      </View>
    );
  }
}