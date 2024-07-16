import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";
import { Notify } from "quasar";

export const useStoreClientes = defineStore(
  "Cliente",
  () => {
    let loading = ref(false);
    let clientes = ref([]);
    const useUsuario = useStoreUsuarios();

    const listarCliente = async (payload) => {
      try {
        loading.value = true;
        // console.log(useUsuario.token);
        console.log(localStorage.getItem('x-token'));

        let ruta;
        if (payload == null) ruta = "api/clientes/listar";
        else ruta=`api/clientes/listar?busqueda=${payload}`;
        const response = await axios.get(ruta, {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        });
        //    clientes.value = response.data;
        return response;
      } catch (error) {
        console.error("NO se pudo obtener la lista de clientes", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };


    const listaractivados = async () => {
      try {
        loading.value = true;
        // console.log(useUsuario.token);
        console.log(localStorage.getItem('x-token'));

        const response = await axios.get("api/clientes/listaractivados", {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        });
        //    clientes.value = response.data;
        return response;
      } catch (error) {
        console.error("NO se pudo obtener la lista de clientes", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };

    const listardesactivados = async () => {
      try {
        loading.value = true;
        // console.log(useUsuario.token);
        console.log(localStorage.getItem('x-token'));

        const response = await axios.get("api/clientes/listardesactivados", {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        });
        //    clientes.value = response.data;
        return response;
      } catch (error) {
        console.error("NO se pudo obtener la lista de clientes", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };

    const listarClientesporPlan = async (id) => {
      try {
        loading.value = true;
        console.log(`este es el usuariotoken ${useUsuario.token}`);
        console.log(` este es el local ${localStorage.getItem('x-token')}`);

        const response = await axios.get(`api/clientes/porplan/${id}`, {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        });
        //    clientes.value = response.data;
        return response;
      } catch (error) {
        console.error("NO se pudo obtener la lista de clientes", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };
    const listarClientesporCumpleanos = async (dia, mes) => {
      try {
          loading.value = true;
          console.log(`Enviando solicitud para día ${dia} y mes ${mes}`);
  
          const response = await axios.get('/api/clientes/cumpleanos', {
              params: { dia, mes },
              headers: {
                  "x-token": localStorage.getItem('x-token'),
              },
          });
  
          console.log('Respuesta del servidor:', response.data);
          return response.data;
      } catch (error) {
          console.error("Error al obtener la lista de clientes:", error.response?.data || error.message);
          throw error;
      } finally {
          loading.value = false;
      }
  };

    const postCliente = async (data) => {
      try {
        loading.value = true;
        console.log(localStorage.getItem('x-token'));

        const r = await axios.post("api/clientes/escribir", data, {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        });
        Notify.create({
          message: 'Cliente registrado correctamente',
          color: "positive",
          position: "top",
        })
        console.log(r);
        return r;
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.respone.data.errors[0].msj
        })
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };

    const putCliente = async (id, data) => {
      try {
        loading.value = true;

        console.log(localStorage.getItem('x-token'));

        const r = await axios.put(`api/clientes/modificar/${id}`, data, {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        });
        console.log(r);
        return r;
      } catch (error) {
        loading.value = true;
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };
    const putActivarCliente = async (id) => {
      try {
        loading.value = true;
        console.log(localStorage.getItem('x-token'));

        const r = await axios.put(
          `api/clientes/activar/activados/${id}`,
          {},
          {
            headers: {
                     "x-token": localStorage.getItem('x-token'),
            },
          }
        );
        console.log(r);
        return r;
      } catch (error) {
        loading.value = true;
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };

    const putDesactivarCliente = async (id) => {
      try {
        loading.value = true;
        console.log(localStorage.getItem('x-token'));

        const r = await axios.put(
          `api/clientes/desactivar/desactivados/${id}`,
          {},
          {
            headers: {
                     "x-token": localStorage.getItem('x-token'),
            },
          }
        );
        console.log(r);
        return r;
      } catch (error) {
        loading.value = true;
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };
    

    const putClienteSeguimiento = async (id, seguimientos) => {
      try {
        loading.value = true;
        console.log(localStorage.getItem('x-token'));

        console.log('Datos a enviar:', seguimientos); // Añade este console.log para verificar la estructura de datos
    
        const response = await axios.put(
          `/api/clientes/modificar/seguimiento/${id}`,
          { seguimiento: seguimientos.seguimiento }, // Envía directamente el array de seguimiento
          {
            headers: {
                     "x-token": localStorage.getItem('x-token'),
            },
          }
        );
    
        console.log("Respuesta del servidor:", response.data);
        

      } catch (error) {
        console.error("Error al actualizar seguimiento:", error);
      }
    }
    const putEditaSeguimiento = async (clienteId, seguimientoId, seguimientoData) => {
      try {
        const response = await axios.put(
          `/api/clientes/editar/seguimiento/${clienteId}/${seguimientoId}`,
          { seguimiento: [seguimientoData] },
          {
            headers: {
              "Content-Type": "application/json",
              "x-token": localStorage.getItem('x-token'),
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error en putEditaSeguimiento:", error);
        throw error;
      }
    };
    
    
    return {
      listarCliente,
      listaractivados,
      listardesactivados,
      listarClientesporPlan,
      listarClientesporCumpleanos,
      postCliente,
      putCliente,
      putActivarCliente,
      putDesactivarCliente,
      putEditaSeguimiento,
      // putseaguictivarCliente,
      putClienteSeguimiento,
      loading,
      clientes,
      useUsuario,
    };
  },

  { persist: true }
);