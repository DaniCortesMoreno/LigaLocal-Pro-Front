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
                nombre: yup.string().required("Necesitamos un nombre!").min(3).max(20),
                apellidos: yup.string().required("Necesitamos tus apellidos!").min(3).max(50),
                email: yup.string().email().required("Necesitamos tu correo!"),
                password: yup.string().required("Pon una contraseña de mínimo 6 caracteres").min(6),
                confirm_password: yup.string().required("Repite la contraseña").oneOf([yup.ref("password")], "Las contraseña deben coincidir"),
            });
        }
    },

    methods: {
        ...mapActions(useUserStore, ["register"]),

        onSubmit(values) {
            if (this.register(values.nombre, values.apellidos, values.password, values.email, values.confirm_password)) {
                router.push("/");
            } else {
                alert("El usuario no ha podido ser creado");
            }
        }
    }


}

</script>

<template>
    <div>
        <h1>Registro</h1>
    </div>

    <Form :validation-schema="mySchema" @submit="onSubmit">
        <div class="mb-3">
            <label for="nombre" class="form-label">Nombre</label>
            <Field name="nombre" type="text" class="form-control" id="nombre" aria-describedby="nombreHelp" />
            <ErrorMessage name="nombre" class="error-feedback" />
        </div>

        <div class="mb-3">
            <label for="apellidos" class="form-label">Apellidos</label>
            <Field name="apellidos" type="text" class="form-control" id="apellidos" aria-describedby="apellidosHelp" />
            <ErrorMessage name="apellidos" class="error-feedback" />
        </div>

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

        <div>
            <label for="confirm_password" class="form-label">Confirmar Password</label>
            <Field name="confirm_password" type="password" class="form-control" id="confirm_password" />
            <ErrorMessage name="confirm_password" class="error-feedback" />
        </div>

        <button type="submit" class="btn btn-primary">Registrar</button>
    </Form>
</template>

<style>
.error-feedback {
    color: red;
}
</style>