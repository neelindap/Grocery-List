import React, { Component } from 'react';
import { Alert, View } from 'react-native';
import { Body, Button, Container, Content, Icon, Input, Picker, Text, Toast } from 'native-base';
import firebase from 'firebase'

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
        var user = firebase.auth().currentUser
        this.state = {
            selectedItem: undefined,
            selected: user.displayName,
            userName: user.displayName,
            newListItem: '',
        }
    }
    addListItem() {
        if (this.state.newListItem === '') {
            Toast.show({
                supportedOrientations: ['potrait', 'landscape'],
                text: 'Please enter the item to be added',
                position: 'bottom',
                duration: 1500,
                type: "warning"
            })
            return
        }
        if (String.prototype.trim.call(this.state.newListItem) !== "") {
            firebase.database().ref().child("/listItems").push({
                name: this.state.newListItem +"("+this.state.selected+")",
                listRef: this.props.navigation.state.params.newItemKey,
                checked: false
            });
            this.setState({ newListItem: '' });
             Toast.show({
                supportedOrientations: ['potrait', 'landscape'],
                text: 'Item added successfully to list!',
                position: 'bottom',
                duration: 1500,
                type: "success"
            })
        }
    }
    onValueChange(value: string) {
        this.setState({
            selected: value
        });
    }
    updateName(text) {
        this.setState({ newListItem: text });
    }
    render() {
        return (
            <Container>
                <Content padder>
                    <View padder>
                        <Text>Picking up for: </Text>
                        <Picker
                            supportedOrientations={['portrait', 'landscape']}
                            iosHeader="Select one"
                            mode="dropdown"
                            selectedValue={this.state.selected}
                            onValueChange={this.onValueChange.bind(this)}>
                            <Item label={this.state.userName} value={this.state.userName} />
                            <Item label="Common" value="Common" />
                        </Picker>
                    </View>
                    <View padder style={{flexDirection: 'row'}}>
                        <Input placeholder='Item Name'
                            value={this.state.newListItem}
                            onChangeText={(text) => this.updateName(text)} />
                        <Button rounded onPress={() => this.addListItem()}>
                            <Icon name="md-add" />
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}