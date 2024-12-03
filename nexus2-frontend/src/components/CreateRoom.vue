<template>
  <div class="create-room-container">
    <!-- Logo en la esquina superior izquierda -->
    <img
      src="@/assets/logo.png"
      alt="Logo Nexus2"
      class="logo"
      @click="$router.push('/dashboardAdmin')" 
    />

    <div class="create-room-card">
      <h1 class="create-room-title">Crear Habitación</h1>
      <form @submit.prevent="handleCreateRoom" class="create-room-form">
        <div class="form-group">
          <label for="roomName">Nombre de la Habitación:</label>
          <input
            v-model="roomName"
            id="roomName"
            type="text"
            class="form-input"
            placeholder="Ingresa el nombre de la habitación"
            required
          />
        </div>
        <div class="form-group">
          <label for="maxPeople">Número Máximo de Personas:</label>
          <input
            v-model="maxPeople"
            id="maxPeople"
            type="number"
            class="form-input"
            placeholder="Número máximo de personas"
            required
            min="1"
          />
        </div>
        <button type="submit" class="btn-submit">Crear Habitación</button>
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
      roomName: "",
      maxPeople: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async handleCreateRoom() {
      // Obtener el ID del administrador desde el localStorage
      const createdBy = localStorage.getItem("userId");
      console.log("Admin ID:", createdBy);

      if (!createdBy) {
        this.errorMessage = "No se ha encontrado un administrador logueado.";
        return;
      }

      // Crear la fecha actual para 'createDate'
      const currentDate = new Date().toISOString().split('T')[0]; // Formato yyyy-mm-dd

      // Construir el objeto con los datos de la habitación
      const roomData = {
        idRoom: 0,             // ID de la habitación es 0 al momento de crear
        roomName: this.roomName,  // Nombre de la habitación
        createdBy: parseInt(createdBy),  // ID del administrador (usuario logueado)
        createDate: currentDate,      // Fecha actual en formato yyyy-mm-dd
        idShelter: 1,         // ID de refugio siempre es 1
        maxPeople: parseInt(this.maxPeople), // Número máximo de personas
      };

      try {
        // Realizar la solicitud POST al endpoint para crear la habitación
        const response = await axios.post("http://localhost:8000/room/create", roomData);

        // Verificar la respuesta del servidor
        if (response.data.status === "ok") {
          this.successMessage = "Habitación creada exitosamente.";
          this.errorMessage = "";
          this.resetForm();  // Restablecer el formulario
          // Redirigir al dashboard de administrador
          this.$router.push('/dashboardAdmin');
        } else {
          this.errorMessage = response.data.message;
          this.successMessage = "";
        }
      } catch (error) {
        this.errorMessage = "Ocurrió un error al crear la habitación.";
        this.successMessage = "";
        console.error(error);
      }
    },

    // Método para resetear el formulario
    resetForm() {
      this.roomName = "";
      this.maxPeople = "";
    },
  },
};
</script>

<style scoped>
/* Estilos generales */
.create-room-container {
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
.create-room-card {
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 30px;
  width: 350px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.6);
}

/* Título */
.create-room-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #ffcc00;
}

/* Estilos del formulario */
.create-room-form {
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
