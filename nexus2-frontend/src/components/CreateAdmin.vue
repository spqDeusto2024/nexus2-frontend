<template>
  <div class="create-admin-container">
    <!-- Logo en la esquina superior izquierda -->
    <img
      src="@/assets/logo.png"
      alt="Logo Nexus2"
      class="logo"
      @click="$router.push('/')" 
    />
    <!-- El comentario ahora está fuera del atributo -->

    <div class="create-admin-card">
      <h1 class="create-admin-title">Crear Administrador</h1>
      <form @submit.prevent="handleCreateAdmin" class="create-admin-form">
        <div class="form-group">
          <label for="name">Nombre Completo:</label>
          <input
            v-model="name"
            id="name"
            type="text"
            class="form-input"
            placeholder="Ingresa el nombre completo"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">Correo Electrónico:</label>
          <input
            v-model="email"
            id="email"
            type="email"
            class="form-input"
            placeholder="Ingresa el correo electrónico"
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
            placeholder="Ingresa la contraseña"
            required
          />
        </div>
        <button type="submit" class="btn-submit">Crear Administrador</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    // Método que redirige al home (página principal)
    goToHome() {
      this.$router.push('/');  // Redirige a la página de inicio (home)
    },

    // Método para manejar la creación de administrador
    async handleCreateAdmin() {
      const adminData = {
        email: this.email,
        name: this.name,
        password: this.password,
      };

      console.log("Datos a enviar:", adminData);

      try {
        const response = await axios.post("http://localhost:8000/admin/create", adminData);
        if (response.data.status === "ok") {
          this.successMessage = "Administrador creado exitosamente.";
          this.errorMessage = "";
          this.resetForm();  // Limpiar formulario

          // Redirigir a la página de inicio después de la creación exitosa
          this.$router.push('/');  // Redirige a la página de inicio (home)
        } else {
          this.errorMessage = response.data.message;
          this.successMessage = "";
        }
      } catch (error) {
        this.errorMessage = "Ocurrió un error al crear el administrador.";
        this.successMessage = "";
      }
    },

    // Método para resetear el formulario
    resetForm() {
      this.name = "";
      this.email = "";
      this.password = "";
    },
  },
};
</script>

<style scoped>
/* Estilos generales para el tema underground */
.create-admin-container {
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
.create-admin-card {
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 30px;
  width: 350px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.6);
}

/* Título */
.create-admin-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #ffcc00;
}

/* Estilos del formulario */
.create-admin-form {
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

/* Mensajes de error y éxito */
.error-message {
  color: #ff6b6b;
  margin-top: 15px;
  font-size: 14px;
}

.success-message {
  color: #4caf50;
  margin-top: 15px;
  font-size: 14px;
}
</style>
