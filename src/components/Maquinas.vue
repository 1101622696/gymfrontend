<script setup>
import { ref, onMounted } from "vue";
import { useStoreMaquina } from "../store/maquinas.js";

const useMaquina = useStoreMaquina();

let rows=ref([])
let columns =ref([
    {name:"codigo", sortable:true, label:"Código de la máquina", field:"codigo", align:"center",},
    {name:"descripcion", label:"Descripción", field:"descripcion", align:"center"},
    {name:"fecha", label:"Fecha del ingreso", field:"fecha", align:"center"},
    {name:"fecha", label:"Fecha del último mantenimiento", field:"fecha", align:"center"},
    {name:"estado", label:"Estado de la máquina", field:"estado", align:"center"},

])

async function listarMaquina(){
    const res = await useMaquina.getMaintenance()
    console.log(res.data);
    rows.value=res.data.maquinas
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
          
          <button @click="listarMaquina()">traer dtos</button>



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