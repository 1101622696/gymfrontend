import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useStoreUsuarios = defineStore("Usuarios", () => {
  // const token = ref("");
  const token = ref(localStorage.getItem('x-token') || "");

  const loading = ref(false);
  const usuarios = ref([]);
  const user = ref({});
  const role = ref("");  // Añadir el rol del usuario

  const listarUsuario = async () => {
    try {
      loading.value = true;
      // console.log(`este es el usuariotoken ${useUsuario.token}`);
      console.log(` este es el local ${localStorage.getItem('x-token')}`);
      const response = await axios.get("api/usuarios/listar", {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      });
      return response;
    } catch (error) {
      console.error("No se pudo obtener la lista de usuarios", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const listaractivados = async () => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const response = await axios.get("api/usuarios/listaractivados", {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      });
      return response;
    } catch (error) {
      console.error("No se pudo obtener la lista de activados", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const listardesactivados = async () => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const response = await axios.get("api/usuarios/listardesactivados", {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      });
      return response;
    } catch (error) {
      console.error("No se pudo obtener la lista de desactivados", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const postUsuario = async (data) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const response = await axios.post("api/usuarios/escribir", data, {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      });
      return response;
    } catch (error) {
      console.log("No se pudo crear el usuario", error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const putUsuarios = async (id, data) => {
    try {
      loading.value = true;    
      console.log(localStorage.getItem('x-token'));
      const response = await axios.put(`api/usuarios/modificar/${id}`, data, {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      });
      return response;
    } catch (error) {
      console.log("No se pudo actualizar el usuario", error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const putActivarUsuario = async (id) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));

      const response = await axios.put(`api/usuarios/activar/activos/${id}`, {}, {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      });
      return response;
    } catch (error) {
      console.log("No se pudo activar el usuario", error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const putDesactivarUsuario = async (id) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const response = await axios.put(`api/usuarios/desactivar/desactivados/${id}`, {}, {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      });
      return response;
    } catch (error) {
      console.log("No se pudo desactivar el usuario", error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("api/usuarios/login", { email, password });
      token.value = res.data.token;
      user.value = res.data.usuario;
      role.value = res.data.usuario.rol;
      
      localStorage.setItem('x-token', res.data.token);
      console.log('Token guardado:', res.data.token); // Añade este console.log
      
      return res;
    } catch (error) {
      console.log("Error en el login", error);
      return error;
    }
  };
  const validaremail = async (email) => {
    try {
      const res = await axios.get(`api/usuarios/email?email=${email}`);
      localStorage.setItem('x-token', res.data.token); // Corrección aquí

      return res;
    } catch (error) {
      console.error("No se pudo obtener la informacion requerida", error);
      return error;
    }};

    const putUsuariospassword = async (id, data) => {
      try {
        loading.value = true;
        console.log(localStorage.getItem('x-token'));

        const response = await axios.put(`api/usuarios/password/${id}`, data, {
          headers: {
            "x-token": localStorage.getItem('x-token')
          }
        });
        return response;
      } catch (error) {
        console.log("No se pudo actualizar el usuario", error);
        return error;
      } finally {
        loading.value = false;
      }
    };
    

  return {
    listarUsuario,
    listaractivados,
    listardesactivados,
    postUsuario,
    putUsuarios,
    putActivarUsuario,
    putDesactivarUsuario,
    login,
    validaremail,
    putUsuariospassword,
    token,
    loading,
    usuarios,
    user,
    role  // Añadir el rol del usuario en el return
  };
}, { persist: true });

