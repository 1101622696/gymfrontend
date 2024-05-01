import { defineStore } from "pinia";
import axios from "axios";
// import { ref } from "vue";

export const useStoreUsuarios = defineStore("Usuarios", () => {

    const getUser= async() =>{
        try {
            const r = await axios.get("http://localhost:3000/api/usuarios/listar")
            console.log(r);
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }

    return{
        getUser
    }

})