import { defineStore } from "pinia";
import axios from "axios";
// import { ref } from "vue";

export const useStorePlanes = defineStore("Planes", () => {

    const getPlan= async() =>{
        try {
            const r = await axios.get("http://localhost:3000/api/planes/listar")
            console.log(r);
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }

    return{
        getPlan
    }

})