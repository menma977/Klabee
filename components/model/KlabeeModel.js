import React from 'react';
export default class KlabeeModel extends React.Component {
    constructor() {
        this.username = '';
        this.password = '';
    }

    getUsername() {
        return this.username;
    }

    setUsername(value) {
        this.username = value;
    }

    getPassword() {
        return this.password;
    }

    setPassword(value) {
        this.password = value;
    }
}
