
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
                console.log(useUsuario.token);
                const response = await axios.get("api/planes/listar",{
                    headers:{
                        "x-token": useUsuario.token
                    }
            });
            //    planes.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de planes",error);
                console.log(`${useUsuario.token} es el token`);

                throw error;
            }
            finally {
                loading.value=false
        }}
    
        const listaractivados = async () => {
            try {
              loading.value = true;
              console.log(useUsuario.token);
              const response = await axios.get("api/planes/listaractivos", {
                headers: {
                  "x-token": useUsuario.token,
                },
              });
              return response;
            } catch (error) {
              console.error("NO se pudo obtener la lista de planes", error);
              throw error;
            } finally {
              loading.value = false;
            }
          };
      
          const listardesactivados = async () => {
            try {
              loading.value = true;
              console.log(useUsuario.token);
              const response = await axios.get("api/planes/listardesactivados", {
                headers: {
                  "x-token": useUsuario.token,
                },
              });
              return response;
            } catch (error) {
              console.error("NO se pudo obtener la lista de planes", error);
              throw error;
            } finally {
              loading.value = false;
            }
          };
    
        const postPlan= async(data) =>{
            try {
                loading.value =true
                const r = await axios.post("api/planes/escribir", data,{
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
    
        const putPlan= async(id, data) =>{
            try {
                loading.value =true
                const r = await axios.put(`api/planes/modificar/${id}`, data,{
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
        const putActivarPlan= async(id) =>{
            try {
                loading.value =true
                const r = await axios.put(`api/planes/activar/activos/${id}`, {},{
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
    
        const putDesactivarPlan= async(id) =>{
            try {
                loading.value =true
                const r = await axios.put(`api/planes/desactivar/desactivados/${id}`, {},{
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
    
    
        return{ listarPlan, listaractivados,listardesactivados, postPlan, putPlan, putActivarPlan, putDesactivarPlan, loading, planes, useUsuario}
    
    },
    
    {persist: true}
    
    )