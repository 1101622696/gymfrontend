import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStoreClientes = defineStore(
  "Cliente",
  () => {
    let loading = ref(false);
    let clientes = ref([]);
    const useUsuario = useStoreUsuarios();

    const listarCliente = async (payload) => {
      try {
        loading.value = true;
        console.log(useUsuario.token);
        let ruta;
        if (payload == null) ruta = "api/clientes/listar";
        else ruta=`api/clientes/listar?busqueda=${payload}`;
        const response = await axios.get(ruta, {
          headers: {
            token: useUsuario.token,
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
        console.log(useUsuario.token);
        const response = await axios.get("api/clientes/listaractivados", {
          headers: {
            token: useUsuario.token,
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
        console.log(useUsuario.token);
        const response = await axios.get("api/clientes/listardesactivados", {
          headers: {
            token: useUsuario.token,
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

    const postCliente = async (data) => {
      try {
        loading.value = true;
        const r = await axios.get("api/clientes/escribir", data, {
          headers: {
            token: useUsuario.token,
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

    const putCliente = async (id, data) => {
      try {
        loading.value = true;
        const r = await axios.get(`api/clientes/modificar/${id}`, data, {
          headers: {
            token: useUsuario.token,
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
        const r = await axios.get(
          `api/clientes/activar/activos/${id}`,
          {},
          {
            headers: {
              token: useUsuario.token,
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
        const r = await axios.get(
          `api/clientes/desactivar/desactivados/${id}`,
          {},
          {
            headers: {
              token: useUsuario.token,
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
    
    const actualizarSeguimiento = async () => {
      try {
        const r = await axios.put(
          `api/clientes/modificar/seguimiento/${clienteTodo._id.value}`,
          { seguimientos: seguimientos.value },
          {
            headers: {
              token: useUsuario.token,
            },
          }
        );
        console.log(r);
        clienteTodo.value = r.data.cliente;
      } catch (error) {
        console.error("Error al listar clientes:", error);
      }
    };
    
    return {
      listarCliente,
      listaractivados,
      listardesactivados,
      postCliente,
      putCliente,
      putActivarCliente,
      // putseaguictivarCliente,
      actualizarSeguimiento,
      loading,
      clientes,
      useUsuario,
    };
  },

  { persist: true }
);
