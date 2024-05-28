<script setup>
import { ref, onMounted } from "vue";
import { useStoreSedes } from "../store/sedes.js";

const useSedes = useStoreSedes();
let alert = ref(false)
let accion = ref(1)

let nombre = ref("");
let direccion = ref("");
let telefono = ref("");
let ciudad = ref("");
let codigo = ref("");
let horario = ref("");

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
    const res = await useSedes.listarSede()
    console.log(res.data);
    rows.value=res.data.sede
}
      
       function abrir() {
    accion.value = 1;
    alert.value = true;

}
function cerrar() {
    alert.value = false;
}  

onMounted(()=>{
  listarSedes();
})

</script>

<template>
    <div>
      
<div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Registrar Sede</q-btn>
        </div>

  <!-- <button @click="listarSedes()">traer datos</button> -->

    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section
            style="background-color: #a1312d; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Sede" : "Editar Sede" }}
            </div>
          </q-card-section>
<q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre" type="text" />
  <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Direccion" type="text" />
  <q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Teléfono" type="text" />   
  <q-input outlined v-model="ciudad" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ciudad" type="text" />  
      <q-input outlined v-model="codigo" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Codigo" type="text" />                     
  <q-input outlined v-model="horario" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Horario" type="text" /> 


          <q-card-actions align="right">
            <q-btn
              v-if="accion === 1"
              color="blue"
              class="text-white"
              :loading="useSedes.loading"
              >Agregar
              <template v-slot:loading>
                <q-spinner color="secundary" size="1em" />
              </template>
            </q-btn>
            <q-btn
              v-if="accion !== 1"
              color="blue"
              class="text-white"
              :loading="useSedes.loading"
            >
              Editar
              <template v-slot:loading>
                <q-spinner color="secundary" size="1em" />
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