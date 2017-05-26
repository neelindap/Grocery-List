import React, { Component } from 'react'
import { Image, StyleSheet, Text, AsyncStorage } from 'react-native'
import { View, Spinner } from 'native-base'
import { NavigationActions } from 'react-navigation'

//stores
import SettingsStore from '.././stores/settingsStore'

const settings = new SettingsStore()

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
                NavigationActions.navigate({ routeName: this.state.action })
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