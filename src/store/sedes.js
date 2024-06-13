import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStoreSedes = defineStore("Sedes", () => {

    let loading = ref(false)
    let sedes =ref([])
    const useUsuario=useStoreUsuarios()
    
    
        const listarSede= async() =>{
            try {
                loading.value  = true;
                console.log(useUsuario.token);
                const response = await axios.get("api/sedes/listar",{
                    headers:{
                        "x-token": useUsuario.token
                    }
            });
            //    sedes.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de sedes",error);
                console.log(`${useUsuario.token} es el token`);

                throw error;
            }
            finally {
                loading.value=false
        }}
    

        const listaractivadas = async () => {
            try {
              loading.value = true;
              console.log(useUsuario.token);
              const response = await axios.get("api/sedes/listaractivados", {
                headers: {
                  "x-token": useUsuario.token,
                },
              });
              return response;
            } catch (error) {
              console.error("NO se pudo obtener la lista de sedes", error);
              throw error;
            } finally {
              loading.value = false;
            }
          };
      
          const listardesactivadas = async () => {
            try {
              loading.value = true;
              console.log(useUsuario.token);
              const response = await axios.get("api/sedes/listardesactivados", {
                headers: {
                  "x-token": useUsuario.token,
                },
              });
              return response;
            } catch (error) {
              console.error("NO se pudo obtener la lista de sedes", error);
              throw error;
            } finally {
              loading.value = false;
            }}

    
        const postSede= async(data) =>{
            try {
                loading.value =true
                const r = await axios.post("api/sedes/escribir", data,{
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
    
        const putSedes= async(id, data) =>{
            try {
                loading.value =true
                const r = await axios.put(`api/sedes/modificar/${id}`, data,{
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
    
        const putActivarSede= async(id) =>{
            try {
                loading.value =true
                const r = await axios.put(`api/sedes/activar/activos/${id}`, {},{
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
    
        const putDesactivarSede= async(id) =>{
            try {
                loading.value =true
                const r = await axios.put(`api/sedes/desactivar/desactivados/${id}`, {},{
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
    

    
        
        return{ listarSede, listaractivadas,listardesactivadas, postSede, putSedes, putActivarSede, putDesactivarSede, loading, sedes, useUsuario}
    
    },
    
    {persist: true}
    
    )