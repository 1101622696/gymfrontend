
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStoreClientes = defineStore("Cliente", () => {

    let loading = ref(false)
    let clientes =ref([])
    const useUsuario=useStoreUsuarios()
    
    
        const listarCliente= async() =>{
            try {
                loading.value  = true;
                console.log(useUsuario.token);
                const response = await axios.get("api/clientes/listar",{
                    headers:{
                        token: useUsuario.token
                    }
            });
            //    clientes.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de clientes",error);
                throw error;
            }
            finally {
                loading.value=false
        }}
    
    
        const postCliente= async(data) =>{
            try {
                loading.value =true
                const r = await axios.get("api/clientes/escribir", data,{
                    headers:{
                        token:useUsuario.token
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
    
        const putCliente= async(id, data) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/clientes/modificar/${id}`, data,{
                    headers:{
                        token:useUsuario.token
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
        const putActivarCliente= async(id) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/clientes/activar/activos/${id}`, {},{
                    headers:{
                        token:useUsuario.token
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
    
        const putDesactivarCliente= async(id) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/clientes/desactivar/desactivados/${id}`, {},{
                    headers:{
                        token:useUsuario.token
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
    
    
        return{ listarCliente, postCliente, putCliente, putActivarCliente, putDesactivarCliente, loading, clientes, useUsuario}
    
    },
    
    {persist: true}
    
    )