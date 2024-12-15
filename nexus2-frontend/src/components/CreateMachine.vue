<template>
  <div class="create-machine-container">
    <!-- Logo en la esquina superior izquierda -->
    <img
      src="@/assets/logo.png"
      alt="Logo Nexus2"
      class="logo"
      @click="$router.push('/dashboardAdmin')" 
    />

    <div class="create-machine-card">
      <h1 class="create-machine-title">Crear Máquina</h1>
      <form @submit.prevent="handleCreateMachine" class="create-machine-form">
        <div class="form-group">
          <label for="machineName">Nombre de la Máquina:</label>
          <input
            v-model="machineName"
            id="machineName"
            type="text"
            class="form-input"
            placeholder="Ingresa el nombre de la máquina"
            required
          />
        </div>
        <div class="form-group">
          <label for="idRoom">ID de la Sala:</label>
          <input
            v-model="idRoom"
            id="idRoom"
            type="text"
            class="form-input"
            placeholder="Ingresa el ID de la sala"
            required
          />
        </div>
        <button type="submit" class="btn-submit">Crear Máquina</button>
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
      machineName: "",
      idRoom: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async handleCreateMachine() {
      const createdBy = localStorage.getItem("userId");

      if (!createdBy) {
        this.errorMessage = "No se ha encontrado un administrador logueado.";
        return;
      }

      // Crear la fecha actual en formato "YYYY-MM-DD" (solo fecha sin hora)
      const currentDate = new Date().toISOString().split('T')[0];

      // Construir el objeto de datos con los tipos correctos
      const machineData = {
        idMachine: 0, // Envía un número entero, 0 como placeholder
        machineName: this.machineName, // Mantiene como string
        idRoom: parseInt(this.idRoom), // Convierte a entero
        createdBy: parseInt(createdBy), // Convierte a entero
        createDate: currentDate, // Solo la fecha (formato YYYY-MM-DD)
        update: null, // Valor null explícito
        on: true, // Valor booleano
      };

      try {
        // Realiza la solicitud POST
        const response = await axios.post("http://localhost:8000/machine/create", machineData);

        // Verifica si el servidor respondió correctamente
        if (response.status === 200 || response.data.status === "ok") {
          this.successMessage = "Máquina creada exitosamente.";
          this.errorMessage = "";
          this.resetForm(); // Limpiar formulario
          this.$router.push('/dashboardAdmin'); // Redirección
        } else {
          this.errorMessage = response.data.message || "Error inesperado.";
          this.successMessage = "";
        }
      } catch (error) {
        this.errorMessage = "Ocurrió un error al crear la máquina.";
        this.successMessage = "";
        console.error("Error al enviar solicitud:", error.response?.data || error.message);
      }
    },

    resetForm() {
      this.machineName = "";
      this.idRoom = "";
    },
  },
};
</script>


<style scoped>
/* Estilos generales */
.create-machine-container {
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
.create-machine-card {
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 30px;
  width: 350px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.6);
}

/* Título */
.create-machine-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #ffcc00;
}

/* Estilos del formulario */
.create-machine-form {
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
