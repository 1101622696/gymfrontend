<script setup>
import { ref, onMounted } from "vue";
import { useStoreMantenimiento } from "../store/mantenimiento.js";

const useMantenimiento = useStoreMantenimiento();

let rows=ref([])
let columns =ref([
    {name:"fecha", sortable:true, label:"Fecha del mantenimiento", field:"fecha", align:"center",},
    {name:"descripcion", label:"Descripción del mantenimiento", field:"descripcion", align:"center"},
    {name:"responsable", label:"Responsable encargado", field:"responsable", align:"center"},
    {name:"valor", label:"Valor del mantenimiento", field:"valor", align:"center"},

])

async function listarMantenimiento(){
    const res = await useMantenimiento.getMaintenance()
    console.log(res.data);
    rows.value=res.data.mantenimiento
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
          
          <button @click="listarMantenimiento()">traer dtos</button>



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