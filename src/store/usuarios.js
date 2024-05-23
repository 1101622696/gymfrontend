import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import {Notify} from "quasar"


export const useStoreUsuarios = defineStore("Usuarios", () => {

    let token = ref("")
let loading = ref(false)
    let usuarios =ref({})
    let user = ref({})



    const listarUsuarios= async() =>{
        try {
            loading.value  = true;
            console.log(token.value);
            const response = await axios.get("api/usuarios",{
                headers:{
                    token: token.value
                }
        });
           usuarios.value = response.data;
           return response;
        } catch (error) {
            console.error("NO se pudo obtener la lista de usuarios",error);
            throw error;
        }
        finally {
            loading.value=false
    }}


    const postUsuario= async(data) =>{
        try {
            loading.value =true
            const r = await axios.get("api/usuarios/escribir", data,{
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

    const putUsuarios= async(id, data) =>{
        try {
            loading.value =true
            const r = await axios.get(`api/usuarios/modificar/${id}`, data,{
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

    const putActivarUsuario= async(id) =>{
        try {
            loading.value =true
            const r = await axios.get(`api/usuarios/activar/activos/${id}`, {},{
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

    const putDesactivarUsuario= async(id) =>{
        try {
            loading.value =true
            const r = await axios.get(`api/usuarios/desactivar/desactivados/${id}`, {},{
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

    let login = async(data) =>{
        try {
            const r = await axios.get("api/usuarios/login", data)
            console.log(token.value);
            return r
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    
    
    return{ listarUsuarios, postUsuario, putUsuarios, putActivarUsuario, putDesactivarUsuario, login, token, loading, usuarios, user}

},

{persist: true}

)

