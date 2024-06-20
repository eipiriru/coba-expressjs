<script setup>
//import reactive and ref from vue
import { reactive, ref } from 'vue'

//import useRouter from vue router
import { useRouter } from 'vue-router'

//inisialisasi vue router on Composition API
const router = useRouter()

//import services api
import api from '../../services/api'

//import js-cookie
import Cookies from 'js-cookie'

//state user
const user = reactive({
    email: '',
    password: '',
})

//state validation
const validation = ref([])
const loginFailed = ref([])

//method login
const login = async () => {

    //call api login
    await api.post('/api/login', {
        email: user.email,
        password: user.password
    })
    .then(response => {

        //set token and user on cookies
        Cookies.set('token', response.data.data.token)
        Cookies.set('user', JSON.stringify(response.data.data.user))

        // Verify the token is set before redirecting
        if (Cookies.get('token')) {
            //redirect to dashboard
            router.push({ name: 'dashboard' })
        } 
        
    })
    .catch(error => {
        //assign validation value with error
        validation.value = error.response.data

        //assign loginFailed value with error
        loginFailed.value = error.response.data
    })

}

</script>

<template>
        <div class="container col-xl-10 col-xxl-8 px-4 py-5">
            <div class="row align-items-center g-lg-5 py-5">
            <div class="col-lg-7 text-center text-lg-start">
                <h1 class="display-4 fw-bold lh-1 text-body-emphasis mb-3">Vertically centered hero sign-up form</h1>
                <p class="col-lg-10 fs-4">Below is an example form built entirely with Bootstraps form controls. Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.</p>
            </div>
            <div class="col-md-10 mx-auto col-lg-5">
                
                <div v-if="validation.errors" class="mt-2 alert alert-danger">
                        <ul class="mt-0 mb-0">
                            <li v-for="(error, index) in validation.errors" :key="index">
                                {{ `${error.path} : ${error.msg}` }}
                            </li>
                        </ul>
                    </div>
                    <div v-if="loginFailed.message" class="mt-2 alert alert-danger">
                        {{ loginFailed.message }}
                    </div>
                <form class="p-4 p-md-5 border rounded-3 bg-body-tertiary" @submit.prevent="login">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" v-model="user.email" placeholder="Email or Username">
                        <label for="floatingInput">Email address or Username</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" v-model="user.password" placeholder="Password">
                        <label for="floatingPassword">Password</label>
                    </div>
                    <div class="checkbox mb-3">
                        <label>
                        <input type="checkbox" value="remember-me"> Remember me
                        </label>
                    </div>
                    <button class="w-100 btn btn-lg btn-primary" type="submit">Sign up</button>
                    <hr class="my-4">
                    <small class="text-body-secondary">By clicking Sign up, you agree to the terms of use.</small>
                    <hr>
                    <small class="text-body-secondary">Dont have account -> <router-link :to="{ name: 'register' }">Register</router-link></small>
                </form>
            </div>
            </div>
        </div>
</template>