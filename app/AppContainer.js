import React, { Component } from 'react';
import {
    AppRegistry
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import ListScene from './scenes/listScene';
import LoginScene from './scenes/loginScene';
import SplashScene from './scenes/splashScene';
import IndividualListScene from './scenes/individualListScene';
import NewListItemScene from './scenes/newListItemScene';

const AppContainer = StackNavigator({
    Splash: { screen: SplashScene },
    Login: { screen: LoginScene },
    Lists: { screen: ListScene },
    IndividualList: { screen: IndividualListScene},
    NewListItem: {screen: NewListItemScene},
},{
    cardStyle: {backgroundColor: 'white'}
});

export default AppContainer;