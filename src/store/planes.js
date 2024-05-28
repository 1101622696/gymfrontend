
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStorePlanes = defineStore("Planes", () => {

    let loading = ref(false)
    let planes =ref([])
    const useUsuario=useStoreUsuarios()
    
    
        const listarPlan= async() =>{
            try {
                loading.value  = true;
                // console.log(token.value);
                const response = await axios.get("api/planes/listar",{
                    headers:{
                        token: useUsuario.token
                    }
            });
            //    planes.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de planes",error);
                throw error;
            }
            finally {
                loading.value=false
        }}
    
    
        const postPlan= async(data) =>{
            try {
                loading.value =true
                const r = await axios.get("api/planes/escribir", data,{
                    headers:{
                        token: useUsuario.token
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
    
        const putPlan= async(id, data) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/planes/modificar/${id}`, data,{
                    headers:{
                        token: useUsuario.token
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
        const putActivarPlan= async(id) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/planes/activar/activos/${id}`, {},{
                    headers:{
                        token: useUsuario.token
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
    
        const putDesactivarPlan= async(id) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/planes/desactivar/desactivados/${id}`, {},{
                    headers:{
                        token: useUsuario.token
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
    
    
        return{ listarPlan, postPlan, putPlan, putActivarPlan, putDesactivarPlan, loading, planes, useUsuario}
    
    },
    
    {persist: true}
    
    )