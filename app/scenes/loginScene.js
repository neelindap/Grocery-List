import React, { Component } from 'react';
import { ActivityIndicator, Image, Text, AsyncStorage, TextInput, View, StyleSheet, TouchableHighlight, StatusBar } from 'react-native'
import { Container } from 'native-base';
import firebase from "firebase";
import Toast from 'react-native-easy-toast'

export default class Login extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null
    })

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            loading: false
        }
    }

    render() {
        return (
            <Container style={{
                flex: 1,
                backgroundColor: '#3F51B5',
                padding: 20
            }}>
                <StatusBar
                    backgroundColor="#3F51B5"
                    barStyle="light-content"
                />
                <View style={{
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image style={{
                        height: 100,
                        width: 100
                    }} source={require('../../images/cart.png')} />
                    <Text style={{
                        textAlign: 'center',
                        color: '#FFF'
                    }}>Your weekly Grocery List</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <TextInput style={{
                        padding: 8,
                        height: 40,
                        marginBottom: 20,
                        color: '#fff',
                        paddingHorizontal: 20,
                        paddingVertical: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(255,255,255,0.2)'
                    }}
                        placeholder="Email"
                        placeholderTextColor='rgba(255,255,255,0.7)'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        keyboardType='email-address'
                        onSubmitEditing={() => this.password.focus()}
                        onChangeText={(input) => this.setState({ userName: input })}
                        value={this.state.userName} />
                    <TextInput style={{
                        padding: 8,
                        height: 40,
                        marginBottom: 20,
                        color: '#fff',
                        paddingHorizontal: 20,
                        paddingVertical: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(255,255,255,0.2)'
                    }}
                        placeholder="Password"
                        secureTextEntry
                        placeholderTextColor='rgba(255,255,255,0.7)'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        ref={(input) => this.password = input}
                        onChangeText={(input) => this.setState({ password: input })}
                        value={this.state.password} />
                    <TouchableHighlight onPress={this.login.bind(this)} style={{
                        backgroundColor: '#2980b9',
                        paddingVertical: 10
                    }} underlayColor='#99d9f4'>
                        <View>{this.loadingText()}</View>
                    </TouchableHighlight>
                    <View style={{
                        paddingTop: 5,
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                    }}>
                        <Text style={{ color: '#AAA', fontStyle: 'italic' }}>Not registered yet?    </Text>
                        <TouchableHighlight onPress={this.register.bind(this)} underlayColor='transparent'>
                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Sign Up!</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                <Toast
                    ref="error"
                    style={{ backgroundColor: 'red' }}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
                <Toast
                    ref="success"
                    style={{ backgroundColor: 'green' }}
                    position='bottom'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
            </Container>
        );
    }
    loadingText() {
        if (this.state.loading) {
            return <ActivityIndicator size='small' color='white' />
        }
        else {
            return <Text style={{
                textAlign: 'center',
                color: '#FFF',
                fontWeight: 'bold'
            }}>LOGIN</Text>
        }
    }
    login() {
        this.setState({ loading: true })
        firebase.auth().signInWithEmailAndPassword(this.state.userName, this.state.password).then((userData) => {
            AsyncStorage.setItem('userData', JSON.stringify(userData));
            this.props.navigation.navigate('Lists', { passProps: this.props.navigation.state.params })
        }
        ).catch((error) => {
            this.refs.error.show('Login Failed. Please try again.', 1500);
            this.setState({ loading: false })
        });
    }

    register() {
        this.props.navigation.navigate('Register', { passProps: this.props.navigation.state.params })
    }
}

module.exports = Login;