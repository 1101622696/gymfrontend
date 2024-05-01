import { defineStore } from "pinia";
import axios from "axios";
// import { ref } from "vue";

export const useStoreIngresos = defineStore("Ingreso", () => {

    const getRevenues= async() =>{
        try {
            const r = await axios.get("http://localhost:3000/api/ingresos/listar")
            console.log(r);
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }

    return{
        getRevenues
    }

})