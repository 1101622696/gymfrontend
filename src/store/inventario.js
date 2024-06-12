
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStoreInventario = defineStore("Inventario", () => {

    let loading = ref(false)
    let inventario =ref([])
    const useUsuario=useStoreUsuarios()
    
    
        const listarInventario= async() =>{
            try {
                loading.value  = true;
                console.log(useUsuario.token);
                const response = await axios.get("api/inventario/listar",{
                    headers:{
                        "x-token": useUsuario.token
                    }
            });
            //    inventario.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de inventario",error);
                throw error;
            }
            finally {
                loading.value=false
        }}
    
    
        const postInventario= async(data) =>{
            try {
                loading.value =true
                const r = await axios.post("api/inventario/escribir", data,{
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
    
        const putInventario= async(id, data) =>{
            try {
                loading.value =true
                const r = await axios.put(`api/inventario/modificar/${id}`, data,{
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
        const putActivarInventario = async (id) => {
            try {
              loading.value = true;
              const r = await axios.put(
                `api/inventario/activar/activados/${id}`,
                {},
                {
                  headers: {
                    "x-token": useUsuario.token,
                  },
                }
              );
              console.log(r);
              return r;
            } catch (error) {
              loading.value = true;
              console.log(error);
              return error;
            } finally {
              loading.value = false;
            }
          };
      
          const putDesactivarInventario = async (id) => {
            try {
              loading.value = true;
              const r = await axios.put(
                `api/inventario/desactivar/desactivados/${id}`,
                {},
                {
                  headers: {
                    "x-token": useUsuario.token,
                  },
                }
              );
              console.log(r);
              return r;
            } catch (error) {
              loading.value = true;
              console.log(error);
              return error;
            } finally {
              loading.value = false;
            }
          };
    
        return{ listarInventario, postInventario, putInventario, putActivarInventario, putDesactivarInventario, loading, inventario, useUsuario}
    
    },
    
    {persist: true}
    
    )