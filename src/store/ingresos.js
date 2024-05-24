
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";


export const useStoreIngresos = defineStore("Ingreso", () => {

    let loading = ref(false)
    let ingresos =ref({})
    const useIngrenso=useStoreUsuarios()
    
    
        const listarIngresos= async() =>{
            try {
                loading.value  = true;
                console.log(token.value);
                const response = await axios.get("api/ingresos/listar",{
                    headers:{
                        token: token.value
                    }
            });
               ingresos.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de ingresos",error);
                throw error;
            }
            finally {
                loading.value=false
        }}
    
    
        const postIngresos= async(data) =>{
            try {
                loading.value =true
                const r = await axios.get("api/ingresos/escribir", data,{
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
    
        const putIngresos= async(id, data) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/ingresos/modificar/${id}`, data,{
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
    
        return{ listarIngresos, postIngresos, putIngresos, loading, ingresos, useIngrenso}
    
    },
    
    {persist: true}
    
    )