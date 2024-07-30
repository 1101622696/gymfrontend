import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useStoreUsuarios } from "./usuarios";

export const useStorePagos = defineStore("Pagos", () => {

    let loading = ref(false)
    let pagos =([])
    const useUsuario=useStoreUsuarios()


        const listarPago= async() =>{
            try {
                loading.value  = true;
                console.log(`este es el usuariotoken ${useUsuario.token}`);
                console.log(` este es el local ${localStorage.getItem('x-token')}`);
                const response = await axios.get("api/pagos/listar",{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
            });
            //    pagos.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de pagos",error);
                console.log(`${useUsuario.token} es el token`);

                throw error;
            }
            finally {
                loading.value=false
        }}

        const listarPagoNombre= async(busqueda) =>{
            try {
                loading.value  = true;
                console.log(`este es el usuariotoken ${useUsuario.token}`);
                console.log(` este es el local ${localStorage.getItem('x-token')}`);
                const response = await axios.get(`api/pagos/listarnombre?busqueda=${busqueda}`,{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
            });
            //    pagos.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de pagos",error);
                console.log(`${useUsuario.token} es el token`);

                throw error;
            }
            finally {
                loading.value=false
        }}


        const listarPagosFecha= async(fecha) =>{
            try {
                loading.value  = true;
                console.log(`este es el usuariotoken ${useUsuario.token}`);
                console.log(` este es el local ${localStorage.getItem('x-token')}`);
                const response = await axios.get(`api/pagos/listarfecha`,{
                    params: { fecha },
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
            });
            //    pagos.value = response.data;
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de pagos",error);
                console.log(`${useUsuario.token} es el token`);

                throw error;
            }
            finally {
                loading.value=false
        }}


        const listaractivados = async () => {
            try {
              loading.value = true;
              // console.log(useUsuario.token);
              console.log(localStorage.getItem('x-token'));

              const response = await axios.get("api/pagos/listaractivados", {
                headers: {
                         "x-token": localStorage.getItem('x-token'),
                },
              });
              //    clientes.value = response.data;
              return response;
            } catch (error) {
              console.error("NO se pudo obtener la lista de planes", error);
              throw error;
            } finally {
              loading.value = false;
            }
          };

          const listardesactivados = async () => {
            try {
              loading.value = true;
              // console.log(useUsuario.token);
              console.log(localStorage.getItem('x-token'));

              const response = await axios.get("api/pagos/listardesactivados", {
                headers: {
                         "x-token": localStorage.getItem('x-token'),
                },
              });
              //    clientes.value = response.data;
              return response;
            } catch (error) {
              console.error("NO se pudo obtener la lista de planes", error);
              throw error;
            } finally {
              loading.value = false;
            }
          };



        const postPago= async(data) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));

                const r = await axios.post("api/pagos/escribir", data,{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
                })
                console.log(r);
                return r
            } catch (error) {
                loading.value =true
                console.log(error);
                return error;
            }finally{
                loading.value = false
            }
        }

        const putPago = async (id, data) => {
            try {
              loading.value = true;
              console.log(localStorage.getItem('x-token'));
              const r = await axios.put(`api/pagos/modificar/${id}`, data, {
                headers: {
                          "x-token": localStorage.getItem('x-token'),

                }
              });
              console.log(r);
              return r;
            } catch (error) {
              loading.value = false;
              console.log(error);
              return error;
            } finally {
              loading.value = false;
            }
          };


        const putPagosActivar= async(id) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));
                const r = await axios.put(`api/pagos/activar/activos/${id}`, {},{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
                })
                console.log(r);
                return r
            } catch (error) {
                loading.value =true
                console.log(error);
                return error;
            }finally{
                loading.value = false
            }
        }

        const putPagosDesactivar= async(id) =>{
            try {
                loading.value =true
                console.log(localStorage.getItem('x-token'));
                const r = await axios.put(`api/pagos/desactivar/desactivados/${id}`, {},{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
                })
                console.log(r);
                return r
            } catch (error) {
                loading.value =true
                console.log(error);
                return error;
            }finally{
                loading.value = false
            }
        }


        return{ listarPago,listarPagosFecha,listardesactivados,listaractivados,listarPagoNombre, postPago, putPago, putPagosActivar, putPagosDesactivar, loading, pagos, useUsuario}

    },

    {persist: true}

    )