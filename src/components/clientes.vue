<script setup>
import { ref, onMounted } from "vue";
import { useStoreClientes } from "../store/clientes.js";

const useCliente = useStoreClientes();

let rows=ref([])
let columns =ref([
    {name:"nombre", sortable:true, label:"Nombre Usuario", field:"nombre", align:"center",},
    {name:"telefono", label:"Telefono", field:"telefono", align:"center"},
    {name:"estado", label:"Estado", field:"estado", align:"center"},
    {name:"opciones", label:"Opciones", field:"opciones", align:"center"}
])

async function listarClientes(){
    const res = await useCliente.getUsers()
    console.log(res.data);
    rows.value=res.data.cliente
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
                <q-btn v-if="props.row.estado==1">
                    ❌
                </q-btn>
                <q-btn v-else>
                    ✅
                </q-btn>
              </q-td>
              </template>
              <template v-slot:body-cell-estado="props">
                <q-td :props="props">
                    <p v-if="props.row.estado==1" style="color:green">Activo</p>
                    <p v-else style="color:red">Inactivo</p>
                </q-td>
                </template>
            </q-table>
          </div>
          
          <button @click="listarClientes()">traer dtos</button>



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