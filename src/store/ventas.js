import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";
import { Notify } from "quasar";
export const useStoreVentas = defineStore("Ventas", () => {

    let loading = ref(false)
    let ventas =ref([])
    const useUsuario=useStoreUsuarios()


        const listarVenta= async(payload) =>{
            try {
                loading.value  = true;
                console.log(`este es el usuariotoken ${useUsuario.token}`);
                console.log(` este es el local ${localStorage.getItem('x-token')}`);
                let ruta;
                if (payload == null) ruta = "api/ventas/listar";
                else ruta=`api/ventas/listar?busqueda=${payload}`;
                const response = await axios.get(ruta,{
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

        const listarporproducto= async(id) =>{
          try {
              loading.value  = true;
              console.log(`este es el usuariotoken ${useUsuario.token}`);
              console.log(` este es el local ${localStorage.getItem('x-token')}`);
              const response = await axios.get(`api/ventas/listarporproducto/${id}`,{
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
      const listarporfecha = async (fecha) => {
        try {
          // Obtener la fecha local ingresada
          const fechaLocal = new Date(fecha + 'T00:00:00');
      
          // Ajustar las fechas de inicio y fin en UTC
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
      
          const response = await axios.get('api/ventas/listarporfecha', {
            params: { 
              fechaInicio: fechaInicioUTC.toISOString(),
              fechaFin: fechaFinUTC.toISOString()
            },
            headers: {
              "x-token": localStorage.getItem('x-token'),
            },
          });
      
          console.log('Respuesta del servidor:', response.data);
          return response.data.ventas;
        } catch (error) {
          console.error("No se pudo obtener la lista de ventas", error);
          throw error;
        }
      };

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


        return{ listarVenta,listarporproducto,listarporfecha,postVenta, putVenta, loading, ventas, useUsuario}

    },

    {persist: true}

    )