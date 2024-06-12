
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";


export const useStoreIngresos = defineStore("Ingreso", () => {

    let loading = ref(false)
    let ingresos =ref([])
    const useUsuario=useStoreUsuarios()
    
    
        const listarIngreso= async() =>{
            try {
                loading.value  = true;
                console.log(useUsuario.token);
                const response = await axios.get("api/ingresos/listar",{
                    headers:{
                        token: useUsuario.token
                    }
            });
            //    ingresos.value = response.data;
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
    
        const putIngresos= async(id, data) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/ingresos/modificar/${id}`, data,{
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
    
        return{ listarIngreso, postIngresos, putIngresos, loading, ingresos, useUsuario}
    
    },
    
    {persist: true}
    
    )