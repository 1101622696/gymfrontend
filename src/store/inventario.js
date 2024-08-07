
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStoreInventario = defineStore("Inventario", () => {

    let loading = ref(false)
    let inventario =ref([])
    const useUsuario=useStoreUsuarios()


        const listarInventario= async(payload) =>{
            try {
                loading.value  = true;
                let ruta;
                if (payload == null) ruta = "api/inventario/listar";
                else ruta=`api/inventario/listar?busqueda=${payload}`;
                const response = await axios.get(ruta,{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
            });
            //    inventario.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de inventario",error);
                throw error;
            }
            finally {
                loading.value=false
        }}

        const listaractivados = async () => {
          try {
            loading.value = true;
            console.log(localStorage.getItem('x-token'));

            // console.log(useUsuario.token);
            const response = await axios.get("api/inventario/listaractivados", {
              headers: {
                        "x-token": localStorage.getItem('x-token'),

              },
            });
            return response;
          } catch (error) {
            console.error("NO se pudo obtener la lista de inventario", error);
            console.log(`${useUsuario.token} es el token`);

            throw error;
          } finally {
            loading.value = false;
          }
        };

        const listardesactivados = async () => {
          try {
            loading.value = true;
            console.log(localStorage.getItem('x-token'));
            // console.log(useUsuario.token);
            const response = await axios.get("api/inventario/listardesactivados", {
              headers: {
                        "x-token": localStorage.getItem('x-token'),

              },
            });
            return response;
          } catch (error) {
            console.error("NO se pudo obtener la lista de inventario", error);
            throw error;
          } finally {
            loading.value = false;
          }
        };

        const postInventario= async(data) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));

                const r = await axios.post("api/inventario/escribir", data,{
                    headers:{
                        "x-token":useUsuario.token,
                    }
                })
                console.log(r);
                return r
            } catch (error) {
                loading.value =true
                console.log(error);
                return error;
            }finally{
                loading.value = false
            }
        }

        const putInventario= async(id, data) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));

                const r = await axios.put(`api/inventario/modificar/${id}`, data,{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
                })
                console.log(r);
                return r
            } catch (error) {
                loading.value =true
                console.log(error);
                return error;
            }finally{
                loading.value = false
            }
        }
        const putActivarInventario = async (id) => {
            try {
              loading.value = true;
              console.log(localStorage.getItem('x-token'));

              const r = await axios.put(
                `api/inventario/activar/activados/${id}`,
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

          const putDesactivarInventario = async (id) => {
            try {
              loading.value = true;

              console.log(localStorage.getItem('x-token'));

              const r = await axios.put(
                `api/inventario/desactivar/desactivados/${id}`,
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

        return{ listarInventario,listaractivados,listardesactivados, postInventario, putInventario, putActivarInventario, putDesactivarInventario, loading, inventario, useUsuario}

    },

    {persist: true}

    )