import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";
import { Notify } from "quasar";
export const useStoreVentas = defineStore("Ventas", () => {

    let loading = ref(false)
    let ventas =ref([])
    const useUsuario=useStoreUsuarios()
    
    
        const listarVenta= async() =>{
            try {
                loading.value  = true;
                console.log(`este es el usuariotoken ${useUsuario.token}`);
                console.log(` este es el local ${localStorage.getItem('x-token')}`);
                const response = await axios.get("api/ventas/listar",{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
            });
            //    ventas.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de ventas",error);
                console.log(`${useUsuario.token} es el token`);

                throw error;
            }
            finally {
                loading.value=false
        }}
    
    
        const postVenta= async(data) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));
                const r = await axios.post("api/ventas/escribir", data,{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
                })

                Notify.create({
                  message: 'venta registrado correctamente',
                  color: "positive",
                  position: "top",
                })

                console.log(r);
                return r
            } catch (error) {
              Notify.create({
                type: 'negative',
                message: error.response.data.errors[0].msg
              })

                loading.value =true
                console.log(error);
                return error;
            }finally{
                loading.value = false
            }
        }
    
        const putVenta = async (id, data) => {
  try {
    loading.value = true;
    console.log(localStorage.getItem('x-token'));
    if (!id) {
      throw new Error("ID no definido");
    }
    const r = await axios.put(`api/ventas/modificar/${id}`, data, {
      headers: {
                "x-token": localStorage.getItem('x-token'),

              }
            })

            Notify.create({
              message: 'Venta registrado correctamente',
              color: "positive",
              position: "top",
            });
        
            console.log(r);
            return r;
          } catch (error) {
            // Manejo  del error
            let errorMessage = 'Error al actualizar';
            if (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0] && error.response.data.errors[0].msg) {
              errorMessage = error.response.data.errors[0].msg;
            } else if (error.response && error.response.data && error.response.data.error) {
              errorMessage = error.response.data.error;
            }
        
            Notify.create({
              type: 'negative',
              message: errorMessage,
            });
    loading.value = false;
    console.log(error);
    return error;
  } finally {
    loading.value = false;
  }
}

    
        return{ listarVenta, postVenta, putVenta, loading, ventas, useUsuario}
    
    },
    
    {persist: true}
    
    )