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
    props: {
        torneo_id: {
            type: String
        }
    },

    computed: {
        mySchema() {
            return yup.object({
                nombre: yup.string().required("El nombre del equipo es obligatorio").min(3).max(50),
                color_equipacion: yup.string().required("Selecciona el color de la equipación"),
                entrenador: yup.string().required("Introduce el nombre del entrenador"),
            });
        }
    },

    methods: {
        ...mapActions(useUserStore, ["addEquipo"]),

        async onSubmit(values) {
            const success = await this.addEquipo(this.torneo_id, values);

            if (success) {
                router.push(`/torneos/${this.torneo_id}`);
            } else {
                alert("No se pudo crear el equipo.");
            }
        }

    }

}
</script>


<template>

    <Form :validation-schema="mySchema" @submit="onSubmit">
        <div class="mb-3">
            <label for="nombre" class="form-label">Nombre Del Equipo:</label>
            <Field name="nombre" type="text" class="form-control" id="nombre" />
            <ErrorMessage name="nombre" class="text-danger small" />
        </div>

        <div class="mb-4">
            <label for="color_equipacion" class="form-label">Color De La Equipación:</label>
            <Field name="color_equipacion" class="form-select" id="color_equipacion" type="text">
            </Field>
            <ErrorMessage name="color_equipacion" class="text-danger small" />
        </div>

        <div class="mb-4">
            <label for="entrenador" class="form-label">Entrenador:</label>
            <Field name="entrenador" type="text" class="form-control" id="entrenador" />
            <ErrorMessage name="entrenador" class="text-danger small" />
        </div>

        <button type="submit" class="btn btn-primary w-100">Guardar Equipo</button>
    </Form>

</template>
