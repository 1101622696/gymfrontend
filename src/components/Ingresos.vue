<script setup>
import { ref, onMounted, computed } from "vue";
import { useStoreIngresos } from "../store/ingresos.js";

const useIngreso = useStoreIngresos();
let alert = ref(false)
let accion = ref(1)
let rows=ref([])

let idSede = ref("");
let idCliente = ref("");
let fecha = ref("");
let sedesTodo = ref([]);
let clientesTodo = ref([]);
let nombreCodigoS = ref([]);
let nombreCodigoC = ref([]);


let columns =ref([
      {name:"idSede", label:"Sede", field:"idSede", align:"center"},
    {name:"idCliente", sortable:true, label:"Documento Cliente", field:"idCliente", align:"center",},
    {name:"fecha", label:"Fecha del ingreso", field:"fecha", align:"center"},
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])



async function agregarIngreso() {
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

      
 function abrir() {
    accion.value = 1;
    alert.value = true;

}
function cerrar() {
    alert.value = false;
}     


      onMounted(()=>{
  listarIngresos(), listarClientes(), listarSedes();
})

import { useStoreSedes } from "../store/sedes.js";
const useSedes = useStoreSedes();


import { useStoreClientes } from "../store/clientes.js";
const useCliente = useStoreClientes();

async function listarIngresos() {
  try {
    const res = await useIngreso.listarIngreso();
    console.log("Ingresos:", res.data);
    rows.value = res.data.ingreso;
  } catch (error) {
    console.error("Error al listar ingresos:", error);
  }
}

const organizarSedes = computed(() => {
  nombreCodigoS.value = sedesTodo.value.map((element) => ({
    label: `${element.nombre}`,
    valor: `${element._id}`,
    nombre: `${element.nombre}`,
  }));
  return nombreCodigoS.value;
});

async function listarSedes() {
  try {
    const res = await useSedes.listarSede();
    sedesTodo.value = res.data.sede;
  } catch (error) {
    console.error("Error al listar sedes:", error);
  }
}

const organizarClientes = computed(() => {
  nombreCodigoC.value = clientesTodo.value.map((element) => ({
    label: `${element.documento}`,
    valor: `${element._id}`,
    nombre: `${element.nombre}`,
  }));
  return nombreCodigoC.value;
});

async function listarClientes() {
  try {
    const res = await useCliente.listarCliente();
    clientesTodo.value = res.data.cliente;
  } catch (error) {
    console.error("Error al listar clientes:", error);
  }
}

function getSedeDireccion(id) {
  const sede = sedesTodo.value.find((sede) => sede._id === id);
  return sede ? sede.direccion : "Dirección no encontrada";
}

function getClienteDocumento(id) {
  const cliente = clientesTodo.value.find((cliente) => cliente._id === id);
  return cliente ? cliente.documento : "Documento no encontrado";
}
</script>

<template>
    <div>
        <q-table class="table" flat bordered title="Ingresos" :rows="rows" :columns="columns" row-key="id">
  <template v-slot:body-cell-idSede="props">
    <q-td :props="props">
      <p>{{ getSedeDireccion(props.row.idSede) }}</p>
    </q-td>
  </template>
  <template v-slot:body-cell-idCliente="props">
    <q-td :props="props">
      <p>{{ getClienteDocumento(props.row.idCliente) }}</p>
    </q-td>
  </template>
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
                        class="q-my-md q-mx-md" label="fecha del ingreso" type="date" />
      <q-select standout v-model="idSede" :options="organizarSedes" option-value="valor" option-label="label" label="Sede"         style="background-color: #grey; margin-bottom: 20px"
      />
     
       <q-select standout v-model="idCliente" :options="organizarClientes" option-value="valor" option-label="label" label="Cliente" style="background-color: #grey; margin-bottom: 20px"
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