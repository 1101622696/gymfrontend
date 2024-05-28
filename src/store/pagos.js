import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStorePagos = defineStore("Pagos", () => {

    let loading = ref(false)
    let pagos =([])
    const useUsuario=useStoreUsuarios()
    
    
        const listarPago= async() =>{
            try {
                loading.value  = true;
                console.log(useUsuario.token);
                const response = await axios.get("api/pagos/listar",{
                    headers:{
                        token: useUsuario.token
                    }
            });
            //    pagos.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de pagos",error);
                throw error;
            }
            finally {
                loading.value=false
        }}
    
    
        const postPago= async(data) =>{
            try {
                loading.value =true
                const r = await axios.get("api/pagos/escribir", data,{
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
    
        const putPago= async(id, data) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/pagos/modificar/${id}`, data,{
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
        const putActivarPago= async(id) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/pagos/activar/activos/${id}`, {},{
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
    
        const putDesactivarPago= async(id) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/pagos/desactivar/desactivados/${id}`, {},{
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
    
    
        return{ listarPago, postPago, putPago, putActivarPago, putDesactivarPago, loading, pagos, useUsuario}
    
    },
    
    {persist: true}
    
    )