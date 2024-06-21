
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStoreMaquina = defineStore("Maquina", () => {

    let loading = ref(false)
    let maquinas =ref([])
    const useUsuario=useStoreUsuarios()
    
    
        const listarMaquina= async() =>{
            try {
                loading.value  = true;
                console.log(useUsuario.token);
                const response = await axios.get("api/maquinas/listar",{
                    headers:{
                        "x-token": useUsuario.token
                    }
            });
            //    maquinas.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de maquinas",error);
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
              const response = await axios.get("api/maquinas/listaractivadas", {
                headers: {
                  "x-token": useUsuario.token,
                },
              });
              return response;
            } catch (error) {
              console.error("NO se pudo obtener la lista de maquinas", error);
              throw error;
            } finally {
              loading.value = false;
            }
          };
      
          const listardesactivadas = async () => {
            try {
              loading.value = true;
              console.log(useUsuario.token);
              const response = await axios.get("api/maquinas/listardesactivadas", {
                headers: {
                  "x-token": useUsuario.token,
                },
              });
              return response;
            } catch (error) {
              console.error("NO se pudo obtener la lista de maquinas", error);
              throw error;
            } finally {
              loading.value = false;
            }
          };

    
    
        const postMaquina= async(data) =>{
            try {
                loading.value =true
                const r = await axios.post("api/maquinas/escribir", data,{
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
    
        const putMaquina = async (id, data) => {
            try {
              loading.value = true;
          
              // Verificar que el ID esté definido
              if (!id) {
                throw new Error("ID no definido");
              }
          
              // Realizar la solicitud PUT a la API
              const response = await axios.put(`api/maquinas/modificar/${id}`, data, {
                headers: {
                  "x-token": useUsuario.token // Asegúrate de tener el token correctamente configurado
                }
              });
          
              console.log(response.data); // Loguear la respuesta (opcional)
          
              return response; // Devolver la respuesta completa de Axios
            } catch (error) {
              console.error('Error al actualizar la máquina:', error);
              return error; // Devolver el error para manejarlo en el contexto donde se llama a esta función
            } finally {
              loading.value = false; // Asegurar que loading se restablezca a false sin importar el resultado
            }
          };
          
        const putActivarMaquina= async(id) =>{
            try {
                loading.value =true
                const r = await axios.put(`api/maquinas/activar/activos/${id}`, {},{
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
    
        const putDesactivarMaquina= async(id) =>{
            try {
                loading.value =true
                const r = await axios.put(`api/maquinas/desactivar/desactivos/${id}`, {},{
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
    
    
        return{ listarMaquina,listaractivadas,listardesactivadas, postMaquina, putMaquina, putActivarMaquina, putDesactivarMaquina, loading, maquinas, useUsuario}
    
    },
    
    {persist: true}
    
    )