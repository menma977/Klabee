import React from 'react';
import {
    View,
    AsyncStorage,
    KeyboardAvoidingView
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
} from 'native-base';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';
import Config from '../components/model/Config';
import ProcessController from '../components/controller/ProcessController';

export default class RequestDepositScreen extends React.Component {
    constructor ( props ) {
        super( props );
        this.state = {
            isLoading: true,
            isButton: false,
            username: '',
            nominal: '',
        };
        AsyncStorage.getItem( 'username', ( error, result ) => {
            if ( result ) {
                this.setState( { username: result } );
            }
        } );
    }

    async componentDidMount () {
        this.setState( { isLoading: false } )
    }

    async sendDeposit () {
        this.setState( { isLoading: true } )
        if ( this.state.nominal == '' || this.state.nominal == null ) {
            Config.prototype.newAlert( 2, 'tolong isikan nominal terlebih dahulu', 5000, 'top' );
        } else {
            let nominal = this.state.nominal.replace( ',', '' );
            let data = await ProcessController.prototype.ReqDep( nominal.replace( '.', '' ), this.state.username );
            if ( data.Status == 0 ) {
                Config.prototype.newAlert( 1, data.Pesan, 10000, 'top' );
                this.setState( { nominal: '' } );
            } else {
                Config.prototype.newAlert( 2, data.Pesan, 10000, 'top' );
            }
        }
        this.setState( { isLoading: false } )
    }

    render () {
        if ( this.state.isLoading ) {
            return (
                <View style={ [
                    Styles.container, {
                        backgroundColor: '#69594d'
                    }
                ] }>
                    <View style={ [ Styles.container, Styles.justifyContentCenter ] }>
                        <Spinner color='#ffa81d' />
                    </View>
                </View>
            );
        } else {
            return (
                <KeyboardAvoidingView behavior="padding" style={ {
                    flex: 1
                } }>
                    <Container>
                        <Header { ...this.props } iconName='plus' />
                        <Content padder>
                            <Card>
                                <CardItem header warning>
                                    <Text>Permintaan Request Deposit</Text>
                                </CardItem>
                                <CardItem bordered>
                                    <Body>
                                        <Label>Nominal</Label>
                                        <Item regular>
                                            <Input placeholder='Nominal' defaultValue={ this.state.nominal } onChangeText={ ( value ) => { this.setState( { nominal: value } ) } } keyboardType='numeric' autoFocus />
                                        </Item>
                                    </Body>
                                </CardItem>
                                <CardItem footer>
                                    <Button warning block style={ { flex: 1 } } onPress={ this.sendDeposit.bind( this ) }>
                                        <Text>Kirim</Text>
                                    </Button>
                                </CardItem>
                            </Card>
                        </Content>
                    </Container>
                </KeyboardAvoidingView>
            );
        }
    }
}