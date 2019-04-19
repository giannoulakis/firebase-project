<template>
    <div>
        <form @submit.prevent="onSubmit">
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
    </div>
</template>

<script>
    export default {
        name: 'login',
        components: {
        },
        data(){
          return {
              email:'',
              password:'',
          }
        },
        methods: {
            onSubmit() {
                 this.$store.dispatch('userLogin', {
                    email: this.email,
                    password: this.password
                });
            },
        }
    }
</script>

