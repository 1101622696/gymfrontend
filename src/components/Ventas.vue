<script setup>
import { ref, onMounted, computed } from "vue";
import { useStoreVentas } from "../store/ventas.js";
import { useStoreInventario } from "../store/inventario.js";
import { useQuasar } from 'quasar'


const useSales = useStoreVentas();
const useInventario = useStoreInventario();


let agregar=ref(false)
const $q = useQuasar();

let botoneditar=ref(false)

function agregarventa(){
  botoneditar.value=true
    agregar.value = true;

idInventario.value=""
valorUnitario.value=""
cantidad.value=""

}


function guardarUltimaVenta(id) {
  localStorage.setItem('ultimaVenta', id);
}

function obtenerUltimaVenta() {
  return localStorage.getItem('ultimaVenta');
}
async function guardar() {

  if (await validar()) {
    const todo = {
      idInventario: idInventario.value.valor,
      valorUnitario: valorUnitario.value,
      cantidad: cantidad.value
    };

    try {
      let nombrez = await useSales.postVenta(todo);

      if (nombrez.status !== 200) {
        mostrarMensajeError("No se pudo enviar");
        
      } else {
        const nuevaVenta = {
          _id: nombrez.data.venta._id, 
          idInventario: nombrez.data.venta.idInventario,
          valorUnitario: nombrez.data.venta.valorUnitario,
          cantidad: nombrez.data.venta.cantidad,
        };

        guardarUltimaVenta(nuevaVenta._id);

        rows.value.unshift(nuevaVenta);

        mostrarMensajeExito("Venta agregada exitosamente");
        listarVentas();
        listarInventarios();
  agregar.value = false;

      }
    } catch (error) {
      mostrarMensajeError("Error al enviar la solicitud: " + error.message);
    }
  }
}


function editar(info) {
  agregar.value = true;
  botoneditar.value = false;

  informacion.value = info;
            const selectedInventario = inventarioTodo.value.find(inventario => inventario._id === info.idInventario);
    if (selectedInventario) {
        idInventario.value = {
            label: `${selectedInventario.descripcion}- ${selectedInventario.codigo}`, 
            valor: selectedInventario._id, 
            nombre: selectedInventario.nombre  
        };
    }
  valorUnitario.value = info.valorUnitario;
  cantidad.value = info.cantidad;
}

async function editarventa() {
  if (await validar()) {
    const todo = {
      idInventario: idInventario.value.valor,
      valorUnitario: valorUnitario.value,
      cantidad: cantidad.value
    };

    if (!informacion.value || !informacion.value._id) {
      console.error("ID de información no definido:", informacion.value);
      mostrarMensajeError("No se pudo enviar, ID no definido");
      return;
    }

    try {
      const response = await useSales.putVenta(informacion.value._id, todo);
      if (response.status !== 200) {
        mostrarMensajeError("No se pudo enviar");
      } else {
        mostrarMensajeExito("Muy bien");
        listarVentas();
        listarInventarios();
      }
    } catch (error) {
      console.error("Error al actualizar la venta:", error);
      mostrarMensajeError("No se pudo enviar");
    }
  }
}


function cerrar(){
    agregar.value = false;
}

onMounted(()=>{
  listarVentas(), listarInventarios();
})

let informacion=ref("")
let idInventario = ref("");
let valorUnitario = ref("");
let cantidad = ref("");
let total = ref("");
let inventarioTodo = ref([]);
let nombreCodigo = ref([]);

let rows=ref([])
let columns =ref([
    {name:"idInventario", label:"Inventario", field:"idInventario", align:"center"},
    {name:"fecha", label:"fecha de venta", field:"fecha", align:"center"},
    {name:"codigo", label:"Código", field:"codigo", align:"center"},
    {name:"valorUnitario", label:"Valor por unidad", field:"valorUnitario", align:"center"},
    {name:"cantidad", label:"Cantidad a vender", field:"cantidad", align:"center"},
    {name:"total", label:"Total de la venta", field:"total", align:"center"},
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
])

async function validar() {
    let verificado = true;

    if (idInventario.value === "") {
        mostrarMensajeError("seleccione un inventario");
        verificado = false;
    }
 if (valorUnitario.value === "") {
    mostrarMensajeError("El valor está vacío");
    verificado = false;
} else if (!/^\d+$/.test(valorUnitario.value)) {
    mostrarMensajeError("El valor debe ser un número");
    verificado = false;
}
    if (cantidad.value === "") {
        mostrarMensajeError("Ingrese la cantidad");
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


// async function listarVentas(){
//     const res = await useSales.listarVenta()
//     console.log(res.data);
//     rows.value=res.data.venta
// }

async function listarVentas() {
  try {
    const res = await useSales.listarVenta();
    const ultimaVentaId = obtenerUltimaVenta();

    if (res && res.data && res.data.venta) {
      rows.value = res.data.venta;

      // Ordenar las ventas poniendo la última venta agregada primero
      rows.value.sort((a, b) => {
        if (a._id === ultimaVentaId) return -1;
        if (b._id === ultimaVentaId) return 1;
        return 0; // Mantener el orden por defecto si no se encuentra la última venta
      });

      console.log("Ventas ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar ventas:", error);
  }
}


const organizarInventario = computed(() => {
    nombreCodigo.value = inventarioTodo.value.map((element) => ({
        label: `${element.descripcion} - ${element.codigo}`,
        valor: `${element._id}`,
        nombre: `${element.nombre}`,
    }));
    return nombreCodigo.value;
});


async function listarInventarios() {
    try {
   const res = await useInventario.listarInventario()
    console.log(res.data);
    inventarioTodo.value=res.data.inventario
    } catch (error) {
        console.error("Error al listar inventario:", error);
    }
}
function getInventarioDescripcion(id) {
  const inventario = inventarioTodo.value.find(inventario => inventario._id === id);
  return inventario ? `${inventario.descripcion} - ${inventario.codigo}`: "";
}

    function formatDate(dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    }
function formatCurrency(value) {
  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
      
      function formatCurrencyInput(value) {
  value = value.replace(/\D/g, ''); // Remove all non-digit characters
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots
}

</script>

<template>
    <div class="container">
      <button class="button" @click="agregarventa()">Agregar Venta</button>
  
      <q-table class="table" flat bordered title="Ventas" :rows="rows" :columns="columns" row-key="id">
            <template v-slot:body-cell-idInventario="props">
        <q-td :props="props">
          <p>{{ getInventarioDescripcion(props.row.idInventario) }}</p>
        </q-td>
      </template>
       <template v-slot:body-cell-fecha="props">
      <q-td :props="props">
        <p>{{ formatDate(props.row.fecha) }}</p>
      </q-td>
    </template>
      <template v-slot:body-cell-valorUnitario="props">
        <q-td :props="props">
          <p>{{ formatCurrency(props.row.valorUnitario) }}</p>
        </q-td>
      </template>
      <template v-slot:body-cell-total="props">
        <q-td :props="props">
          <p>{{ formatCurrency(props.row.total) }}</p>
        </q-td>
      </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn class="option-button" @click="editar(props.row)">
              ✏️
                          <q-tooltip v-model="showing">Edita</q-tooltip>

            </q-btn>
          </q-td>
        </template>
      </q-table>
  
  <div  class="filtro" v-if="agregar"> 
      <div class="crearcliente" v-if="agregar">
        <div class="encabezadoCrear">
        <h3>Ingresar Venta</h3>
        <button class="buttonX" @click="cerrar()">X</button>
    </div>
    <div class="inputs">
 <q-select standout v-model="idInventario" :options="organizarInventario" option-value="valor" option-label="label" label="Inventario" style="background-color: #grey; margin-bottom: 20px"
      />
        <!-- <input class="input" type="text" placeholder="Valor Unitario" v-model.trim="valorUnitario" @input="valorUnitario = formatCurrencyInput($event.target.value)" /> -->
        <input class="input" type="text" placeholder="Valor Unitario" v-model.trim="valorUnitario"  />

        <input class="input" type="text" placeholder="Cantidad" v-model.trim="cantidad" />
    </div>
    
    <button v-if="botoneditar ==true" class="button" @click="guardar()" :loading="useSales.loading" style="margin-left: auto; margin-right: auto; display: block;">Guardar</button>
    <button v-else class="button" @click="editarventa()" :loading="useSales.loading" style="margin-left: auto; margin-right: auto; display: block;">Actualizar</button>


      </div>
      </div>
    </div>
  </template>
  


<style scoped>

/* Estilos para el contenedor principal */
.container {
  width: 90vmax;
  margin: 0 auto;
}

/* Estilos para el título */
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.button {
  background-color: #45a049; 
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  margin-bottom: 10px;
  box-shadow: 5px 4px 8px black;
  border-radius: 8px;
}

.button:hover {
  background-color: #77c57b; 
  box-shadow: 3px 2px 10px black;
}
.buttonX {
  background-color: #ffffff00; 
  border: 0 solid #cccccc00; 
  color: #504d4d; 
  font-weight: bold; 
  font-size: 20px; 
  cursor: pointer; 
  transition: transform .2s;
}

.buttonX:hover {
    font-size: 25px; 
  transform: scale(1.2);
  color: #000000; 
}

/* Estilos para los inputs */
.input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Estilos para la tabla */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}

/* Estilos para las opciones de la tabla */
.option-button {
  background-color: #008CBA;
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  margin: 2px;
  border-radius: 4px;
}

.option-button:hover {
  background-color: #005f6b; 
}


.crearcliente {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
width: 50vmax;
margin-left: auto;
  margin-right: auto;
    position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.encabezadoCrear{
    display: flex;
    justify-content: space-between;
}

.crearcliente h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.crearcliente input[type="text"],
.crearcliente input[type="date"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.crearcliente input[type="text"]:focus,
.crearcliente input[type="date"]:focus {
  outline: none;
  border-color: #66afe9;
  box-shadow: 0 0 5px #66afe9;
}

.crearcliente input[type="submit"] {
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.crearcliente input[type="submit"]:hover {
  background-color: #45a049;
}

.filtro{
background-color: #0303039f;
width: 100%;
height:  100%;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%,-50%);
}

</style>
