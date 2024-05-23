<script setup>
import { ref, onMounted } from "vue";
import { useStoreUsuarios } from "../store/usuarios.js";

const useUsuarios = useStoreUsuarios();

let rows=ref([])
let columns =ref([
    {name:"nombre", label:"Nombre de Usuario", field:"nombre", align:"center"},
    {name:"email", label:"Correo electrónico", field:"email", align:"center"},
    {name:"telefono", label:"Telefono", field:"telefono", align:"center"},
    {name:"rol", label:"Rol", field:"rol", align:"center"},
    {name:"estado", label:"Estado de Usuario", field:"estado", align:"center"},

])

async function listarUsuarios(){
    const res = await useUsuarios.getUser()
    console.log(res.data);
    rows.value=res.data.usuario
}
      
</script>


<template>
    <div>
      
<div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Registrar Usuario</q-btn>
        </div>

    <button @click="listarUsuarios()">traer datos</button>

    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section
            style="background-color: #a1312d; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Usuario" : "Editar Usuario" }}
            </div>
          </q-card-section>
<q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Direccion del Usuario" type="text" />
          <q-card-actions align="right">
            <q-btn
              v-if="accion === 1"
              color="red"
              class="text-white"
              :loading="useUsuarios.loading"
              >Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn
              v-if="accion !== 1"
              color="red"
              class="text-white"
              :loading="useUsuarios.loading"
            >
              Editar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>


    </div>
</template>

<style scoped>

</style>