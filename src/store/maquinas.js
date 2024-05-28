
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStoreMaquina = defineStore("Maquina", () => {

    let loading = ref(false)
    let maquinas =ref([])
    const useUsuario=useStoreUsuarios()
    
    
        const listarMaquina= async() =>{
            try {
                loading.value  = true;
                console.log(useUsuario.token);
                const response = await axios.get("api/maquinas/listar",{
                    headers:{
                        token: useUsuario.token
                    }
            });
            //    maquinas.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de maquinas",error);
                throw error;
            }
            finally {
                loading.value=false
        }}
    
    
        const postMaquina= async(data) =>{
            try {
                loading.value =true
                const r = await axios.get("api/maquinas/escribir", data,{
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
    
        const putMaquina= async(id, data) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/maquinas/modificar/${id}`, data,{
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
        const putActivarMaquina= async(id) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/maquinas/activar/activos/${id}`, {},{
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
    
        const putDesactivarMaquina= async(id) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/maquinas/desactivar/desactivados/${id}`, {},{
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
    
    
        return{ listarMaquina, postMaquina, putMaquina, putActivarMaquina, putDesactivarMaquina, loading, maquinas, useUsuario}
    
    },
    
    {persist: true}
    
    )