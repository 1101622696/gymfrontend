<script setup>
import { ref, onMounted } from "vue";
import { useStoreVentas } from "../store/ventas.js";

const useSales = useStoreVentas();

let rows=ref([])
let columns =ref([
    {name:"fecha", label:"fecha", field:"fecha", align:"center"},
    {name:"codigo", label:"Código", field:"codigo", align:"center"},
    {name:"valorUnitario", label:"Valor por unidad", field:"valorUnitario", align:"center"},
    {name:"cantidad", label:"Cantidad a vender", field:"cantidad", align:"center"},
    {name:"total", label:"Total de la venta", field:"totla", align:"center"},

])

async function listarVentas(){
    const res = await useSales.getSles()
    console.log(res.data);
    rows.value=res.data.ventas
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
          
          <button @click="listarVentas()">traer dtos</button>



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