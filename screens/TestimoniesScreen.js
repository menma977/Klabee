import React from 'react';
import {
    View,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    Platform,
    Image,
    AsyncStorage,
    Dimensions,
    StyleSheet
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
    Picker,
    Row,
    Col,
    List,
    ListItem,
    Left,
    Right,
    Textarea
} from 'native-base';
import { Camera, Permissions, BarCodeScanner, Location, Icon } from 'expo';
import Header from '../navigation/HeaderNavigationBar';
import Styles from '../constants/Styles';
import Config from '../components/model/Config';
let Configuration = new Config();
import ProcessController from '../components/controller/ProcessController';
import ModalFilterPicker from 'react-native-modal-filter-picker';

const { width } = Dimensions.get( 'window' );

export default class TestimoniesScreen extends React.Component {
    constructor ( props ) {
        super( props );
        this.state = {
            isLoading: true,
            pickerVisible: false,
            isButton: false,
            isCameraPermission: true,
            isLocationPermission: false,
            username: '',
            type: '',
            user: '',
            name: '',
            description: '',
            switchCamera: '',
            pictureData: [],
            client: [],
        };
        AsyncStorage.getItem( 'username', ( error, result ) => {
            if ( result ) {
                this.setState( { username: result } );
            }
        } );
    }

    async getClient () {
        this.state.client = [];
        let data = await ProcessController.prototype.getClient( await AsyncStorage.getItem( 'username' ) );
        data.map( ( value, key ) => {
            this.state.client.push( {
                key: value.User,
                label: value.User,
                name: value.Nama
            } );
        } );
    }

    async componentDidMount () {
        let camera = await Permissions.askAsync( Permissions.CAMERA, Permissions.CAMERA_ROLL );
        this.setState( {
            isCameraPermission: camera.status == 'granted',
            type: Camera.Constants.Type.back
        } );
        if ( !this.state.isCameraPermission ) {
            Configuration.newAlert( 2, "Anda Tidak mengijinkan CAMERA untuk berjalan mohon izinkan CAMERA untuk aktif", 0, "bottom" );
        }
        await this.getClient();
        this.setState( { isLoading: false } )
    }

    async snapPhoto () {
        if ( this.camera ) {
            let options = {
                quality: 0.5,
                base64: true,
                fixOrientation: true,
                exif: true
            };
            await this.camera.takePictureAsync( options ).then( photo => {
                photo.exif.Orientation = 1;
                this.setState( { pictureData: photo } )
            } ).done( () => {
                this.setState( { switchCamera: false } );
                this.setState( { isLoading: false } );
            } );
        }
    }

    async sendData () {
        this.setState( { isLoading: true } );
        let sendImageData = await Configuration.sendImage( this.state.pictureData );
        if ( sendImageData.kode == 0 ) {
            let data = await ProcessController.prototype.Testimonies( this.state.username, this.state.user, this.state.name, this.state.description, sendImageData.taregetFile );
            if ( data.Status == 1 ) {
                Configuration.newAlert( 2, data.Pesan, 0, "bottom" );
                this.setState( { isLoading: false } );
            } else {
                Configuration.newAlert( 1, data.Pesan, 0, "bottom" );
                this.setState( {
                    pictureData: [],
                    user: '',
                    name: '',
                    description: '',
                } );
                this.setState( { isLoading: false } );
            }
        } else {
            Configuration.newAlert( 3, 'Terjadi keslasahan saat mengupload gambar', 0, "bottom" );
            this.setState( { isLoading: false } );
        }
    }

    activationButton () {
        if ( this.state.pictureData.uri && this.state.user && this.state.description != '' ) {
            return ( <Button warning block style={ { flex: 1 } } onPress={ this.sendData.bind( this ) }>
                <Text>Kirim Tes Timoni</Text>
            </Button> );
        } else {
            return ( <Button warning block disabled style={ { flex: 1 } }>
                <Text>Kirim Tes Timoni</Text>
            </Button> );
        }
    }

    onShow = () => {
        this.setState( { pickerVisible: true } );
    }

    onSelect = ( picked ) => {
        var found = this.state.client.find( function ( picked ) {
            return picked;
        } );
        this.setState( { user: picked, name: found.name, pickerVisible: false } )
    }

    onCancel = () => {
        this.setState( { pickerVisible: false } )
    }

    render () {
        const options = this.state.client;
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
        } else if ( this.state.switchCamera ) {
            return (
                <View style={ Styles.container }>
                    <Camera style={ Styles.container } type={ this.state.type } ref={ ( ref ) => { this.camera = ref } }>
                        <View style={ [ Styles.container, Styles.row, Styles.bgTransparent ] }></View>
                        <View style={ [ Styles.row ] }>
                            <TouchableOpacity style={ [ Styles.bgTransparent, Styles.alignItemStart, Styles.justifyContentStart, Styles.container ] } />
                            <TouchableOpacity style={ [ Styles.bgTransparent, Styles.alignItemCenter, Styles.justifyContentCenter, Styles.container ] }
                                onPress={ this.snapPhoto.bind( this ) }>
                                <Icon.Ionicons name='md-aperture' size={ 50 } color='#edba21' />
                            </TouchableOpacity>
                            <TouchableOpacity style={ [ Styles.bgTransparent, Styles.alignItemEnd, Styles.justifyContentEnd, Styles.container ] }
                                onPress={ () => { this.setState( { switchCamera: false } ) } }>
                                <Icon.Ionicons name='md-exit' size={ 50 } color='#edba21' />
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        } else {
            return (
                <KeyboardAvoidingView behavior="padding" style={ {
                    flex: 1
                } }>
                    <Container>
                        <Header { ...this.props } iconName='thumbs-o-up' />
                        <Content padder>
                            <Card>
                                <CardItem header bordered style={ {
                                    backgroundColor: '#69594d'
                                } }>
                                    <Button warning block style={ {
                                        flex: 1,
                                        alignItem: 'center'
                                    } } onPress={ () => { this.setState( { switchCamera: true } ) } }>
                                        <Icon.AntDesign name='camera' size={ 25 } color='#fff' />
                                        <Text>Camera</Text>
                                    </Button>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Image source={ { uri: this.state.pictureData.uri } }
                                            style={ { minHeight: 200, width: '100%', flex: 1, resizeMode: 'contain' } } />
                                    </Body>
                                </CardItem>
                            </Card>
                            <Card>
                                <CardItem header bordered style={ {
                                    backgroundColor: '#69594d'
                                } }>
                                    <Text style={ { color: '#fff' } }>Client</Text>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Row>
                                            <Col>
                                                <Button warning block rounded style={ {
                                                    flex: 1,
                                                    alignItem: 'center'
                                                } } onPress={ this.onShow }>
                                                    <Icon.FontAwesome name='user-circle-o' size={ 25 } color='#fff' />
                                                    <Text>Pilih Client</Text>
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button success block rounded style={ {
                                                    flex: 1,
                                                    alignItem: 'center'
                                                } } onPress={ this.getClient.bind( this ) }>
                                                    <Icon.MaterialIcons name='update' size={ 25 } color='#fff' />
                                                    <Text>Update</Text>
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Text>{ '\n' }</Text>
                                        <Button info block style={ {
                                            flex: 1,
                                            alignItem: 'center'
                                        } }>
                                            <Text>{ this.state.user } ({ this.state.name })</Text>
                                        </Button>
                                        <ModalFilterPicker visible={ this.state.pickerVisible } onSelect={ this.onSelect } onCancel={ this.onCancel } options={ options } />
                                        <Textarea rowSpan={ 5 } bordered placeholder="Isi Testimoni" onChangeText={ ( value ) => { this.setState( { description: value } ) } } style={ { flex: 1, width: '100%' } } />
                                    </Body>
                                </CardItem>
                            </Card>
                            { this.activationButton() }
                        </Content>
                    </Container>
                </KeyboardAvoidingView>
            );
        }
    }
}

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create( {
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    layerTop: {
        flex: 1,
        backgroundColor: opacity
    },
    layerCenter: {
        flex: 1,
        flexDirection: 'row'
    },
    layerLeft: {
        flex: 1,
        backgroundColor: opacity
    },
    focused: {
        flex: 10
    },
    layerRight: {
        flex: 1,
        backgroundColor: opacity
    },
    layerBottom: {
        flex: 1,
        backgroundColor: opacity
    }
} );
