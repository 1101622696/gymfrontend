import { defineStore } from "pinia";
import axios from "axios";
// import { ref } from "vue";

export const useStoreMaquina = defineStore("Maquina", () => {

    const getMachine= async() =>{
        try {
            const r = await axios.get("http://localhost:3000/api/maquinas/listar")
            console.log(r);
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }

    return{
        getMachine
    }

})