import React from 'react';
import { View, KeyboardAvoidingView, Image } from 'react-native';
import {
    Container,
    Content,
    Button,
    Text,
    Spinner,
    Item,
    Form,
    Label,
    Input,
} from 'native-base';
import Styles from '../constants/Styles';
import Config from '../components/model/Config';
import LoginController from '../components/controller/LoginController';
import LocationController from '../components/controller/LocationController';
const Configuration = new Config();
const Login = new LoginController();
const getLocationController = new LocationController();

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isLocationActive: false,
            username: '',
            password: '',
            latitude: '',
            longitude: '',
        }
    }

    async componentWillMount() {
        this.setState({ isLoading: false });
    }

    async componentWillUnmount() {
        this.setState({ isLoading: false });
    }

    async isLocationSet() {
        let data = await getLocationController.getLocation();
        if (data.isLocationActive == null) {
            Configuration.newAlert(2, "Anda Tidak mengijinkan GPS untuk berjalan mohon izinkan GPS untuk aktif", 0, "bottom");
        } else if (data.isLocationActive == false) {
            Configuration.newAlert(3, "Tidak ada akses ke GPS Mohon nyalakan GPS anda", 0, "bottom");
        }
        this.setState({
            isLocationActive: data.isLocationActive,
            latitude: data.latitude,
            longitude: data.longitude
        });
    }

    async gotToDashboard() {
        this.setState({ isLoading: true });
        let data = await Login.DataLogin(this.state.username, this.state.password, this.state.longitude, this.state.latitude);
        if (data.Status == 1) {
            this.setState({ isLoading: false });
            Configuration.newAlert(3, data.Pesan, 5000, "bottom");
        } else {
            // DecaReptile.prototype.setUsername(this.state.username);
            // DecaReptile.prototype.setPassword(this.state.password);
            this.setState({
                username: '',
                password: '',
            })
            setTimeout(() => {
                this.props.navigation.navigate('Home');
            }, 1000);
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={Styles.container}>
                    <View style={[Styles.container, Styles.justifyContentCenter]}>
                        <Spinner color='#ffa81d' />
                    </View>
                </View>
            );
        } else {
            this.isLocationSet();
            return (
                <Container style={{ backgroundColor: '#000' }}>
                    <Content contentContainerStyle={{ flex: 1 }}>
                        <KeyboardAvoidingView style={[Styles.container]} behavior="padding" enabled>
                            <Image source={require('../assets/images/logo2.png')}
                                style={{ height: 200, width: 200, resizeMode: 'contain', alignSelf: 'center' }} />
                            <Form style={[Styles.alignItemCenter]}>
                                <Item floatingLabel>
                                    <Label style={[Styles.colorOrange]}>Username</Label>
                                    <Input style={Styles.colorOrange} value={this.state.username}
                                        onChangeText={(username) => this.setState({ username })} />
                                </Item>
                                <Item floatingLabel>
                                    <Label style={[Styles.colorOrange]}>Password</Label>
                                    <Input style={Styles.colorOrange}
                                        onChangeText={(password) => this.setState({ password })}
                                        secureTextEntry={true} onSubmitEditing={this.gotToDashboard.bind(this)} />
                                </Item>
                            </Form>
                            <Button warning rounded block style={{ top: 50 }} onPress={this.gotToDashboard.bind(this)}
                                disabled={this.state.isLocationActive ? false : true} >
                                <Text>Login</Text>
                            </Button>
                        </KeyboardAvoidingView>
                    </Content>
                </Container>
            );
        }
    }
}