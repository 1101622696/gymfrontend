
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
                        "x-token": useUsuario.token
                    }
            });
            //    ingresos.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de ingresos",error);
        console.log(`${useUsuario.token} es el token`);

                throw error;
            }
            finally {
                loading.value=false
        }}
    
    
        const postIngresos= async(data) =>{
            try {
                loading.value =true
                const r = await axios.post("api/ingresos/escribir", data,{
                    headers:{
                        "x-token": useUsuario.token
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
                const r = await axios.put(`api/ingresos/modificar/${id}`, data,{
                    headers:{
                        "x-token":useUsuario.token
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