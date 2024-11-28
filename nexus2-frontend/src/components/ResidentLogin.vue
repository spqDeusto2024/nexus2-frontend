<template>
  <div class="login-container">
    <!-- Logo en la esquina superior izquierda -->
    <img src="@/assets/logo.png" alt="Logo Nexus2" class="logo" />

    <div class="login-card">
      <h1 class="login-title">Acceso al Refugio</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="name">Nombre:</label>
          <input
            v-model="name"
            id="name"
            type="text"
            class="form-input"
            placeholder="Ingresa tu nombre"
            required
          />
        </div>
        <div class="form-group">
          <label for="surname">Apellido:</label>
          <input
            v-model="surname"
            id="surname"
            type="text"
            class="form-input"
            placeholder="Ingresa tu apellido"
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
      name: "",
      surname: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await apiClient.get(`/login`, {
          params: {
            name: this.name,
            surname: this.surname,
          },
        });
        console.log("Login exitoso:", response.data);
        this.$router.push("/dashboard");
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
  position: relative; /* Para posicionar el logo */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #121212; /* Fondo oscuro para simular un ambiente subterráneo */
  font-family: 'Arial', sans-serif;
  margin: 0;
  color: #e0e0e0; /* Texto claro para contraste */
}

/* Logo en la esquina superior izquierda */
.logo {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 200px; /* Tamaño más grande del logo */
  height: auto; /* Asegura que mantenga las proporciones */
  cursor: pointer; /* Cambiar cursor al pasar sobre el logo */
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.1); /* Efecto de agrandamiento al pasar el ratón */
}

/* Tarjeta del formulario */
.login-card {
  background: #1e1e1e; /* Fondo de la tarjeta con un tono gris oscuro */
  border: 1px solid #444; /* Bordes simulando metal o refuerzo */
  border-radius: 10px;
  padding: 30px;
  width: 350px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.6); /* Sombra para profundidad */
}

/* Título */
.login-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #ffcc00; /* Color cálido para resaltar, como luz de advertencia */
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
  border: 1px solid #555; /* Borde tenue para inputs */
  border-radius: 5px;
  background-color: #2a2a2a; /* Fondo oscuro para inputs */
  color: #fff;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #ffcc00; /* Resalta al enfocar */
  box-shadow: 0 0 5px #ffcc00;
}

/* Botón de enviar */
.btn-submit {
  background-color: #ffcc00; /* Botón principal con color cálido */
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
  background-color: #e0b800; /* Un tono más oscuro al pasar el cursor */
  transform: scale(1.05);
}

/* Mensaje de error */
.error-message {
  color: #ff6b6b; /* Rojo brillante para errores */
  margin-top: 15px;
  font-size: 14px;
}
</style>
