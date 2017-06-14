import React, { Component } from 'react';
import { StatusBar } from 'react-native';
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
    CheckBox
} from 'native-base';
import firebase from 'firebase'
import Toast from 'react-native-easy-toast'

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
                        itemFor: child.val().itemFor,
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
    }
    removeItem(key) {
        firebase.database().ref().child("/listItems/" + key).remove();
        this.refs.success.show('List item deleted sucessfully!', 1500);
    }
    render() {
        if (this.state.loading) {
            return (
                <Container>
                    <StatusBar
                        backgroundColor="#3F51B5"
                        barStyle="light-content"
                    />
                    <Spinner style={{ flex: 1, justifyContent: 'center' }} />
                </Container>
            );
        } else {
            return (
                <Container>
                    <StatusBar
                        backgroundColor="#3F51B5"
                        barStyle="light-content"
                    />
                    <Content>
                        <List dataArray={this.state.items}
                            renderRow={(item) =>
                                <ListItem>
                                    <Left >
                                        <CheckBox checked={item.checked} onPress={() => this.updateCheckBox(item.key, item.checked)} />
                                        <Text style={{ marginLeft: 15 }}>{item.name} - {item.itemFor}</Text>
                                    </Left>
                                    <Right>
                                        <Icon style={{ color: 'red' }} name="ios-remove-circle" onPress={() => this.removeItem(item.key)} />
                                    </Right>
                                </ListItem>
                            }>
                        </List>
                    </Content>
                    <Fab
                        style={{ backgroundColor: '#3F51B5' }}
                        containerStyle={{ marginRight: 10 }}
                        position="bottomRight"
                        onPress={() => this.addListItem()} >
                        <Icon name="md-add" />
                    </Fab>
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
}