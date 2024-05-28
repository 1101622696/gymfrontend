import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import {Notify} from "quasar"


export const useStoreUsuarios = defineStore("Usuarios", () => {

    let token = ref("")
let loading = ref(false)
    let usuarios =ref([])
    let user = ref({})



    const listarUsuario= async() =>{
        try {
            loading.value  = true;
            console.log(token.value);
            const response = await axios.get("api/usuarios/listar",{
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

    // let login = async(data) =>{
    //     try {
    //         const r = await axios.get("api/usuarios/login", data)
    //         token.value = r.data.token
    //         user.value = r.data.usuario
    //         console.log(r.data);
    //         return r
    //     } catch (error) {
    //         console.log(error, data);
    //         return error;
    //     }
    // }

    let login = async (email, password) => {
        try {
            const res = await axios.post("api/usuarios/login", {email, password});
            console.log(res);
            token.value = res.data.token
            user.value = res.data.usuario
            console.log(token.value);
            return res;
        } catch (error) {
            console.log(error);
            console.log(email, "hola");
            return error;
        }
    };

    
    
    return{ listarUsuario, postUsuario, putUsuarios, putActivarUsuario, putDesactivarUsuario, login, token, loading, usuarios, user}

},

{persist: true}

)

