import React, { Component } from 'react';
import { Image, Text, AsyncStorage, TextInput, View, StyleSheet, TouchableHighlight, ToolbarAndroid } from 'react-native'
import firebase from "firebase";

export default class Login extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null
    })

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: ''
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logoImage} source={require('../../images/cart.png')} />
                    <Text style={styles.logoDescriptionText}>Your weekly Grocery List</Text>
                </View>
                <View style={styles.formContainer}>
                    <TextInput style={styles.input}
                        placeholder="Email"
                        placeholderTextColor='rgba(255,255,255,0.7)'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        onSubmitEditing={() => this.password.focus()}
                        onChangeText={(input) => this.setState({ userName: input })}
                        value={this.state.userName} />
                    <TextInput style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        placeholderTextColor='rgba(255,255,255,0.7)'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        ref={(input) => this.password = input}
                        onChangeText={(input) => this.setState({ password: input })}
                        value={this.state.password} />
                    <TouchableHighlight onPress={this.login.bind(this)} style={styles.button}>
                        <Text style={styles.buttonText}>LOGIN </Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    login() {
        firebase.auth().signInWithEmailAndPassword(this.state.userName, this.state.password).then((userData) => {
            AsyncStorage.setItem('userData', JSON.stringify(userData));
            this.props.navigation.navigate('Lists', { passProps: this.props.navigation.state.params })
        }
        ).catch((error) => {
            this.setState({
                loading: false
            });
            Toast.show({
                supportedOrientations: ['potrait', 'landscape'],
                text: 'Login Failed. Please try again.',
                position: 'bottom',
                duration: 2500,
                type: "danger"
            })
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3F51B5',
        padding: 20
    },
    logoContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        height: 100,
        width: 100
    },
    logoDescriptionText: {
        textAlign: 'center',
        color: '#FFF'
    },
    formContainer: {
        flex: 1,
    },
    input: {
        padding: 8,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 20,
        color: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 0
    },
    button: {
        backgroundColor: '#2980b9',
        paddingVertical: 10
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFF',
        fontWeight: 'bold'
    }
});

module.exports = Login;