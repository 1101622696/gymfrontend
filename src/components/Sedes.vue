<script setup>
import { ref, onMounted } from "vue";
import { useStoreSedes } from "../store/sedes.js";

const useSedes = useStoreSedes();

let rows=ref([])
let columns =ref([
    {name:"nombre", label:"Nombre de Sede", field:"nombre", align:"center"},
    {name:"direccion", label:"Dirección", field:"direccion", align:"center"},
    {name:"telefono", label:"Telefono de sede", field:"telefono", align:"center"},
    {name:"ciudad", label:"Ciudad", field:"ciudad", align:"center"},
    {name:"codigo", sortable:true, label:"Código", field:"codigo", align:"center",},
    {name:"horario", label:"Horario de la Sede", field:"horario", align:"center"},
    {name:"estado", label:"Estado de Sede", field:"estado", align:"center"},

])

async function listarSedes(){
    const res = await useSedes.getOffice()
    console.log(res.data);
    rows.value=res.data.planes
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
          
          <button @click="listarSedes()">traer dtos</button>



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