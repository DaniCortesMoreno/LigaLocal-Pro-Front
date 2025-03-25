<script>
import { mapActions, mapState } from "pinia";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useUserStore } from "@/stores";
import router from "@/router";

export default {
    components: {
        Field,
        Form,
        ErrorMessage
    },

    computed: {
        mySchema() {
            return yup.object({
                email: yup.string().email().required("Correo necesario."),
                password: yup.string().required("Contraseña necesaria.").min(6),
            });
        }
    },

    methods: {
        ...mapActions(useUserStore, ["login"]),

        onSubmit(values) {
            if (this.login(values.email, values.password)) {
                router.push("/");
            } else {
                alert("Usuario o contraseña incorrecta.");
            }
        }
    }
}
</script>

<template>
    <div>
        <h1>Login</h1>
    </div>

    <Form :validation-schema="mySchema" @submit="onSubmit">
        
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <Field name="email" type="email" class="form-control" id="email" aria-describedby="emailHelp" />
            <ErrorMessage name="email" class="error-feedback" />
        </div>

        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <Field name="password" type="password" class="form-control" id="password" />
            <ErrorMessage name="password" class="error-feedback" />
        </div>

        <button type="submit" class="btn btn-primary">Registrar</button>
    </Form>
</template>

<style>
.error-feedback {
    color: red;
}
</style>