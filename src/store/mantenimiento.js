import { defineStore } from "pinia";
import axios from "axios";
// import { ref } from "vue";

export const useStoreMantenimiento = defineStore("Mantenimiento", () => {

    const getMaintenance= async() =>{
        try {
            const r = await axios.get("http://localhost:3000/api/mantenimiento/listar")
            console.log(r);
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }

    return{
        getMaintenance
    }

})