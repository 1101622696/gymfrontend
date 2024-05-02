<script setup>
import { ref, onMounted } from "vue";
import { useStorePagos } from "../store/pagos.js";

const usePagos = useStorePagos();

let rows=ref([])
let columns =ref([
    {name:"plan", sortable:true, label:"Plan", field:"plan", align:"center",},
    {name:"fecha", label:"Fecha del pago", field:"fecha", align:"center"},
    {name:"valor", label:"Valor", field:"valor", align:"center"},
    {name:"estado", label:"Estado del pago", field:"estado", align:"center"},

])

async function listarPagos(){
    const res = await usePagos.getPayment()
    console.log(res.data);
    rows.value=res.data.pagos
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
          
          <button @click="listarPagos()">traer dtos</button>



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