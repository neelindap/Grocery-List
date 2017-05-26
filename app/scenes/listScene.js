import React, { Component } from 'react';
import { Animated, PanResponder, LayoutAnimation, Alert, AsyncStorage } from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    List,
    ListItem,
    Button,
    Left,
    Right,
    Body,
    Icon,
    Text,
    Fab,
    Footer,
    InputGroup,
    Input,
    Spinner,
    Toast
} from 'native-base';
import firebase from 'firebase'
import { NavigationActions } from 'react-navigation'

export default class Lists extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Lists',
        headerLeft: null,
        headerStyle: {
            backgroundColor: '#3F51B5'
        },
        headerTintColor: 'white',
        headerRight: <Button transparent onPress={() => {
            AsyncStorage.setItem('userData', '');
            navigation.navigate('Login');
        }
        }><Icon name='md-log-out' style={{ color: 'white' }} /></Button>
    })
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            newListName: '',
            list: [],
            slideOffset: 0,
            animatedRemove: new Animated.Value(1)
        };
    }
    updateName(text) {
        this.setState({ newListName: text });
    }
    listenForLists() {
        firebase.database().ref().child("lists").on('value', (snap) => {
            var lists = [];
            snap.forEach((child) => {
                lists.push({
                    name: child.val().name,
                    key: child.key
                });
            });
            this.setState({
                loading: false,
                list: lists
            });
        });
    }
    componentDidMount() {
        this.listenForLists();
    }
    componentWillUpdate() {
        const config = {
            duration: 950,
            update: {
                type: 'spring',
                springDamping: 0.4,
            },
        };
        LayoutAnimation.configureNext(config);
    }
    componentWillMount() {
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder:
            (event, gestureState) => gestureState.dx > 0,

            onPanResponderMove: (event, gestureState) => {
                this.setState({ slideOffset: gestureState.dx })
            },

            onPanResponderRelease: (event, gestureState) => {
                if (gestureState.dx < 100) {
                    this.setState({ slideOffset: 0 });
                } else {
                    Animated.timing(this.state.animatedRemove, {
                        duration: 300,
                        toValue: 0,
                    }).start()
                }
            }
        });
    }
    createNewList() {
        if (this.state.newListName === '') {
            Toast.show({
                supportedOrientations: ['potrait', 'landscape'],
                text: 'Please enter the list name to be created',
                position: 'bottom',
                duration: 2000,
                type: "warning"
            })
            return
        }
        if (String.prototype.trim.call(this.state.newListName) !== "") {
            firebase.database().ref().child("/lists").push({
                name: this.state.newListName
            });
            this.setState({ newListName: '' });
            Toast.show({
                supportedOrientations: ['potrait', 'landscape'],
                text: 'New list created successfully!',
                position: 'bottom',
                duration: 1500,
                type: "success"
            })
        }
    }
    listDelete(key) {
        firebase.database().ref().child("/lists/" + key).remove();
        /*(Alert.alert(
            'Success',
            'List item deleted sucessfully!',
            [
                { text: 'OK' }
            ]
        )*/
        Toast.show({
            supportedOrientations: ["potrait", "landscape"],
            text: 'List deleted sucessfully!',
            position: 'bottom',
            duration: 2000,
            type: "success"
        })
    }
    listDetails(listName) {
        this.props.navigation.navigate('IndividualList', { newItem: listName })
    }
    render() {
        const transformStyle = {
            transform: [
                { translateX: this.state.slideOffset },
            ],
            opacity: this.state.animatedRemove.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
            }),
        }
        if (this.state.loading) {
            return (
                <Container>
                    <Content>
                        <Spinner style={{ flex: 1, justifyContent: 'center' }} />
                    </Content>
                </Container>
            );
        } else {
            return (
                <Container>
                    <Content>
                        <List dataArray={this.state.list}
                            renderRow={(item) =>
                                <Animated.View {...this.panResponder.panHandlers} style={transformStyle}>
                                    <ListItem onPress={() => this.listDetails(item)}
                                        onLongPress={() => this.listDelete(item.key)}>
                                        <Text>{item.name}</Text>
                                        <Right>
                                            <Icon name="ios-arrow-forward" style={{ color: 'black' }} />
                                        </Right>
                                    </ListItem>
                                </Animated.View>
                            }>
                        </List>

                    </Content>

                    <Footer style={{ backgroundColor: 'white' }}>
                        <Input placeholder='New List Name'
                            value={this.state.newListName}
                            onChangeText={(text) => this.updateName(text)} />
                        <Button rounded onPress={() => this.createNewList()}>
                            <Icon name="md-add" />
                        </Button>
                    </Footer>
                </Container>
            );
        }
    }
}