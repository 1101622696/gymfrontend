import { defineStore } from "pinia";
import axios from "axios";
// import { ref } from "vue";

export const useStoreSedes = defineStore("Sedes", () => {

    const getOffice= async() =>{
        try {
            const r = await axios.get("http://localhost:3000/api/sedes/listar")
            console.log(r);
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }

    return{
        getOffice
    }

})