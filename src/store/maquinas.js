
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStoreMaquina = defineStore("Maquina", () => {

    let loading = ref(false)
    let maquinas =ref([])
    const useUsuario=useStoreUsuarios()


        const listarMaquina= async(payload) =>{
            try {
                loading.value  = true;
                console.log(`este es el usuariotoken ${useUsuario.token}`);
                console.log(` este es el local ${localStorage.getItem('x-token')}`);
                let ruta;
                if (payload == null) ruta = "api/maquinas/listar";
                else ruta=`api/maquinas/listar?busqueda=${payload}`;
                const response = await axios.get(ruta,{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
            });
            //    maquinas.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de maquinas",error);
                console.log(`${useUsuario.token} es el token`);

                throw error;
            }
            finally {
                loading.value=false
        }}

        const listarid = async (id) => {
          try {
            loading.value = true;
            console.log(localStorage.getItem('x-token'));
            // console.log(useUsuario.token);
            const response = await axios.get(`api/maquinas/listarid/${id}`, {
              headers: {
                        "x-token": localStorage.getItem('x-token'),

              },
            });
            return response;
          } catch (error) {
            console.error("NO se pudo obtener la lista de maquinas", error);
            throw error;
          } finally {
            loading.value = false;
          }
        };

        const listaractivadas = async () => {
            try {
              loading.value = true;
              console.log(localStorage.getItem('x-token'));
              // console.log(useUsuario.token);
              const response = await axios.get("api/maquinas/listaractivadas", {
                headers: {
                          "x-token": localStorage.getItem('x-token'),

                },
              });
              return response;
            } catch (error) {
              console.error("NO se pudo obtener la lista de maquinas", error);
              throw error;
            } finally {
              loading.value = false;
            }
          };

          const listardesactivadas = async () => {
            try {
              loading.value = true;
              console.log(localStorage.getItem('x-token'));

              // console.log(useUsuario.token);
              const response = await axios.get("api/maquinas/listardesactivadas", {
                headers: {
                          "x-token": localStorage.getItem('x-token'),

                },
              });
              return response;
            } catch (error) {
              console.error("NO se pudo obtener la lista de maquinas", error);
              throw error;
            } finally {
              loading.value = false;
            }
          };



        const postMaquina= async(data) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));

                const r = await axios.post("api/maquinas/escribir", data,{
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

        const putMaquina = async (id, data) => {
            try {
              loading.value = true;
              console.log(localStorage.getItem('x-token'));

              if (!id) {
                throw new Error("ID no definido");
              }
                        const response = await axios.put(`api/maquinas/modificar/${id}`, data, {
                headers: {
                          "x-token": localStorage.getItem('x-token'),

                }
              });

              console.log(response.data);

              return response;
            } catch (error) {
              console.error('Error al actualizar la máquina:', error);
              return error;
            } finally {
              loading.value = false;
            }
          };

        const putActivarMaquina= async(id) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));

                const r = await axios.put(`api/maquinas/activar/activos/${id}`, {},{
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

        const putDesactivarMaquina= async(id) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));

                const r = await axios.put(`api/maquinas/desactivar/desactivos/${id}`, {},{
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


        return{ listarMaquina,listaractivadas,listarid,listardesactivadas, postMaquina, putMaquina, putActivarMaquina, putDesactivarMaquina, loading, maquinas, useUsuario}

    },

    {persist: true}

    )