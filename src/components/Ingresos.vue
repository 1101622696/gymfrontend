<script setup>
import { ref, onMounted } from "vue";
import { useStoreIngresos } from "../store/ingresos.js";

const useIngreso = useStoreIngresos();
let alert = ref(false)
let accion = ref(1)
let rows=ref([])
let columns =ref([
    {name:"Cliente", sortable:true, label:"Nombre Cliente", field:"cliente", align:"center",},
    {name:"fecha", label:"Fecha del ingreso", field:"fecha", align:"center"},
])

async function listarIngreso(){
    const res = await useIngreso.getRevenues()
    console.log(res.data);
    rows.value=res.data.ingreso
}
      
 function abrir() {
    accion.value = 1;
    alert.value = true;

}
function cerrar() {
    alert.value = false;
}     

      const model = ref(null);
      const options = [
        '1', '2', '3', '4'
      ];


      onMounted(()=>{
  listarClientes(), listarSedes(), listarIngreso();
})

import { useStoreSedes } from "../store/sedes.js";
const useSedes = useStoreSedes();
async function listarSedes(){
    const res = await useSedes.getOffice()
    console.log(res.data);
    rows.value=res.data.sede
} 

import { useStoreClientes } from "../store/clientes.js";
const useCliente = useStoreClientes();
async function listarClientes() {
  const res = await useCliente.getCustomer();
  console.log(res.data);
  rows.value = res.data.cliente;
}



</script>

<template>
    <div>
      
<div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Registrar Ingreso</q-btn>
        </div>

    <button @click="listarIngreso()">traer datos</button>

    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section
            style="background-color: #a1312d; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Ingreso" : "Editar Ingreso" }}
            </div>
          </q-card-section>
<q-input outlined v-model="fecha" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="fecha del ingreso" type="text" />
      <q-select standout v-model="idsede" :options="options" label="Sede"         style="background-color: #grey; margin-bottom: 20px"
      />
     
       <q-select standout v-model="idcliente" :options="options" label="Cliente" style="background-color: #grey; margin-bottom: 20px"
      />
          <q-card-actions align="right">
            <q-btn
              v-if="accion === 1"
              color="red"
              class="text-white"
              :loading="useIngreso.loading"
              >Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn
              v-if="accion !== 1"
              color="red"
              class="text-white"
              :loading="useIngreso.loading"
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