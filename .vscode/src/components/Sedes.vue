<script setup>
import { ref, onMounted } from "vue";
import { useStoreSedes } from "../store/sedes.js";

const useSedes = useStoreSedes();
let alert = ref(false)
let accion = ref(1)

function abrir(){
  accion.value=1
    alert.value = true;

nombre.value=""
direccion.value=""
telefono.value=""
ciudad.value=""
codigo.value=""
horario.value=""
}


async function guardar(){

alert.value = true;
if (await validar()){
  const todo={
    nombre:nombre.value,
    direccion:direccion.value,
    telefono:telefono.value,
    ciudad:ciudad.value,
    codigo:codigo.value,
    horario:horario.value
    }
let nombrez= await useSedes.postSede(todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo enviar")
}else{
  mostrarMensajeExito("muy bien")
  listarSedes();
}
}
}

function editar(info){
    alert.value = true;
    accion.value !=1;

informacion.value=info
nombre.value=informacion.value
direccion.value=informacion.value
telefono.value=informacion.value
ciudad.value=informacion.value
codigo.value=informacion.value
horario.value=informacion.value
}

async function editarsede(){
if (await validar()){
  const todo={
    nombre:nombre.value,
    direccion:direccion.value,
    telefono:telefono.value,
    ciudad:ciudad.value,
    codigo:codigo.value,
    horario:horario.value

    }
let nombrez= await useSedes.putSedes(informacion._id, todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo enviar")
}else{
  mostrarMensajeExito("muy bien")
  listarSedes();
}
}
}

async function editarestado(info){
if(info.estado == 1){
let desactivado= await useSedes.putDesactivarSede(info._id)
}else if(info.estado == 0){
let activado= await useSedes.putActivarSede(info._id)
}
  listarSedes();
}


let informacion=ref("")
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
    { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])

async function validar() {
    let verificado = true;

    if (nombre.value === "") {
        mostrarMensajeError("El nombre está vacío");
        verificado = false;
    }
    if (ciudad.value === "") {
        mostrarMensajeError("Ingrese una ciudad");
        verificado = false;
    }
    if (direccion.value === "") {
        mostrarMensajeError("La dirección está vacía");
        verificado = false;
    } 
    if (codigo.value === "") {
        mostrarMensajeError("Ingrese un código");
        verificado = false;
    } 
    if (horario.value === "") {
        mostrarMensajeError("escriba el horario de la sede");
        verificado = false;
    }
        if (telefono.value === "" || isNaN(telefono.value) || telefono.value.length < 10) {
        mostrarMensajeError("El teléfono debe ser un número válido y tener al menos 10 caracteres");
        verificado = false;
    }

    if (verificado) {
        mostrarMensajeExito("El formulario se envió correctamente");
    }

    return verificado;
}

function mostrarMensajeError(mensaje) {
    $q.notify({
        type: "negative",
        message: mensaje,
        position: "bottom-right",
    });
}

function mostrarMensajeExito(mensaje) {
    $q.notify({
        type: "positive",
        message: mensaje,
        position: "bottom-right",
    });
}


async function listarSedes(){
    const res = await useSedes.listarSede()
    console.log(res.data);
    rows.value=res.data.sede
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
            <q-table class="table" flat bordered title="Sedes" :rows="rows" :columns="columns" row-key="id">
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
            <q-btn v-if="props.row.estado == 1"
            @click="editarestado(props.row)"
             style="color:green">Activo</q-btn>
            <q-btn v-else 
               @click="editarestado(props.row)"
               style="color:red">Inactivo</q-btn>
          </q-td>
        </template>
      </q-table>
<div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Registrar Sede</q-btn>
        </div>
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
            @click="guardar()"
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
            @click="editarsede()"
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