import { defineStore } from "pinia";
import axios from "axios";
// import { ref } from "vue";

export const useStoreInventario = defineStore("Inventario", () => {

    const getInventory= async() =>{
        try {
            const r = await axios.get("http://localhost:3000/api/inventario/listar")
            console.log(r);
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }

    return{
        getInventory
    }

})