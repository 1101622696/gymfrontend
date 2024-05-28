import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStoreVentas = defineStore("Ventas", () => {

    let loading = ref(false)
    let ventas =ref([])
    const useUsuario=useStoreUsuarios()
    
    
        const listarVenta= async() =>{
            try {
                loading.value  = true;
                console.log(useUsuario.token);
                const response = await axios.get("api/ventas/listar",{
                    headers:{
                        token: useUsuario.token
                    }
            });
            //    ventas.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de ventas",error);
                throw error;
            }
            finally {
                loading.value=false
        }}
    
    
        const postVenta= async(data) =>{
            try {
                loading.value =true
                const r = await axios.get("api/ventas/escribir", data,{
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
    
        const putVenta= async(id, data) =>{
            try {
                loading.value =true
                const r = await axios.get(`api/ventas/modificar/${id}`, data,{
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
    
        return{ listarVenta, postVenta, putVenta, loading, ventas, useUsuario}
    
    },
    
    {persist: true}
    
    )