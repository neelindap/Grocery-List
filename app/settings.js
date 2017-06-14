import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyDic72yczOGwxlANfKXwjCfFzLafgvQacY",
    authDomain: "groceryshoppinglist-79cb1.firebaseapp.com",
    databaseURL: "https://groceryshoppinglist-79cb1.firebaseio.com",
    projectId: "groceryshoppinglist-79cb1",
    storageBucket: "groceryshoppinglist-79cb1.appspot.com",
    messagingSenderId: "980333765824"
};

export default class Settings {
    constructor() {
        firebase.initializeApp(config)
        this.splashTime = 2000
    }

    get SplashTime() {
        return this.splashTime
    }
}