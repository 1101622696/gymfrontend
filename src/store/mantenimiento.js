
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStoreMantenimiento = defineStore("Mantenimiento", () => {

    let loading = ref(false)
    let mantenimiento =ref([])
    const useUsuario=useStoreUsuarios()
    
    
        const listarMantenimiento= async() =>{
            try {
                loading.value  = true;
                console.log(`este es el usuariotoken ${useUsuario.token}`);
                console.log(` este es el local ${localStorage.getItem('x-token')}`);
                const response = await axios.get("api/mantenimiento/listar",{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
            });
            //    mantenimiento.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de mantenimiento",error);
                console.log(`${useUsuario.token} es el token`);

                throw error;
            }
            finally {
                loading.value=false
        }}
    
    
        const postMantenimiento= async(data) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));

                const r = await axios.post("api/mantenimiento/escribir", data,{
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
    
        const putMantenimiento= async(id, data) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));
                const r = await axios.put(`api/mantenimiento/modificar/${id}`, data,{
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
    
        return{ listarMantenimiento, postMantenimiento, putMantenimiento, loading, mantenimiento, useUsuario}
    
    },
    
    {persist: true}
    
    )