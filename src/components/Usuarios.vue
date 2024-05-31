<script setup>
import { ref, onMounted, computed } from "vue";
import { useStoreUsuarios } from "../store/usuarios.js";
import { useStoreSedes } from "../store/sedes.js";


const useUsuarios = useStoreUsuarios();
const useSedes = useStoreSedes();


onMounted(()=>{
  listarUsuarios(), listarSedes();
})


let alert = ref(false)
let accion = ref(1)

let informacion=ref("")
let id = ref("");
let nombre = ref("");
let email = ref("");
let telefono = ref("");
let rol = ref("");
let sedesTodo = ref([]);
let nombreCodigo = ref([]);

let rows=ref([])
let columns =ref([
      {name:"id", label:"Sede", field:"id", align:"center"},
  {name:"nombre", label:"Nombre de Usuario", field:"nombre", align:"center"},
    {name:"email", label:"Correo electrónico", field:"email", align:"center"},
    {name:"telefono", label:"Telefono", field:"telefono", align:"center"},
    {name:"rol", label:"Rol", field:"rol", align:"center"},
    {name:"estado", label:"Estado de Usuario", field:"estado", align:"center"},
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])
function validarEmail(email) {
    // Expresión regular para validar un email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
async function Agregar() {
    let verificado = true;

    if (nombre.value === "") {
        mostrarMensajeError("El nombre está vacío");
        verificado = false;
    }
    if (id.value === "") {
        mostrarMensajeError("Seleccione una sede");
        verificado = false;
    }
    if (email.value === "" || !validarEmail(email.value)) {
        mostrarMensajeError("El email no es válido");
        verificado = false;
    }
    
    if (telefono.value === "" || isNaN(telefono.value) || telefono.value.length < 10) {
        mostrarMensajeError("El teléfono debe ser un número válido y tener al menos 10 caracteres");
        verificado = false;
    }
    if (rol.value === "") {
        mostrarMensajeError("Debe seleccionar un rol");
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

  function abrir() {
accion.value = 1;
alert.value = true;

}
function cerrar() {
alert.value = false;
}  

      const model = ref(null);
      const options = [
        'Administrador', 'Recepcionista', 'Entrenador'
      ];


async function listarUsuarios() {
  try {
    const res = await useUsuarios.listarUsuario();
    rows.value = res.data.usuario.map(usuario => {
      return {
        ...usuario,
        sede: usuario.id, 
      };
    });
  } catch (error) {
    console.error("Error al listar usuarios:", error);
  }
}

function getSedeNombre(id) {
  const sede = sedesTodo.value.find(sede => sede._id === id);
  return sede ? sede.nombre : '';
}

const organizarSedes = computed(() => {
    nombreCodigo.value = sedesTodo.value.map((element) => ({
        label: `${element.nombre}`,
        valor: `${element._id}`,
        nombre: `${element.nombre}`,
    }));
    return nombreCodigo.value;
});


async function listarSedes() {
    try {
   const res = await useSedes.listarSede()
    console.log(res.data);
    sedesTodo.value=res.data.sede

    } catch (error) {
        console.error("Error al listar sedes:", error);
    }
}

    
</script>


<template>
    <div>


      <q-table class="table" flat bordered title="Usuarios" :rows="rows" :columns="columns" row-key="id">
      <template v-slot:body-cell-id="props">
        <q-td :props="props">
          <p>{{ getSedeNombre(props.row.id) }}</p>
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
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Registrar Usuario</q-btn>
        </div>
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section
            style="background-color: #a1312d; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Usuario" : "Editar Usuario" }}
            </div>
          </q-card-section>
                 <q-select standout v-model="id" :options="organizarSedes" option-value="valor" option-label="label" label="Sede"    style="background-color: #grey; margin-bottom: 20px"
      />
<q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre del Usuario" type="text" />
<q-input outlined v-model="email" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Correo" type="text" />
<q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Teléfono" type="text" />

 <q-select standout v-model="rol" :options="options" label="Rol" style="background-color: #grey; margin-bottom: 20px"
      />


          <q-card-actions align="right">
            <q-btn
             @click="guardar()"
              v-if="accion === 1"
              color="red"
              class="text-white"
              :loading="useUsuarios.loading"
              >Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn
            @click="editarpago()"
              v-if="accion !== 1"
              color="red"
              class="text-white"
              :loading="useUsuarios.loading"
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