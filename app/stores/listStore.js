import { observable, action } from 'mobx'
import firebase from 'firebase'

export default class ListStore {
    @observable list = [];

    constructor() {
        firebase.database().ref().child("lists").on('value', (snap) => {
        //var lists = [];
        snap.forEach((child) => {
            this.list.push({
                name: child.val().name,
                key: child.key
            });
        });
    });
    }
}