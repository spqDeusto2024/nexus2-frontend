<template>
  <div class="create-resident-container">
    <!-- Logo en la esquina superior izquierda -->
    <img
      src="@/assets/logo.png"
      alt="Logo Nexus2"
      class="logo"
      @click="$router.push('/dashboardAdmin')" 
    />

    <div class="create-resident-card">
      <h1 class="create-resident-title">Crear Residente</h1>
      <form @submit.prevent="handleCreateResident" class="create-resident-form">
        <div class="form-group">
          <label for="name">Nombre:</label>
          <input
            v-model="name"
            id="name"
            type="text"
            class="form-input"
            placeholder="Ingresa el nombre"
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
            placeholder="Ingresa el apellido"
            required
          />
        </div>
        <div class="form-group">
          <label for="birthDate">Fecha de Nacimiento:</label>
          <input
            v-model="birthDate"
            id="birthDate"
            type="date"
            class="form-input"
            required
          />
        </div>
        <div class="form-group">
          <label for="gender">Género:</label>
          <select v-model="gender" id="gender" class="form-input" required>
            <option value="" disabled selected>Selecciona el género</option>
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div class="form-group">
            <label for="idFamily">ID de Familia:</label>
            <input
                v-model="idFamily"
                id="idFamily"
                type="text"
                class="form-input"
                placeholder="Ingresa el ID de la familia"
                required
            />
        </div>
        <div class="form-group">
            <label for="idRoom">ID de Habitación (Opcional):</label>
            <input
                v-model="idRoom"
                id="idRoom"
                type="text"
                class="form-input"
                placeholder="Ingresa el ID de la habitación (opcional)"
            />
        </div>
        <button type="submit" class="btn-submit">Crear Residente</button>
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
      surname: "",
      birthDate: "",
      gender: "",
      idFamily: "",
      idRoom: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async handleCreateResident() {
      // Obtener el ID del administrador desde el localStorage
      const createdBy = localStorage.getItem("userId");
      console.log("Admin ID:", createdBy);

      if (!createdBy) {
        this.errorMessage = "No se ha encontrado un administrador logueado.";
        return;
      }

      // Crear la fecha actual para 'createDate'
      const currentDate = new Date().toISOString().split('T')[0]; // Formato yyyy-mm-dd

      // Asegúrate de que birthDate esté en el formato adecuado
      const birthDateFormatted = this.birthDate ? this.birthDate.split('T')[0] : null;

      // Construir el objeto con los datos del residente
      const residentData = {
        name: this.name,
        surname: this.surname,
        birthDate: birthDateFormatted,  // Fecha de nacimiento en formato yyyy-mm-dd
        gender: this.gender,
        createdBy: createdBy,
        createDate: currentDate,  // Fecha actual en formato yyyy-mm-dd
        update: null,             // 'update' es opcional, lo dejamos como null
        idFamily: this.idFamily,  // ID de Familia
        idResident: null,         // Si no lo tienes, ponlo como 'null'
        idRoom: this.idRoom || null, // ID de Habitación, opcional
      };

      try {
        // Realizar la solicitud POST al endpoint correcto
        const response = await axios.post("http://localhost:8000/resident/create", residentData);

        // Verificar la respuesta del servidor
        if (response.data.status === "ok") {
          this.successMessage = "Residente creado exitosamente.";
          this.errorMessage = "";
          this.resetForm();  // Restablecer el formulario
          // Redirigir al dashboard de administrador
          this.$router.push('/dashboardAdmin');
        } else {
          this.errorMessage = response.data.message;
          this.successMessage = "";
        }
      } catch (error) {
        this.errorMessage = "Ocurrió un error al crear el residente.";
        this.successMessage = "";
        console.error(error);
      }
    },

    // Método para resetear el formulario
    resetForm() {
      this.name = "";
      this.surname = "";
      this.birthDate = "";
      this.gender = "";
      this.idFamily = "";
      this.idRoom = "";
    },
  },
};
</script>

<style scoped>
/* Estilos generales */
.create-resident-container {
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
.create-resident-card {
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 30px;
  width: 350px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.6);
}

/* Título */
.create-resident-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #ffcc00;
}

/* Estilos del formulario */
.create-resident-form {
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
