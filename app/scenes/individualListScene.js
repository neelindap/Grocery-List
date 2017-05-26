import React, { Component } from 'react';
import { Alert } from 'react-native';
import {
    Container,
    Content,
    List,
    ListItem,
    Icon,
    Left,
    Right,
    Text,
    Fab,
    Spinner,
    CheckBox,
    Toast
} from 'native-base';
import firebase from 'firebase'

export default class IndividualList extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.newItem.name}`,
        headerStyle: {
            backgroundColor: '#3F51B5'
        },
        headerTintColor: 'white'
    });
    constructor(props) {
        super(props)
        var user = firebase.auth().currentUser
        this.state = {
            loading: true,
            newListItem: '',
            items: [],
            user: user
        };
    }
    updateName(text) {
        this.setState({ newListItem: text });
    }
    listenForItems() {
        firebase.database().ref().child("/listItems/").on('value', (snap) => {
            var items = [];
            snap.forEach((child) => {
                if (child.val().listRef === this.props.navigation.state.params.newItem.key) {
                    items.push({
                        name: child.val().name,
                        checked: child.val().checked,
                        key: child.key
                    });
                }
            });

            this.setState({
                loading: false,
                items: items
            });

        });
    }
    componentDidMount() {
        this.listenForItems();
    }
    updateCheckBox(key, checked) {
        firebase.database().ref().child("/listItems/" + key).update({
            checked: !checked
        });
    }
    addListItem() {
        this.props.navigation.navigate('NewListItem', { newItemKey: this.props.navigation.state.params.newItem.key })
        /*
        if (this.state.newListItem === '') {
            Alert.alert(
                'Warning',
                'Please enter the list item name to be added',
                [
                    { text: 'OK' }
                ]
            )
            return
        }
        if (String.prototype.trim.call(this.state.newListItem) !== "") {
            firebase.database().ref().child("/listItems").push({
                name: this.state.user.displayName + ' - ' + this.state.newListItem,
                listRef: this.props.navigation.state.params.newItem.key,
                checked: false
            });
            this.setState({ newListItem: '' });
            Alert.alert(
                'Success',
                'List item added sucessfully!',
                [
                    { text: 'OK' }
                ]
            )
        } */
    }
    removeItem(key) {
        firebase.database().ref().child("/listItems/" + key).remove();
        Toast.show({
            supportedOrientations: ['potrait', 'landscape'],
            text: 'List item deleted sucessfully!',
            position: 'bottom',
            duration: 1500,
            type: "success"
        })
    }
    render() {
        if (this.state.loading) {
            return (
                <Container>
                    <Spinner style={{ flex: 1, justifyContent: 'center' }} />
                </Container>
            );
        } else {
            return (
                <Container>
                    <Content>
                        <List dataArray={this.state.items}
                            renderRow={(item) =>
                                <ListItem>
                                    <Left >
                                        <CheckBox checked={item.checked} onPress={() => this.updateCheckBox(item.key, item.checked)} />
                                        <Text style={{ marginLeft: 15 }}>{item.name}</Text>
                                    </Left>
                                    <Right>
                                        <Icon style={{ color: 'red' }} name="ios-remove-circle" onPress={() => this.removeItem(item.key)} />
                                    </Right>
                                </ListItem>
                            }>
                        </List>
                    </Content>
                    <Fab
                        containerStyle={{ width: 20 }}
                        position="bottomRight"
                        onPress={() => this.addListItem()} >
                        <Icon name="md-add" />
                    </Fab>
                </Container>
            );
        }
    }
}