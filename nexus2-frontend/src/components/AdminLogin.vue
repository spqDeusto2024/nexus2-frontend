<template>
  <div class="login-container">
    <!-- Logo en la esquina superior izquierda que redirige al home al hacer clic -->
    <img
      src="@/assets/logo.png"
      alt="Logo Nexus2"
      class="logo"
      @click="goToHome"
    />

    <div class="login-card">
      <h1 class="login-title">Acceso Administrador</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correo Electrónico:</label>
          <input
            v-model="email"
            id="email"
            type="email"
            class="form-input"
            placeholder="Ingresa tu correo electrónico"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input
            v-model="password"
            id="password"
            type="password"
            class="form-input"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>
        <button type="submit" class="btn-submit">Entrar</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import apiClient from "../axiosConfig";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    // Función para redirigir al inicio (home) al hacer clic en el logo
    goToHome() {
      console.log("Redirigiendo al home...");  // Verifica si esta línea se ejecuta
      this.$router.push('/');  // Redirige a la página de inicio (home)
    },

    async handleLogin() {
      try {
        // Realiza la solicitud de login del administrador
        const response = await apiClient.get(`/loginAdmin`, {
          params: {
            email: this.email,
            password: this.password,
          },
        });
        console.log("Login exitoso:", response.data);
        // Redirige al dashboard si el login es exitoso
        this.$router.push("/dashboardAdmin");
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.detail;
        } else {
          this.errorMessage = "Error al iniciar sesión.";
        }
      }
    },
  },
};
</script>

<style>
/* Estilos generales para el tema underground */
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #121212;
  font-family: 'Arial', sans-serif;
  margin: 0;
  color: #e0e0e0;
}

/* Logo en la esquina superior izquierda */
.logo {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 200px;
  height: auto;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.1);
}

/* Tarjeta del formulario */
.login-card {
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 30px;
  width: 350px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.6);
}

/* Título */
.login-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #ffcc00;
}

/* Estilos del formulario */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Grupo de inputs */
.form-group {
  text-align: left;
}

label {
  display: block;
  font-size: 14px;
  color: #bbb;
  margin-bottom: 5px;
}

.form-input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #555;
  border-radius: 5px;
  background-color: #2a2a2a;
  color: #fff;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #ffcc00;
  box-shadow: 0 0 5px #ffcc00;
}

/* Botón de enviar */
.btn-submit {
  background-color: #ffcc00;
  color: #121212;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s;
}

.btn-submit:hover {
  background-color: #e0b800;
  transform: scale(1.05);
}

/* Mensaje de error */
.error-message {
  color: #ff6b6b;
  margin-top: 15px;
  font-size: 14px;
}
</style>
