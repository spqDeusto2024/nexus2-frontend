<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="name">Name:</label>
        <input v-model="name" id="name" type="text" required />
      </div>
      <div>
        <label for="surname">Surname:</label>
        <input v-model="surname" id="surname" type="text" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import apiClient from "../axiosConfig"; // Asegúrate de que la configuración de Axios esté bien

export default {
  data() {
    return {
      name: "",
      surname: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        // Solicitar al backend el login con los datos en la URL como parámetros de consulta
        const response = await apiClient.get(`/login`, {
          params: {
            name: this.name,
            surname: this.surname,
          },
        });

        // Si el login es exitoso, redirige al dashboard
        console.log("Login successful:", response.data);
        this.$router.push("/dashboard"); // Redirige al dashboard
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.detail; // Mostrar mensaje de error
        } else {
          this.errorMessage = "An error occurred during login."; // Error genérico
        }
      }
    },
  },
};
</script>

<style>
/* Estilos opcionales */
.login-container {
  width: 300px;
  margin: 0 auto;
  text-align: center;
}

button {
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>