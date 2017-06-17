import React, { Component } from 'react'
import { Image, StyleSheet, Text, AsyncStorage, StatusBar } from 'react-native'
import { View, Spinner } from 'native-base'
import { NavigationActions } from 'react-navigation'

//Settings
import Settings from '../settings'

const settings = new Settings()

export default class SplashScene extends Component {
    static navigationOptions = ({ navigation }) => ({
        header: null
    })
    constructor(props) {
        super(props)
        this.state = {
            store: {
                settings: settings,
            },
            action: 'Login',
        }
        AsyncStorage.getItem('userData', (err, result) => {
            if (result != null) {
                this.setState({ action: 'Lists' })
            }
            this.forward()
        });
    }
    forward() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: this.state.action, returning: true })
            ]
        })
        setTimeout(() => {
            this.props.navigation.dispatch(resetAction)
        }, this.state.store.settings.SplashTime)
    }
    render() {
        return (
            <View style={{
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
                    <Spinner color='white' />
                </View>
            </View>
        )
    }
}