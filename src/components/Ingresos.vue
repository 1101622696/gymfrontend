<script setup>
import { ref, onMounted } from "vue";
import { useStoreIngresos } from "../store/ingresos.js";

const useIngreso = useStoreIngresos();
let alert = ref(false)
let accion = ref(1)
let rows=ref([])

let idsede = ref("");
let Cliente = ref("");
let fecha = ref("");


let columns =ref([
      {name:"idsede", label:"Sede", field:"idsede", align:"center"},
    {name:"Cliente", sortable:true, label:"Nombre Cliente", field:"Cliente", align:"center",},
    {name:"fecha", label:"Fecha del ingreso", field:"fecha", align:"center"},
])

async function listarIngreso(){
    const res = await useIngreso.listarIngresos()
    console.log(res.data);
    rows.value=res.data.ingreso

async function useIngreso() {
    let verificado = true;

    if (fecha.value == "") {
        $q.notify({
            type: "negative",
            message: "la fecha está vacía",
            position: "bottom-right",
        });
        verificado = false;
    }
    if (idsede.value == "") {
        $q.notify({
            type: "negative",
            message: "El tipo de documento está vacío",
            position: "bottom-right",
        });
        verificado = false;
    }
    if (Cliente == "") {
        $q.notify({
            type: "negative",
            message: "la direccion está vacío",
            position: "bottom-right",
        });
        verificado = false;
    } else{


    }
    return verificado;
}



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
    const res = await useSedes.listarSede()
    console.log(res.data);
    rows.value=res.data.sede
} 

import { useStoreClientes } from "../store/clientes.js";
const useCliente = useStoreClientes();
async function listarClientes() {
  const res = await useCliente.listarCliente();
  console.log(res.data);
  rows.value = res.data.cliente;
}



</script>

<template>
    <div>
          <q-table class="table" flat bordered title="tabla" :rows="rows" :columns="columns" row-key="id">
      <template v-slot:body-cell-opciones="props">
        <q-td :props="props">
          <q-btn class="option-button" @click="editar(props.row)">
            ✏️
          </q-btn>
          <q-btn v-if="props.row.estado == 1" class="option-button">
            ❌
          </q-btn>
          <q-btn v-else class="option-button">
            ✅
          </q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-estado="props">
        <q-td :props="props">
          <p v-if="props.row.estado == 1" style="color:green">Activo</p>
          <p v-else style="color:red">Inactivo</p>
        </q-td>
      </template>
    </q-table>

<div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Registrar Ingreso</q-btn>
        </div>

    <!-- <button @click="listarIngreso()">traer datos</button> -->

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
      <q-select standout v-model="idsede" :options="'funciondecomosevaallmar'" option-value="valor" option-label="label" label="Sede"         style="background-color: #grey; margin-bottom: 20px"
      />
     
       <q-select standout v-model="idcliente" :options="'funciondecomosevaallmar'" option-value="valor" option-label="label" label="Cliente" style="background-color: #grey; margin-bottom: 20px"
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