import firebase from 'firebase'
import MobxFirebaseStore from 'mobx-firebase-store'

const config = {
    apiKey: "AIzaSyDic72yczOGwxlANfKXwjCfFzLafgvQacY",
    authDomain: "groceryshoppinglist-79cb1.firebaseapp.com",
    databaseURL: "https://groceryshoppinglist-79cb1.firebaseio.com",
    projectId: "groceryshoppinglist-79cb1",
    storageBucket: "groceryshoppinglist-79cb1.appspot.com",
    messagingSenderId: "980333765824"
};

export default class SettingsStore extends MobxFirebaseStore {
    constructor() {
        firebase.initializeApp(config)
        super(firebase.database().ref())

        this.splashTime = 2000
    }

    get SplashTime() {
        return this.splashTime
    }
}