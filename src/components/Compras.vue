<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useStoreCompras } from "../store/compras.js";
import { useStoreInventario } from "../store/inventario.js";
import { useStoreProveedores } from "../store/proveedores.js";
import { useQuasar } from 'quasar'


const useCompras = useStoreCompras();
const useInventario = useStoreInventario();
const useProveedores = useStoreProveedores();


let agregar=ref(false)
const $q = useQuasar();

let botoneditar=ref(false)

function agregarcompra(){
  botoneditar.value=true
    agregar.value = true;

idInventario.value=""
idProveedor.value=""
valorUnitario.value=""
cantidad.value=""

}
// const idInventario = ref(null);


function guardarUltimaCompra(id) {
  localStorage.setItem('ultimaCompra', id);
}

function obtenerUltimaCompra() {
  return localStorage.getItem('ultimaCompra');
}
async function guardar() {
  if (await validar()) {
    const todo = {
      idInventario: idInventario.value.value, // Usa solo el ID
      idProveedor: idProveedor.value.value,   // Usa solo el ID
      valorUnitario: valorUnitario.value,
      cantidad: cantidad.value
    };

    try {
      let nombrez = await useCompras.postCompra(todo);
      if (nombrez.status === 200) {
        const nuevaCompra = {
          _id: nombrez.data.compra._id,
          idInventario: nombrez.data.compra.idInventario,
          idProveedor: nombrez.data.compra.idProveedor,
          valorUnitario: nombrez.data.compra.valorUnitario,
          cantidad: nombrez.data.compra.cantidad,
        };
        guardarUltimaCompra(nuevaCompra._id);
        rows.value.unshift(nuevaCompra);
        listarCompras();
        listarInventarios();
        listarProveedores();
        agregar.value = false;
        window.location.reload();
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
      label: `${selectedInventario.codigo}-${selectedInventario.descripcion}`,
      value: selectedInventario._id
    };
  }

  const selectedProveedor = proveedorTodo.value.find(proveedor => proveedor._id === info.idProveedor);
  if (selectedProveedor) {
    idProveedor.value = {
      label: `${selectedProveedor.nombre} - ${selectedProveedor.nit}`,
      value: selectedProveedor._id
    };
  }

  cantidad.value = info.cantidad;
  valorUnitario.value = info.valorUnitario;
}


async function editarcompra() {
  if (await validar()) {
        console.log("idInventario:", idInventario.value.value);
    console.log("idProveedor:", idProveedor.value.value);
    const todo = {
      idInventario: idInventario.value.value,
      idProveedor: idProveedor.value.value,
      valorUnitario: valorUnitario.value,
      cantidad: cantidad.value
    };

    if (!informacion.value || !informacion.value._id) {
      console.error("ID de información no definido:", informacion.value);
      mostrarMensajeError("No se pudo enviar, ID no definido");
      return;
    }

    try {
      const response = await useCompras.putCompra(informacion.value._id, todo);
      if (response.status !== 200) {

      } else {
        listarCompras();
        listarInventarios();
        listarProveedores();
  agregar.value = false;

      }
    } catch (error) {
      console.error("Error al actualizar la compra:", error);
    }
  }
}


function cerrar(){
    agregar.value = false;
}

onMounted(()=>{
  listarCompras(), listarInventarios(); listarProveedores()
})

let informacion=ref("")
let idInventario = ref("");
let idProveedor = ref("");
let valorUnitario = ref("");
let cantidad = ref("");
let total = ref("");
let inventarioTodo = ref([]);
let nombreCodigo = ref([]);

let proveedorTodo = ref([]);
let nombreCodigoP = ref([]);

let rows=ref([])
let columns =ref([
    {name:"idInventario", label:"Inventario", field:"idInventario", align:"center"},
    {name:"idProveedor", label:"Proveedor", field:"idProveedor", align:"center"},
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
        if (idProveedor.value === "") {
        mostrarMensajeError("seleccione un proveedor");
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
        // mostrarMensajeExito("El formulario se envió correctamente");
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


// async function listarCompras(){
//     const res = await useCompras.listarVenta()
//     console.log(res.data);
//     rows.value=res.data.venta
// }

async function listarCompras() {
  try {
    const res = await useCompras.listarCompra();
    const ultimaCompraId = obtenerUltimaCompra();

    if (res && res.data && res.data. compra) {
      rows.value = res.data. compra;

      rows.value.sort((a, b) => {
        if (a._id === ultimaCompraId) return -1;
        if (b._id === ultimaCompraId) return 1;
        return 0; 
      });

      console.log("Proveedores ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar proveedores:", error);
  }
}

async function listarInventarios() {
  try {
    const res = await useInventario.listaractivados();
    console.log("Inventario cargado:", res.data);
    inventarioTodo.value = res.data.activados;
  } catch (error) {
    console.error("Error al listar inventario:", error);
  }
}
const organizarInventario = computed(() => {
  return inventarioTodo.value.map((element) => ({
    label: `${element.descripcion} - ${element.codigo}`,
    value: element._id,  
    valor: element.valor 
  }));
});

function getInventarioDescripcion(id) {
  const inventario = inventarioTodo.value.find(inventario => inventario._id === id);
  return inventario ? `${inventario.descripcion} - ${inventario.codigo}`: "";
}

async function listarProveedores() {
  try {
    const res = await useProveedores.listaractivados();
    console.log("Proveedor cargado:", res.data.activados);
    proveedorTodo.value = res.data.activados;
  } catch (error) {
    console.error("Error al listar proveedor:", error);
  }
}
const organizarProveedor = computed(() => {
  return proveedorTodo.value.map((element) => ({
    label: `${element.nombre} - ${element.nit}`,
    value: element._id,  
    valor: element.valor 
  }));
});


function getProveedorNombre(id) {
  const proveedor = proveedorTodo.value.find(proveedor => proveedor._id === id);
  return proveedor ? `${proveedor.nombre} - ${proveedor.nit}`: "";
}


function formatDate(dateString) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota'  // Ajusta esto a tu zona horaria local
  };
  return new Date(dateString).toLocaleString('es-ES', options);
}

function formatCurrency(value) {
  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

      function formatCurrencyInput(value) {
  value = value.replace(/\D/g, '');
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


const ordenar= ref("Todos")
    let listP= ref(false);
    let listF= ref(false);
    let listN= ref("")
    let productobuscado=ref("")
    let fechaBuscada=ref("")
    let busqueda=ref("")

function ejecutarFiltro() {

if (ordenar.value == 'Todos') {
  listarCompras();
  listP.value=false
  listF.value=false
  listN.value=false
  productobuscado.value=""
  fechaBuscada.value=""
  busqueda.value=""
}else if (ordenar.value == 'Inventario') {
  listP.value=true
  listF.value=false
  listN.value=false
}
else if (ordenar.value == 'Fecha') {
  listF.value=true
  listP.value=false
  listN.value=false
}else if (ordenar.value == 'Nombre') {
  listF.value=false
  listP.value=false
  listN.value=true
}};

async function listarporproducto() {
  try {
    console.log(productobuscado.value,"id del rpoducto es estee")
    const res = await useCompras.listarporproducto(productobuscado.value);
  
    if (res && res.data && res.data.venta) {
      rows.value = res.data.venta;

      rows.value.sort((a, b) => {
        if (a._id === ultimaCompraId) return -1;
        if (b._id === ultimaCompraId) return 1;
        return 0; 
      });

      console.log("compras ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar compras:", error);
  }
}

async function buscarporfecha(){
      if (fechaBuscada.value=== "") {
      mostrarMensajeError("debe ingresar un fecha");
    } else {
    try {
      const res = await useCompras.listarporfecha(fechaBuscada.value);
      console.log(res,"esta es la puta respuesta");
rows.value=res.data.compra
    } catch (error) {
        console.error("Error al listar fecahs:", error);
    }}}


    async function ejecutarlistnombre() {
  try {
    const res = await useCompras.listarCompra(busqueda.value);
    const ultimaCompraId = obtenerUltimaCompra();

    if (res && res.data && res.data.compra) {
      rows.value = res.data.compra;

      rows.value.sort((a, b) => {
        if (a._id === ultimaCompraId) return -1;
        if (b._id === ultimaCompraId) return 1;
        return 0; 
      });

      console.log("compras ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar compras:", error);
  }
}


</script>

<template>
    <div class="container">
     

      <div class="tablaselect">

        <button class="button" @click="agregarcompra()">Agregar Compra</button>

        <div class="inputlistar" v-if="listP">
          <select v-model="productobuscado" @change="listarporproducto" class="custom-select2">
            <option disabled value="">Seleccione un producto</option>
            <option v-for="value in organizarInventario" :key="value.id" :value="value.value">{{ value.label }}</option>
          </select>
        </div>

      <div class="inputlistarn" v-if="listN">
      <input class="inputn" type="number" placeholder="Digite codigo" v-model.trim="busqueda" />
      <button class="button"  id="buttonf" @click="ejecutarlistnombre()" style="margin-left: auto; margin-right: auto; display: block;">Buscar</button>
    </div>


<div class="inputlistarcumple" v-if="listF">
  <input class="inputc" type="date" v-model="fechaBuscada" required />
  <button class="button" id="buttonf" @click="buscarporfecha()" style="margin-left: auto; margin-right: auto; display: block;">Buscar</button>
</div>


      <select v-model="ordenar" @change="ejecutarFiltro" class="custom-select">
        <option value="Todos">Todos</option>
        <option value="Fecha">Por Fecha</option>
        <option value="Nombre">Codigo</option>
        <option value="Inventario">Por Producto</option>
      </select>
    </div>

    <div class="tituloTabla">
      Compras
     </div>

      <q-table class="table" flat bordered  :rows="rows" :columns="columns" row-key="id">
            <template v-slot:body-cell-idInventario="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
          <p>{{ getInventarioDescripcion(props.row.idInventario) }}</p>
        </q-td>
      </template>
                  <template v-slot:body-cell-idProveedor="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
          <p>{{ getProveedorNombre(props.row.idProveedor) }}</p>
        </q-td>
      </template>
<template v-slot:body-cell-fecha="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ formatDate(props.row.fecha) }}</p>
  </q-td>
</template>
      <template v-slot:body-cell-valorUnitario="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
          <p>{{ formatCurrency(props.row.valorUnitario) }}</p>
        </q-td>
      </template>
      <template v-slot:body-cell-total="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
          <p>{{ formatCurrency(props.row.total) }}</p>
        </q-td>
      </template>
        <template v-slot:body-cell-opciones="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
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
        <h3>Ingresar Compra</h3>
        <button class="buttonX" @click="cerrar()">X</button>
    </div>
    <div class="inputs">
 <q-select standout v-model="idInventario" :options="organizarInventario" option-value="valor" option-label="label" label="Inventario" style="background-color: #grey; margin-bottom: 20px"
      />
       <q-select standout v-model="idProveedor" :options="organizarProveedor" option-value="valor" option-label="label" label="Proveedor" style="background-color: #grey; margin-bottom: 20px"
      />
      <q-input class="input" filled v-model.trim="valorUnitario" label="Valor Unitario" :dense="dense" />
      <q-input class="input" filled v-model.trim="cantidad" label="Cantidad" :dense="dense" />
    </div>

    <button v-if="botoneditar ==true" class="button" @click="guardar()" :loading="useCompras.loading" style="margin-left: auto; margin-right: auto; display: block;">Guardar</button>
    <button v-else class="button" @click="editarcompra()" :loading="useCompras.loading" style="margin-left: auto; margin-right: auto; display: block;">Actualizar</button>


      </div>
      </div>
    </div>
  </template>



  <style scoped>

  .container {
    width: 97vmax;
    margin: 0 auto;
    min-height:auto;
  overflow:hidden !important;
  }


  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .button {
 
 border: none;
 color: black;
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

  .input {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border-radius: 4px;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #f8141400;
    margin-top: 7vmax;
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
    background-color: #dadada;
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

  .custom-select {
    position:absolute;
     width: 10vmax;
     height: 4vmin;
     border-radius: 4vmin;
     right: 1%;
     margin-top:0.8vmin;
     z-index: 1;
     box-shadow: 0px 2px 5px black; 
     border: none;
     outline: none;
   }
  .tablaselect{
    display: flex;
    position: absolute;
    width: 95%;
    margin-top: 6vmax;
  }


  .custom-select2 {
    position:absolute;
     width: 13vmax;
     height: 4vmin;
     border-radius: 4vmin;
     right: 15%;
     margin-top:0.8vmin;
     z-index: 1;
     box-shadow: 0px 2px 5px black; 
     border: none;
     outline: none;
   }

   .inputlistarcumple{
     position:absolute;
     width: auto;
     height: 4.5vmin;
     background-color: rgba(16, 16, 16, 0);
     right: 15%;
     margin-top:0.8vmin;
     z-index: 1;
     display: flex;
     flex-direction: row;

   gap:1vmin;
   border-radius: 1vmin;
   align-items: center;
   }

   .inputlistarn{
     position:absolute;
     width: auto;
     height: 4.5vmin;
     gap: 1vmin;
     background-color: rgba(16, 16, 16, 0);
     right: 15%;
     margin-top:0.5vmin;
     z-index: 1;
     display: flex;
     flex-direction: row;
   align-items: center;

   }

   .inputn{
     width: 15vmax;
     margin: 8px 0;
     height: 2.5vmin;
     box-sizing: border-box;
     border: 1px solid #ccc;
     border-radius: 1vmin;
     border: solid 1.5px black;
   }
   .inputc{
     width: 10vmax;
     margin: 8px 0;
     height: 2.5vmin;
     box-sizing: border-box;
     border: 1px solid #ccc;
     border-radius: 1vmin;
     border: solid 1.5px black;
   }

   #buttonf{
    padding: 0px;
    width: 8vmin;
    height: 2.5vmin;
    display: flex;
    text-align: center;
    padding: 0px;
    font-size: small;
    margin: 0px;
    margin-bottom: 1px;
  }

  .tituloTabla{
    margin-top: 1vmax;
      font-size: xx-large;
      display: flex;
      text-align: center;
      justify-content: center;
    }

  </style>

