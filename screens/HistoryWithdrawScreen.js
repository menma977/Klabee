import React from "react";
import { AsyncStorage } from "react-native";
import { Container, Content, Card, CardItem, Text, View, Spinner, ListItem, Body, Row, Col } from "native-base";
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';
import Config from '../components/model/Config';
import ProcessController from '../components/controller/ProcessController';

export default class HistoryWithdrawScreen extends React.Component {
    constructor ( props ) {
        super( props );
        this.state = {
            isLoading: true,
            userHistory: [],
        };
    }

    async componentDidMount () {
        let data = await ProcessController.prototype.HistoryWithdraw( await AsyncStorage.getItem( 'username' ) );
        console.log( data );
        data.map( ( value, key ) => {
            if ( value.User != 'Default' ) {
                this.state.userHistory.push( {
                    admin: value.Admin,
                    bank: value.Bank,
                    bonus: value.Bonus,
                    name: value.Nama,
                    accountNumber: value.Norek,
                    date: value.Tgl,
                    transfer: value.Transfer,
                    user: value.User,
                    status: value.Status,
                } );
            }
        } );
        this.setState( { isLoading: false } );
    }

    render () {
        if ( this.state.isLoading ) {
            return (
                <View style={ [ Styles.container, Styles.justifyContentCenter, { backgroundColor: '#69594d' } ] }>
                    <Spinner color='#ffa81d' />
                </View>
            );
        } else {

        }
        return (
            <Container>
                <Header { ...this.props } iconName='history' />
                <Content>
                    <Card>
                        <CardItem header bordered style={ { backgroundColor: '#69594d' } }>
                            <Text style={ { color: '#edba21' } }>History Withdraw</Text>
                        </CardItem>
                        { this.state.userHistory.map( ( item, key ) => {
                            if ( item.status == "Terbayar" ) {
                                return (
                                    <Row key={ key } style={ { backgroundColor: '#4dad4a' } }>
                                        <Col style={ { marginTop: 10 } }>
                                            <Row style={ { marginBottom: 10 } }>
                                                <Col>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                        Username
                                                </Text>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                        { item.user }
                                                    </Text>
                                                </Col>
                                                <Col>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                        Nama
                                                </Text>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                        { item.name }
                                                    </Text>
                                                </Col>
                                            </Row>
                                            <Row style={ { marginBottom: 10 } }>
                                                <Col>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                        Admin
                                                </Text>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                        { item.admin }
                                                    </Text>
                                                </Col>
                                                <Col>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                        Bonus
                                                </Text>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                        { item.bonus }
                                                    </Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col style={ { marginTop: 20, marginBottom: 10 } }>
                                            <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                Bank
                                            </Text>
                                            <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                { item.bank ? item.bank : 'N/A' }
                                            </Text>
                                            <Row>
                                                <Col>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                        Rekening
                                                </Text>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                        { item.accountNumber }
                                                    </Text>
                                                </Col>
                                                <Col>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                        Tanggal
                                                </Text>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                        { item.date }
                                                    </Text>
                                                </Col>
                                            </Row>
                                            <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                Jumlah Transfer
                                            </Text>
                                            <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                { item.transfer }
                                            </Text>
                                        </Col>
                                    </Row>
                                );
                            } else {
                                return (
                                    <Row key={ key } style={ { backgroundColor: '#ce3c3e' } }>
                                        <Col style={ { marginTop: 10 } }>
                                            <Row style={ { marginBottom: 10 } }>
                                                <Col>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                        Username
                                                </Text>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                        { item.user }
                                                    </Text>
                                                </Col>
                                                <Col>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                        Nama
                                                </Text>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                        { item.name }
                                                    </Text>
                                                </Col>
                                            </Row>
                                            <Row style={ { marginBottom: 10 } }>
                                                <Col>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                        Admin
                                                </Text>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                        { item.admin }
                                                    </Text>
                                                </Col>
                                                <Col>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                        Bonus
                                                </Text>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                        { item.bonus }
                                                    </Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                Bank
                                            </Text>
                                            <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                { item.bank ? item.bank : 'N/A' }
                                            </Text>
                                            <Row>
                                                <Col>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                        Rekening
                                                </Text>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                        { item.accountNumber }
                                                    </Text>
                                                </Col>
                                                <Col>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                        Tanggal
                                                </Text>
                                                    <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                        { item.date }
                                                    </Text>
                                                </Col>
                                            </Row>
                                            <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 12 } }>
                                                Jumlah Transfer
                                            </Text>
                                            <Text style={ { color: '#ffffff', textAlign: 'center', fontSize: 15 } }>
                                                { item.transfer }
                                            </Text>
                                        </Col>
                                    </Row>
                                );
                            }
                        } ) }
                    </Card>
                </Content>
            </Container>
        );
    }
}