import React from "react";
import { AsyncStorage, BackHandler } from "react-native";
import { View, Spinner, Container, Card, CardItem, Content, Text, ListItem, Body, Left, Button } from "native-base";
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';
import Config from '../components/model/Config';
import ProcessController from '../components/controller/ProcessController';

export default class UserListScreen extends React.Component {
    constructor ( props ) {
        super( props );
        this.handleBackButtonClick = this.handleBackButtonClick.bind( this );
        this.state = {
            isLoading: true,
            switchView: false,
            client: [],
            //detail Clint
            userClient: '',
            detailStupeClient: [],
        };
    }

    componentWillMount () {
        BackHandler.addEventListener( 'hardwareBackPress', this.handleBackButtonClick );
    }

    componentWillUnmount () {
        BackHandler.removeEventListener( 'hardwareBackPress', this.handleBackButtonClick );
    }

    handleBackButtonClick () {
        this.setState( {
            isLoading: true,
            userClient: '',
            detailStupeClient: [],
        } );
        this.setState( {
            switchView: false,
            isLoading: false,
        } );
        return true;
    }

    async componentDidMount () {
        let data = await ProcessController.prototype.getClient( await AsyncStorage.getItem( 'username' ) );
        data.map( ( value, key ) => {
            if ( value.User != 'Default' ) {
                this.state.client.push( {
                    totalStupe: value.JmlStup,
                    name: value.Nama,
                    username: value.User
                } );
            }
        } );
        this.setState( {
            isLoading: false,
        } )
    }

    async viewDataUser ( value ) {
        if ( value.totalStupe == 0 ) {
            Config.prototype.newAlert( 3, 'Client Tidak Memiliki Stup', 5000, 'top' );
        } else {
            this.setState( {
                isLoading: true,
                userClient: '',
                detailStupeClient: [],
            } );
            let data = await ProcessController.prototype.ListStupe( value.username );
            this.setState( {
                userClient: value.name,
                detailStupeClient: data,
                isLoading: false,
                switchView: true,
            } )
        }
    }

    async onBack () {
        this.setState( {
            isLoading: true,
            userClient: '',
            detailStupeClient: [],
        } );
        this.setState( {
            switchView: false,
            isLoading: false,
        } );
    }

    render () {
        if ( this.state.isLoading ) {
            return (
                <View style={ [ Styles.container, Styles.justifyContentCenter, { backgroundColor: '#69594d' } ] }>
                    <Spinner color='#ffa81d' />
                </View>
            );
        } else {
            if ( this.state.switchView ) {
                return (
                    <Container>
                        <Header { ...this.props } iconName='users' />
                        <Content>
                            <Button full warning onPress={ this.onBack.bind( this ) }><Text> Kembali </Text></Button>
                            <Card>
                                <CardItem header bordered style={ { backgroundColor: '#69594d' } }>
                                    <Text style={ { color: '#edba21' } }>
                                        { this.state.userClient }
                                    </Text>
                                </CardItem>
                                <CardItem cardBody>
                                    <Body>
                                        <ListItem style={ { width: '100%' } }>
                                            <Body>
                                                <Text style={ { color: '#000000', textAlign: 'center' } }>Barcode</Text>
                                            </Body>
                                            <Body>
                                                <Text style={ { color: '#000000', textAlign: 'center' } }>Tanggal Awal</Text>
                                            </Body>
                                        </ListItem>
                                        { this.state.detailStupeClient.map( ( item, key ) => {
                                            if ( item.Barcode != 'Default' ) {
                                                return (
                                                    <ListItem style={ { width: '100%' } } key={ key } onPress={ this.viewDataUser.bind( this, item ) }>
                                                        <Body>
                                                            <Text style={ { color: '#000000', textAlign: 'center', fontSize: 12 } }>
                                                                { item.Barcode }
                                                            </Text>
                                                            <Text style={ { color: '#000000', textAlign: 'center', fontSize: 12 } }>
                                                                Bulan 1 : { item.Bln1 }
                                                            </Text>
                                                            <Text style={ { color: '#000000', textAlign: 'center', fontSize: 12 } }>
                                                                Bulan 2 : { item.Bln2 }
                                                            </Text>
                                                            <Text style={ { color: '#000000', textAlign: 'center', fontSize: 12 } }>
                                                                Bulan 3 : { item.Bln3 }
                                                            </Text>
                                                        </Body>
                                                        <Body>
                                                            <Text style={ { color: '#000000', textAlign: 'center' } }>
                                                                { item.TglAwal }
                                                            </Text>
                                                        </Body>
                                                    </ListItem>
                                                );
                                            }
                                        } ) }
                                    </Body>
                                </CardItem>
                            </Card>
                            <Button full warning onPress={ this.onBack.bind( this ) }><Text> Kembali </Text></Button>
                        </Content>
                    </Container>
                );
            } else {
                return (
                    <Container>
                        <Header { ...this.props } iconName='users' />
                        <Content>
                            <Card>
                                <CardItem header bordered style={ { backgroundColor: '#69594d' } }>
                                    <Text style={ { color: '#edba21' } }>
                                        User List
                                    </Text>
                                </CardItem>
                                <CardItem cardBody>
                                    <Body>
                                        <ListItem style={ { width: '100%' } }>
                                            <Left>
                                                <Text style={ { color: '#000000', textAlign: 'center' } }>
                                                    Nama User
                                                </Text>
                                            </Left>
                                            <Body>
                                                <Text style={ { color: '#000000', textAlign: 'center' } }>
                                                    Jumlah Stup
                                                </Text>
                                            </Body>
                                        </ListItem>
                                        { this.state.client.map( ( item, key ) => {
                                            return (
                                                <ListItem style={ { width: '100%' } } key={ key } onPress={ this.viewDataUser.bind( this, item ) }>
                                                    <Left>
                                                        <Text style={ { color: '#000000', textAlign: 'center' } }>
                                                            { item.name }
                                                        </Text>
                                                    </Left>
                                                    <Body>
                                                        <Text style={ { color: '#000000', textAlign: 'center' } }>
                                                            { item.totalStupe }
                                                        </Text>
                                                    </Body>
                                                </ListItem>
                                            );
                                        } ) }
                                    </Body>
                                </CardItem>
                            </Card>
                        </Content>
                    </Container>
                );
            }
        }
    }
}