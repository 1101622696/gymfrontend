import { defineStore } from "pinia";
import axios from "axios";
// import { ref } from "vue";

export const useStorePagos = defineStore("Pagos", () => {

    const getPayment= async() =>{
        try {
            const r = await axios.get("http://localhost:3000/api/pagos/listar")
            console.log(r);
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }

    return{
        getPayment
    }

})