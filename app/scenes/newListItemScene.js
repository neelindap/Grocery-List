import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { Body, Button, Container, Content, Icon, Input, Picker, Text } from 'native-base';
import firebase from 'firebase'
import Toast from 'react-native-easy-toast'

const Item = Picker.Item;

export default class NewListItem extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Add New List Item',
        headerStyle: {
            backgroundColor: '#3F51B5'
        },
        headerTintColor: 'white'
    });
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: undefined,
            selected: '',
            userName: [],
            newListItem: '',
        }
    }
    componentWillMount() {
        firebase.database().ref('lists/' + this.props.navigation.state.params.newItemKey + '/users').once('value').then((snap) => {
            var lists = [{ name: "Common", key: "Common" }]
            snap.val().map(function (user) {
                lists.push({
                    name: user.name,
                    key: user.key
                });
            });
            this.setState({
                userName: lists,
                selected: lists[0]
            })
        });
    }
    pickerItems() {
        return this.state.userName.map(function (user) {
            return (
                <Item label={user.name} value={user.name} key={user.key} />
            );
        }, this);
    }
    addListItem() {
        if (this.state.newListItem === '') {
            this.refs.error.show('Please enter the item to be added', 1500);
            return
        }
        if (String.prototype.trim.call(this.state.newListItem) !== "") {
            firebase.database().ref().child("/listItems").push({
                name: this.state.newListItem,
                listRef: this.props.navigation.state.params.newItemKey,
                itemFor: this.state.selected,
                checked: false
            });
            this.setState({ newListItem: '' });
            this.refs.success.show('Item added successfully to list!', 1500);
        }
    }
    onValueChange(value) {
        this.setState({
            selected: value
        });
    }
    updateName(text) {
        this.setState({ newListItem: text });
    }
    render() {
        return (
            <Container >
                <StatusBar
                    backgroundColor="#3F51B5"
                    barStyle="light-content"
                />
                <Content padder>
                    <View padder>
                        <Text>Picking up for: </Text>
                        <Picker
                            supportedOrientations={['portrait', 'landscape']}
                            iosHeader="Select one"
                            mode="dropdown"
                            selectedValue={this.state.selected}
                            onValueChange={this.onValueChange.bind(this)}>
                            {
                                this.pickerItems()
                            }
                        </Picker>
                    </View>
                    <View padder style={{ flexDirection: 'row' }}>
                        <Input placeholder='Item Name'
                            value={this.state.newListItem}
                            onChangeText={(text) => this.updateName(text)}
                            style={{
                                borderColor: 'gray',
                                borderRightWidth: 0,
                                borderLeftWidth: 0,
                                borderTopWidth: 0,
                                borderBottomWidth: 1
                            }}
                            underlineColorAndroid='rgba(0,0,0,0)'
                        />
                        <Button rounded onPress={() => this.addListItem()}>
                            <Icon name="md-add" />
                        </Button>
                    </View>
                </Content>
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
            </Container >
        )
    }
}