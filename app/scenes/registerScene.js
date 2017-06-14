import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TouchableHighlight, StatusBar, Image } from 'react-native';
import { Container } from 'native-base';
import firebase from 'firebase'
import Toast from 'react-native-easy-toast'

var t = require('tcomb-form-native');
var _ = require('lodash');

// clone the default stylesheet
const inputBox = _.cloneDeep(t.form.Form.stylesheet);

// overriding the text color
inputBox.textbox.normal.padding = 8;
inputBox.textbox.normal.height = 40;
inputBox.textbox.normal.backgroundColor = 'rgba(255,255,255,0.2)';
inputBox.textbox.normal.paddingHorizontal = 20;
inputBox.textbox.normal.paddingVertical = 0;
inputBox.textbox.normal.borderRadius = 0;
inputBox.textbox.normal.fontSize = 13;

inputBox.textbox.error.padding = 8;
inputBox.textbox.error.height = 40;
inputBox.textbox.error.backgroundColor = 'rgba(255,255,255,0.2)';
inputBox.textbox.error.paddingHorizontal = 20;
inputBox.textbox.error.paddingVertical = 0;
inputBox.textbox.error.borderRadius = 0;
inputBox.textbox.error.fontSize = 13;

var Form = t.form.Form;

var Person = t.struct({
    name: t.String,
    email_Id: t.String,
    password: t.String,
});

var options = {
    auto: 'placeholders',
    stylesheet: inputBox,
    fields: {
        name: {
            placeholder: 'Name',
            error: 'Please enter your name'
        },
        email_Id: {
            placeholder: 'Email-id/user name',
            error: 'Please enter your email-id/username'
        },
        password: {
            placeholder: 'Password',
            error: 'Please enter a password',
            secureTextEntry: true
        }
    }
};

export default class Register extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Register',
        headerStyle: {
            backgroundColor: '#3F51B5'
        },
        headerTintColor: '#FFF'
    })
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
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
            }}>REGISTER</Text>
        }
    }
    register() {
        var value = this.refs.form.getValue();
        if (value) {
            this.setState({ loading: true })
            firebase.auth().createUserWithEmailAndPassword(value.email_Id, value.password)
                .then((user) => {
                    const userInfo = {
                        "uid": user.uid,
                        "name": value.name,
                    }
                    firebase.database().ref().child("users").child(user.uid).set(userInfo)

                    this.setState({ loading: false })
                    setTimeout(() => { this.props.navigation.goBack() }, 1000)
                })
                .catch(function (error) {
                    if (error != null) {
                        this.refs.error.show('There was an error during user creation. Please try again', 1500);
                        this.setState({ loading: false })
                    }
                });

            firebase.auth().currentUser.updateProfile({
                displayName: value.name,
            }).then(function () {
                this.refs.success.show('Sucessfully regitered!', 1500);
            }, function (error) {
                if (error != null) {
                    this.refs.error.show('There was an error during user creation. Please try again', 1500);
                    this.setState({ loading: false })
                }
            });
        }
    }
    render() {
        return (
            <Container style={{
                flex: 1,
                marginTop: 20,
                padding: 20,
                backgroundColor: '#FFF',
            }}>
                <StatusBar
                    backgroundColor="#3F51B5"
                    barStyle="light-content" />
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image style={{
                        height: 100,
                        width: 100
                    }} source={require('../../images/add-new-user.png')} />
                </View>
                <View style={{ flex: 1 }}>
                    <Form
                        ref="form"
                        type={Person}
                        options={options} />
                    <TouchableHighlight onPress={this.register.bind(this)} style={{
                        height: 36,
                        backgroundColor: '#3F51B5',
                        marginBottom: 10,
                        alignSelf: 'stretch',
                        justifyContent: 'center'
                    }} underlayColor='#99d9f4'>
                        <View>{this.loadingText()}</View>
                    </TouchableHighlight>
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
}