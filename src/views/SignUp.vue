<template>
    <div>
        <form @submit.prevent="onSignupEmail">
            <div>
                <label>
                    Email:
                    <input v-model="email" />
                </label>
            </div>
            <div>
                <label>
                    Password
                    <input type="password" v-model="password" />
                </label>
            </div>
            <button type="submit">Enviar</button>
        </form>
        <div>
            <label>
                
                <button @click="onSignupGoogle">Google</button>
            </label>
        </div>
        <div>
            <label>
                <button @click="onSignupFacebook">Facebook</button>
            </label>
        </div>
        
    </div>
</template>
<script>

/* eslint-disable no-console */
import firebase from 'firebase';
export default {
    name: 'signup',
    data(){
        return {
            email:'',
            password:'',
        }
    },
    methods: {
        onSignupFacebook () {
            var provider = new firebase.auth.FacebookAuthProvider();
            firebase.auth().signInWithPopup(provider).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(`${errorCode} - ${errorMessage}`);
           });
        },
        onSignupGoogle () {

            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().languageCode = 'pt';
            firebase.auth().signInWithPopup(provider).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(`${errorCode} - ${errorMessage}`);
            });                
        },
        onSignupEmail() {
            var email = this.email;
            var password = this.password;
            if (email.length < 4) {
                alert('Please enter an email address.');
                return;
            }
            if (password.length < 4) {
                alert('Please enter a password.');
                return;
            }
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(`${errorCode} - ${errorMessage}`);
            });
        }
    },
    mounted() {
    }
}
</script>
