<script setup>

//import reactive and ref from vue
import { reactive, ref } from 'vue'

//import useRouter from vue router
import { useRouter } from 'vue-router'

//inisialisasi vue router on Composition API
const router = useRouter()

//import services api
import api from '../../services/api'

//state user
const user = reactive({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
})

//state validation
const validation = ref([])

//method register
const register = async () => {

    //call api register
    await api.post('/api/register', {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
    })
        .then(() => {
            //redirect ke halaman login
            router.push({
                name: 'login'
            })
        })
    .catch(error => {
        //assign validation value with error
        validation.value = error.response.data
    })

}

</script>

<template>
    <div class="container">
        <div class="py-5 text-center">
            <img class="d-block mx-auto mb-4" src="../../assets/vue.svg" alt="" width="72" height="57">
            <h2>Register form</h2>
            <p class="lead">Below is an example form built entirely with Bootstrap’s form controls. Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.</p>
        </div>
        <div v-if="validation.errors" class="mt-2 alert alert-danger">
            <ul class="mt-0 mb-0">
                                <li v-for="(error, index) in validation.errors" :key="index">
                                    {{ `${error.path} : ${error.msg}` }}
                                </li>
                            </ul>
        </div>
        <div class="row g-5">
            <div class="col-md-12 col-lg-12">
                <form class="needs-validation" @submit.prevent="register">
                    <div class="row g-3">
                        <div class="col-12">
                            <label for="firstName" class="form-label">Full Name</label>
                            <input type="text" class="form-control" v-model="user.name" placeholder="" value="" required>
                            <div class="invalid-feedback">
                                Valid fullname is required.
                            </div>
                        </div>

                        <div class="col-12">
                        <label for="username" class="form-label">Username</label>
                            <div class="input-group has-validation">
                                <span class="input-group-text">@</span>
                                <input type="text" class="form-control" v-model="user.username" placeholder="Username" required>
                            <div class="invalid-feedback">
                                Your username is required.
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" v-model="user.email" placeholder="you@example.com" required>
                            <div class="invalid-feedback">
                                Please enter a valid email address
                            </div>
                        </div>

                        <div class="col-12">
                            <label for="address" class="form-label">Password</label>
                            <input type="password" v-model="user.password" class="form-control" placeholder="Password" />
                        </div>

                        
                    </div>

                    <hr class="my-4">

                    <button class="w-100 btn btn-primary btn-lg" type="submit">Register</button>
                </form>
            </div>
        </div>
    </div>
</template>