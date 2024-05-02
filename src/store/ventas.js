import { defineStore } from "pinia";
import axios from "axios";
// import { ref } from "vue";

export const useStoreVentas = defineStore("Ventas", () => {

    const getSales= async() =>{
        try {
            const r = await axios.get("http://localhost:3000/api/ventas/listar")
            console.log(r);
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }

    return{
        getSales
    }

})