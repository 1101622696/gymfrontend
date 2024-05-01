import { defineStore } from "pinia";
import axios from "axios";
// import { ref } from "vue";

export const useStoreClientes = defineStore("Cliente", () => {

    const getUsers= async() =>{
        try {
            const r = await axios.get("http://localhost:3000/api/clientes/listar")
            console.log(r);
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }

    return{
        getUsers
    }

})