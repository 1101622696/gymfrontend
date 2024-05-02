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
    const res = await useUsuarios.getUsers()
    console.log(res.data);
    rows.value=res.data.usuarios
}
      
</script>

<template>
    <div>
        <div class="q-pa-md">

            <q-table
              flat bordered
              title="Treats"
              :rows="rows"
              :columns="columns"
              row-key="id"
            >
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn @click="editar(props.row)">
                    ✏️
                </q-btn>
              </q-td>
              </template>
              <template v-slot:body-cell-estado="props">
                </template>
            </q-table>
          </div>
          
          <button @click="listarUsuarios()">traer dtos</button>



<div class="crear cliente">
    <h3>ingresar clientes</h3>
  
          <input id="input" type="text" placeholder="Nombre" v-model.trim="Nombre" />
          <input id="input" type="text" placeholder="N° Documento" v-model.trim="documento" />
          <input id="input" type="text" placeholder="Direccion" v-model.trim="direccion" />
          <input id="input" type="date" placeholder="Fecha de nacimiento" v-model.trim="fechaNacimiento" />
          <input id="input" type="text" placeholder="Telefono" v-model.trim="telefono" />
          <input id="input" type="text" placeholder="Telefono" v-model.trim="plan" />
          <input id="input" type="text" placeholder="foto" v-model.trim="foto" />

</div>



    </div>
</template>

<style scoped>

</style>