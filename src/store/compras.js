import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";
import { Notify } from "quasar";
export const useStoreCompras = defineStore("Compras", () => {

    let loading = ref(false)
    let compras =ref([])
    const useUsuario=useStoreUsuarios()


        const listarCompra= async(payload) =>{
            try {
                loading.value  = true;
                console.log(`este es el usuariotoken ${useUsuario.token}`);
                console.log(` este es el local ${localStorage.getItem('x-token')}`);
                let ruta;
                if (payload == null) ruta = "api/compras/listar";
                else ruta=`api/compras/listar?busqueda=${payload}`;
                const response = await axios.get(ruta,{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
            });
            //    compras.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de compras",error);
                console.log(`${useUsuario.token} es el token`);

                throw error;
            }
            finally {
                loading.value=false
        }}

        const listarporproducto= async(id) =>{
          try {
              loading.value  = true;
              console.log(`este es el usuariotoken ${useUsuario.token}`);
              console.log(` este es el local ${localStorage.getItem('x-token')}`);
              const response = await axios.get(`api/compras/listarporproducto/${id}`,{
                  headers:{
                              "x-token": localStorage.getItem('x-token'),

                  }
          });
             return response;
          } catch (error) {
              console.error("NO se pudo obtener la lista de compras",error);
              console.log(`${useUsuario.token} es el token`);

              throw error;
          }
          finally {
              loading.value=false
      }}
      const listarporfecha = async (fecha) => {
        try {
          const fechaLocal = new Date(fecha + 'T00:00:00');
      
          const fechaInicioUTC = new Date(Date.UTC(
            fechaLocal.getFullYear(),
            fechaLocal.getMonth(),
            fechaLocal.getDate()
          ));
          const fechaFinUTC = new Date(Date.UTC(
            fechaLocal.getFullYear(),
            fechaLocal.getMonth(),
            fechaLocal.getDate(),
            23, 59, 59, 999
          ));
      
          console.log('Fecha inicio (UTC):', fechaInicioUTC.toISOString());
          console.log('Fecha fin (UTC):', fechaFinUTC.toISOString());
      
          const response = await axios.get('api/compras/listarporfecha', {
            params: { 
              fechaInicio: fechaInicioUTC.toISOString(),
              fechaFin: fechaFinUTC.toISOString()
            },
            headers: {
              "x-token": localStorage.getItem('x-token'),
            },
          });
      
          console.log('Respuesta del servidor:', response.data);
          return response.data.compras;
        } catch (error) {
          console.error("No se pudo obtener la lista de compras", error);
          throw error;
        }
      };

        const postCompra= async(data) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));
                const r = await axios.post("api/compras/escribir", data,{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
                })

                Notify.create({
                  message: 'compra registrado correctamente',
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

        const putCompra = async (id, data) => {
  try {
    loading.value = true;
    console.log(localStorage.getItem('x-token'));
    if (!id) {
      throw new Error("ID no definido");
    }
    const r = await axios.put(`api/compras/modificar/${id}`, data, {
      headers: {
                "x-token": localStorage.getItem('x-token'),

              }
            })

            Notify.create({
              message: 'Compra registrado correctamente',
              color: "positive",
              position: "top",
            });

            console.log(r);
            return r;
          } catch (error) {
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


        return{ listarCompra,listarporproducto,listarporfecha,postCompra, putCompra, loading, compras, useUsuario}

    },

    {persist: true}

    )