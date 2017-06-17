import React, { Component } from 'react';
import { View, StatusBar, TouchableOpacity, Text, TextInput } from 'react-native';
import { Body, Button, Container, Content, Icon } from 'native-base';
import firebase from 'firebase'
import Toast from 'react-native-easy-toast'
import Autocomplete from 'react-native-autocomplete-input';

export default class NewList extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Add New List',
        headerStyle: {
            backgroundColor: '#3F51B5'
        },
        headerTintColor: 'white',
        headerRight:
        <View style={{ padding: 5 }}>
            <TouchableOpacity onPress={() => navigation.state.params.handleCreate()}>
                <Text style={{ color: 'white', padding: 5, fontWeight: 'bold' }}>Create</Text>
            </TouchableOpacity>
        </View>
    });
    constructor(props) {
        super(props);
        const currUser = [{
            name: firebase.auth().currentUser.displayName,
            key: firebase.auth().currentUser.uid
        }]
        this.state = {
            query: '',
            users: [],
            newListName: '',
            added: currUser,
            newPerson: ''
        }
    }
    updateName(text) {
        this.setState({ newListName: text });
    }
    componentDidMount() {
        firebase.database().ref().child("users").on('value', (snap) => {
            var lists = [];
            snap.forEach((child) => {
                lists.push({
                    name: child.val().name,
                    key: child.key
                });
            });
            this.setState({
                users: lists
            });
        });
        this.props.navigation.setParams({ handleCreate: this.createNewList.bind(this) });
    }
    addNewPerson() {
        if (this.state.newPerson != '') {
            var person = [] = this.state.added
            person.push({
                name: this.state.newPerson.name,
                key: this.state.newPerson.key
            })
            this.setState({
                added: person,
                newPerson: '',
                query: ''
            })
        }
    }
    removePersonFromList(person) {
        var person = [] = this.state.added.filter(function (p) {
            return p.key !== person.key
        });

        this.setState({
            added: person
        })
    }
    createNewList() {
        if (String.prototype.trim.call(this.state.newListName) === '') {
            this.refs.error.show('Please enter the list name to be created', 2000);
            return
        }

        if (this.state.added.length == 0) {
            this.refs.error.show('Please ', 2000);
            return
        }
        firebase.database().ref().child("/lists").push({
            name: this.state.newListName,
            users: this.state.added
        });
        this.setState({
            newListName: '',
            added: currUser
        });
        this.refs.success.show('List created sucessfully!', 1500);
    }
    printAdded() {
        return this.state.added.map(function (person) {
            var deleteUser = <Icon style={{ color: 'red' }} name="ios-remove-circle" onPress={() => this.removePersonFromList(person)} />
            if (person.key === firebase.auth().currentUser.uid)
                deleteUser = null
            return (
                <View style={{ padding: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text key={person.key} style={{ color: '#000', fontSize: 18 }}>{person.name}</Text>
                    {deleteUser}
                </View>
            );
        }, this);
    }
    _filterData(query) {
        if (query === '') {
            return [];
        }
        const { users } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return users.filter(user => user.name.search(regex) >= 0);
    }
    render() {
        const { query } = this.state;
        const data = this._filterData(query)
        return (
            <Container>
                <StatusBar
                    backgroundColor="#3F51B5"
                    barStyle="light-content"
                />
                <Content padder>
                    <TextInput placeholder='New List Name'
                        value={this.state.newListName}
                        onChangeText={(text) => this.updateName(text)}
                        style={{
                            borderColor: 'gray',
                            borderRightWidth: 0,
                            borderLeftWidth: 0,
                            borderTopWidth: 0,
                            borderBottomWidth: 1
                        }} />
                    <View padder style={{ flexDirection: 'row', paddingTop: 5 }}>
                        <Autocomplete
                            data={data}
                            defaultValue={query}
                            underlineColorAndroid='white'
                            inputContainerStyle={{
                                borderColor: 'gray',
                                borderRightWidth: 0,
                                borderLeftWidth: 0,
                                borderTopWidth: 0,
                                borderBottomWidth: 1
                            }}
                            placeholder='Person to be added'
                            onChangeText={text => this.setState({ query: text })}
                            renderItem={({ name, key }) => (
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        query: name,
                                        newPerson: {
                                            name,
                                            key
                                        }
                                    });
                                }
                                }>
                                    <Text>{name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <Button rounded onPress={() => this.addNewPerson()}>
                            <Icon name="md-add" />
                        </Button>
                    </View>
                    <View style={{ marginTop: 25 }}>
                        <Text style={{ color: 'black', fontSize: 20 }}>People with access to the list</Text>
                        {this.state.added.length > 0 ? (
                            this.printAdded()
                        ) : (
                                <Text style={{ textAlign: 'center' }}>
                                    No people present in the list yet.
                                </Text>
                            )}
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
            </Container>
        )
    }
}