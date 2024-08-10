import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStoreProveedores = defineStore("Proveedores", () => {

    let loading = ref(false)
    let proveedores =ref([])
    const useUsuario=useStoreUsuarios()


        const listarProveedor= async(payload) =>{
            try {
                loading.value  = true;
                console.log(`este es el usuariotoken ${useUsuario.token}`);
                console.log(` este es el local ${localStorage.getItem('x-token')}`);
                let ruta;
                if (payload == null) ruta = "api/proveedores/listar";
                else ruta=`api/proveedores/listar?busqueda=${payload}`;
                const response = await axios.get(ruta,{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
            });
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de proveedores",error);
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
              const response = await axios.get("api/proveedores/listaractivados", {
                headers: {
                          "x-token": localStorage.getItem('x-token'),

                },
              });
              console.log(response,"este es el puto response");
              return response;
            } catch (error) {
              console.error("NO se pudo obtener la lista de proveedores", error);
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
              const response = await axios.get("api/proveedores/listardesactivados", {
                headers: {
                          "x-token": localStorage.getItem('x-token'),

                },
              });
              return response;
            } catch (error) {
              console.error("NO se pudo obtener la lista de proveedores", error);
              throw error;
            } finally {
              loading.value = false;
            }}


        const postProveedor = async (data) => {
            const loading = ref(true);
            console.log(localStorage.getItem('x-token'));
            try {
              const response = await axios.post("api/proveedores/escribir", data, {
                headers: {
                          "x-token": localStorage.getItem('x-token'),

                }
              });
              console.log(response);
              return response;
            } catch (error) {
              console.log(error);
              throw new Error(error.response ? error.response.data.error : error.message);
            } finally {
              loading.value = false;
            }
          };

          const putProveedor = async (id, data) => {
            try {
              loading.value = true;
              console.log(localStorage.getItem('x-token'));
              if (!id) {
                throw new Error("ID no definido");
              }
              const r = await axios.put(`api/proveedores/modificar/${id}`, data, {
                headers: {
                          "x-token": localStorage.getItem('x-token'),

                }
              });
              console.log(r);
              return r;
            } catch (error) {
              loading.value = false;
              console.log(error);
              return error;
            } finally {
              loading.value = false;
            }
          };


        const putActivarProveedor= async(id) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));
                const r = await axios.put(`api/proveedores/activar/${id}`, {},{
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

        const putDesactivarProveedor= async(id) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));
                const r = await axios.put(`api/proveedores/desactivar/${id}`, {},{
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




        return{ listarProveedor, listaractivados,listardesactivados, postProveedor, putProveedor, putActivarProveedor, putDesactivarProveedor, loading, proveedores, useUsuario}

    },

    {persist: true}

    )