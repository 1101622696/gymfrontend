
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStoreMantenimiento = defineStore("Mantenimiento", () => {

    let loading = ref(false)
    let mantenimiento =ref({})
    const useMantenimiento=useStoreUsuarios()
    
    
        const listarMantenimiento= async() =>{
            try {
                loading.value  = true;
                console.log(token.value);
                const response = await axios.get("api/mantenimiento/listar",{
                    headers:{
                        token: token.value
                    }
            });
               mantenimiento.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de mantenimiento",error);
                throw error;
            }
            finally {
                loading.value=false
        }}
    
    
        const postMantenimiento= async(data) =>{
            try {
                loading.value =true
                const r = await axios.get("api/mantenimiento/escribir", data,{
                    headers:{
                        token:token.value
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
    
        const putMantenimiento= async(id, data) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/mantenimiento/modificar/${id}`, data,{
                    headers:{
                        token:token.value
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
    
        return{ listarMantenimiento, postMantenimiento, putMantenimiento, token, loading, mantenimiento, useMantenimiento}
    
    },
    
    {persist: true}
    
    )