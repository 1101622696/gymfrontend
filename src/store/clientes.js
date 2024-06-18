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
            "x-token": useUsuario.token,
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
            "x-token": useUsuario.token,
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
            "x-token": useUsuario.token,
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
        console.log(useUsuario.token);
        const response = await axios.get(`api/clientes/porplan/${id}`, {
          headers: {
            "x-token": useUsuario.token,
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
          const response = await axios.get(`/api/clientes/cumpleanos?dia=${dia}&mes=${mes}`, {
              headers: {
                  "x-token": useUsuario.token,
              },
          });
          return response.data;
      } catch (error) {
          console.error("No se pudo obtener la lista de clientes", error);
          throw error;
      } finally {
          loading.value = false;
      }
  };


    // const postCliente = async (data) => {
    //   try {
    //     loading.value = true;
    //     const r = await axios.get("api/clientes/escribir", data, {
    //       headers: {
    //         token: useUsuario.token,
    //       },
    //     });
    //     console.log(r);
    //     return r;
    //   } catch (error) {
    //     loading.value = true;
    //     console.log(error);
    //     return error;
    //   } finally {
    //     loading.value = false;
    //   }
    // };
    const postCliente = async (data) => {
      try {
        loading.value = true;
        const r = await axios.post("api/clientes/escribir", data, {
          headers: {
            "x-token": useUsuario.token,
          },
        });
        console.log(r);
        return r;
      } catch (error) {
        console.log(error);
        return error;
      } finally {
        loading.value = false;
      }
    };

    const putCliente = async (id, data) => {
      try {
        loading.value = true;
        const r = await axios.put(`api/clientes/modificar/${id}`, data, {
          headers: {
            "x-token": useUsuario.token,
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
        const r = await axios.put(
          `api/clientes/activar/activados/${id}`,
          {},
          {
            headers: {
              "x-token": useUsuario.token,
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
        const r = await axios.put(
          `api/clientes/desactivar/desactivados/${id}`,
          {},
          {
            headers: {
              "x-token": useUsuario.token,
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
    
    // const putClienteSeguimiento = async (id, seguimiento) => {
    //   try {
    //     console.log('Objeto seguimiento:', seguimiento); // Agrega este console.log
    
    //     const r = await axios.put(
    //       `/api/clientes/modificar/seguimiento/${id}`,
    //       { seguimiento }, // Enviar el objeto de seguimiento correctamente
    //       {
    //         headers: {
    //           "x-token": useUsuario.token,
    //         },
    //       }
    //     );
    //     console.log("Respuesta del servidor:", r);
    //     clienteTodo.value = r.data.cliente;
    //   } catch (error) {
    //     console.error("Error al actualizar seguimiento:", error);
    //   }
    // };
    const putClienteSeguimiento = async (id, seguimientos) => {
      try {
        console.log('Objeto seguimiento:', seguimientos); // Agrega este console.log
        const r = await axios.put(
          `/api/clientes/modificar/seguimiento/${id}`,
          { seguimiento: seguimientos }, // Enviar el objeto seguimientos como seguimiento
          {
            headers: {
              "x-token": useUsuario.token,
            },
          }
        );
        console.log("Respuesta del servidor:", r);
        clienteTodo.value = r.data.cliente;
      } catch (error) {
        console.error("Error al actualizar seguimiento:", error);
      }
    };
  

    // const putClienteSeguimiento = async (id) => {
    //   try {
    //     const r = await axios.put(
    //       `api/clientes/modificar/seguimiento/${id}`,
    //       {},
    //       {
    //         headers: {
    //           "x-token": useUsuario.token,
    //         },
    //       }
    //     );
    //     console.log(r);
    //     clienteTodo.value = r.data.cliente;
    //   } catch (error) {
    //     console.error("Error al actualizar seguimiento:", error);
    //   }
    // };
    
    
    
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
      // putseaguictivarCliente,
      putClienteSeguimiento,
      loading,
      clientes,
      useUsuario,
    };
  },

  { persist: true }
);