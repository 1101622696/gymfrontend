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
                console.log(`este es el usuariotoken ${useUsuario.token}`);
                console.log(` este es el local ${localStorage.getItem('x-token')}`);
                const response = await axios.get("api/sedes/listar",{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
            });
            //    sedes.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de sedes",error);
                // console.log(`${useUsuario.token} es el token`);

                throw error;
            }
            finally {
                loading.value=false
        }}
    

        const listaractivadas = async () => {
            try {
              loading.value = true;
              console.log(localStorage.getItem('x-token'));
              // console.log(useUsuario.token);
              const response = await axios.get("api/sedes/listaractivados", {
                headers: {
                          "x-token": localStorage.getItem('x-token'),

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
              console.log(localStorage.getItem('x-token'));
              // console.log(useUsuario.token);
              const response = await axios.get("api/sedes/listardesactivados", {
                headers: {
                          "x-token": localStorage.getItem('x-token'),

                },
              });
              return response;
            } catch (error) {
              console.error("NO se pudo obtener la lista de sedes", error);
              throw error;
            } finally {
              loading.value = false;
            }}

    
        const postSede = async (data) => {
            const loading = ref(true);
            console.log(localStorage.getItem('x-token'));
            try {
              const response = await axios.post("api/sedes/escribir", data, {
                headers: {
                          "x-token": localStorage.getItem('x-token'),

                }
              });
              console.log(response);
              return response;
            } catch (error) {
              console.log(error);
              throw new Error(error.response ? error.response.data.error : error.message);
            } finally {
              loading.value = false;
            }
          };
    
          const putSedes = async (id, data) => {
            try {
              loading.value = true;
              console.log(localStorage.getItem('x-token'));
              if (!id) {
                throw new Error("ID no definido");
              }
              const r = await axios.put(`api/sedes/modificar/${id}`, data, {
                headers: {
                          "x-token": localStorage.getItem('x-token'),

                }
              });
              console.log(r);
              return r;
            } catch (error) {
              loading.value = false;
              console.log(error);
              return error;
            } finally {
              loading.value = false;
            }
          };
          
    
        const putActivarSede= async(id) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));
                const r = await axios.put(`api/sedes/activar/activos/${id}`, {},{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

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
                console.log(localStorage.getItem('x-token'));
                const r = await axios.put(`api/sedes/desactivar/desactivados/${id}`, {},{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

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