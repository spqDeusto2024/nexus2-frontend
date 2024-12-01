<template>
  <div class="profile-container">
    <!-- Logo -->
    <img 
      src="@/assets/logo.png" 
      alt="Logo Nexus2" 
      class="logo" 
      @click="redirectToHome" 
    />

    <!-- Cabecera -->
    <div class="profile-header">
      <h1 class="profile-title">Perfil del Residente</h1>
      <p class="profile-subtitle">Visualiza y edita los datos del residente.</p>
    </div>

    <!-- Datos del Residente -->
    <div class="resident-info">
      <div class="info-field">
        <label>Nombre:</label>
        <span>{{ resident.name }}</span>
        <button @click="editName">Editar</button>
      </div>
      <div class="info-field">
        <label>Apellido:</label>
        <span>{{ resident.surname }}</span>
        <button @click="editSurname">Editar</button>
      </div>
      <div class="info-field">
        <label>Fecha de Nacimiento:</label>
        <span>{{ resident.birthDate }}</span>
        <button @click="editBirthDate">Editar</button>
      </div>
      <div class="info-field">
        <label>Género:</label>
        <span>{{ resident.gender }}</span>
        <button @click="editGender">Editar</button>
      </div>
      <div class="info-field">
        <label>ID de Familia:</label>
        <span>{{ resident.idFamily }}</span>
      </div>
    </div>

    <!-- Formulario para editar el nombre -->
    <div v-if="editingName" class="edit-name-form">
      <label for="new-name">Nuevo nombre:</label>
      <input type="text" v-model="newName" id="new-name" placeholder="Nuevo nombre" />
      <button @click="submitNewName">Actualizar nombre</button>
      <button @click="cancelEditName">Cancelar</button>
    </div>

    <!-- Formulario para editar el apellido -->
    <div v-if="editingSurname" class="edit-surname-form">
      <label for="new-surname">Nuevo apellido:</label>
      <input type="text" v-model="newSurname" id="new-surname" placeholder="Nuevo apellido" />
      <button @click="submitNewSurname">Actualizar apellido</button>
      <button @click="cancelEditSurname">Cancelar</button>
    </div>

    <!-- Formulario para editar la fecha de nacimiento -->
    <div v-if="editingBirthDate" class="edit-birthdate-form">
      <label for="new-birthdate">Nueva fecha de nacimiento:</label>
      <input type="date" v-model="newBirthDate" id="new-birthdate" />
      <button @click="submitNewBirthDate">Actualizar fecha de nacimiento</button>
      <button @click="cancelEditBirthDate">Cancelar</button>
    </div>

    <!-- Formulario para editar el género -->
    <div v-if="editingGender" class="edit-gender-form">
      <label for="new-gender">Nuevo género:</label>
      <select v-model="newGender" id="new-gender">
        <option value="M">M</option>
        <option value="F">F</option>
        <option value="Otro">Otro</option>
      </select>
      <button @click="submitNewGender">Actualizar género</button>
      <button @click="cancelEditGender">Cancelar</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ResidentProfile",
  data() {
    return {
      resident: { idResident: "", name: "", surname: "", birthDate: "", gender: "", idFamily: "" },
      userId: localStorage.getItem("userId"),
      editingName: false,
      editingSurname: false,
      editingBirthDate: false,
      editingGender: false,
      newName: "",
      newSurname: "",
      newBirthDate: "",
      newGender: "",
    };
  },
  methods: {
    redirectToHome() {
      this.$router.push("/");
    },
    async fetchResidentData() {
      try {
        if (!this.userId) {
          alert("Debes iniciar sesión para acceder a tu perfil.");
          this.$router.push("/");
          return;
        }
        const response = await axios.get(`http://localhost:8000/resident/get?idResident=${this.userId}`);
        if (response.data.status === "ok") {
          this.resident = response.data.resident;
        } else {
          alert("No se pudo obtener los datos del residente.");
        }
      } catch (error) {
        console.error("Error al obtener los datos del residente:", error);
        alert("Hubo un error al cargar los datos.");
      }
    },
    editName() {
      this.editingName = true;
    },
    async submitNewName() {
      if (!this.newName) {
        alert("Por favor, ingresa un nuevo nombre.");
        return;
      }
      try {
        // Obtenemos el ID del residente desde el localStorage
        const idResident = this.userId;
        
        // Definimos la URL con los parámetros de idResident y new_name
        const url = `http://localhost:8000/name/resident?idResident=${idResident}&new_name=${encodeURIComponent(this.newName)}`;

        // Realizamos la petición PUT para actualizar el nombre
        const response = await axios.put(url);

        // Comprobamos la respuesta de la API
        if (response.data.status === "ok") {
          alert("Nombre actualizado exitosamente.");
          this.editingName = false;  // Cerramos el formulario de edición
          this.newName = "";  // Limpiamos el campo de nombre
          await this.fetchResidentData();  // Recargamos los datos del residente
        } else {
          alert("Error al actualizar el nombre.");
        }
      } catch (error) {
        console.error("Error al actualizar el nombre:", error);
        alert("Hubo un error al intentar actualizar el nombre.");
      }
    },
    cancelEditName() {
      this.editingName = false;
      this.newName = "";
    },
    editSurname() {
      this.editingSurname = true;
    },
    async submitNewSurname() {
      if (!this.newSurname) {
        alert("Por favor, ingresa un nuevo apellido.");
        return;
      }
      try {
        // Obtenemos el ID del residente desde el localStorage
        const idResident = this.userId;

        // Definimos la URL con los parámetros de idResident y new_surname
        const url = `http://localhost:8000/surname/resident?idResident=${idResident}&new_surname=${encodeURIComponent(this.newSurname)}`;

        // Realizamos la petición PUT para actualizar el apellido
        const response = await axios.put(url);

        // Comprobamos la respuesta de la API
        if (response.data.status === "ok") {
          alert("Apellido actualizado exitosamente.");
          this.editingSurname = false;  // Cerramos el formulario de edición
          this.newSurname = "";  // Limpiamos el campo de apellido
          await this.fetchResidentData();  // Recargamos los datos del residente
        } else {
          alert("Error al actualizar el apellido.");
        }
      } catch (error) {
        console.error("Error al actualizar el apellido:", error);
        alert("Hubo un error al intentar actualizar el apellido.");
      }
    },
    cancelEditSurname() {
      this.editingSurname = false;
      this.newSurname = "";
    },
    editBirthDate() {
      this.editingBirthDate = true;
    },
    async submitNewBirthDate() {
      if (!this.newBirthDate) {
        alert("Por favor, ingresa una nueva fecha de nacimiento.");
        return;
      }
      
      try {
        // Validamos que la fecha esté en el formato correcto
        const dateParts = this.newBirthDate.split('-');
        if (dateParts.length !== 3) {
          alert("Formato de fecha incorrecto. Usa el formato yyyy-mm-dd.");
          return;
        }

        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];

        // Validar que la fecha esté dentro de los rangos válidos para año, mes y día
        const date = new Date(this.newBirthDate);
        if (date.getFullYear() !== parseInt(year) || date.getMonth() + 1 !== parseInt(month) || date.getDate() !== parseInt(day)) {
          alert("Fecha inválida. Verifica la fecha de nacimiento.");
          return;
        }

        // Aquí preparamos la URL para enviar al backend
        const url = `http://localhost:8000/birthDate/resident?idResident=${this.userId}&new_birthDate=${encodeURIComponent(this.newBirthDate)}`;
        
        // Realizamos la petición PUT para actualizar la fecha de nacimiento
        const response = await axios.put(url);

        // Comprobamos la respuesta de la API
        if (response.data.status === "ok") {
          alert("Fecha de nacimiento actualizada exitosamente.");
          this.editingBirthDate = false;  // Cerramos el formulario de edición
          this.newBirthDate = "";  // Limpiamos el campo de la fecha
          await this.fetchResidentData();  // Recargamos los datos del residente
        } else {
          alert("Error al actualizar la fecha de nacimiento.");
        }
      } catch (error) {
        console.error("Error al actualizar la fecha de nacimiento:", error);
        alert("Hubo un error al intentar actualizar la fecha de nacimiento.");
      }
    },
    cancelEditBirthDate() {
      this.editingBirthDate = false;
      this.newBirthDate = "";
    },
    editGender() {
      this.editingGender = true;
    },
    async submitNewGender() {
      if (!this.newGender) {
        alert("Por favor, ingresa un nuevo género.");
        return;
      }
      try {
        const url = `http://localhost:8000/resident/gender?idResident=${this.userId}&new_gender=${encodeURIComponent(this.newGender)}`;
        const response = await axios.put(url);
        if (response.data.status === "ok") {
          alert("Género actualizado exitosamente.");
          this.editingGender = false;
          this.newGender = "";
          await this.fetchResidentData();
        } else {
          alert("Error al actualizar el género.");
        }
      } catch (error) {
        console.error("Error al actualizar el género:", error);
        alert("Hubo un error al intentar actualizar el género.");
      }
    },
    cancelEditGender() {
      this.editingGender = false;
      this.newGender = "";
    },
  },
  mounted() {
    this.fetchResidentData();
  }
};
</script>

<style scoped>
.profile-container {
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #121212;
  min-height: 100vh;
  color: #e0e0e0;
}

/* Logo */
.logo {
  width: 120px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.1);
}

/* Cabecera */
.profile-header {
  text-align: center;
  margin-bottom: 20px;
}

.profile-title {
  font-size: 2.2rem;
  color: #ffcc00;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.profile-subtitle {
  font-size: 1.1rem;
  color: #bdbdbd;
}

/* Menú Hamburguesa */
.hamburger-menu {
  position: absolute;
  top: 20px;
  right: 20px;
}

.hamburger-btn {
  background: #ffcc00;
  color: #121212;
  font-size: 24px;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s;
}

.hamburger-btn:hover {
  background: #e0b800;
  transform: scale(1.05);
}

.menu-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  background: #333;
  border-radius: 5px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 9;
}

.menu-dropdown button {
  width: 100%;
  padding: 10px 20px;
  background: #444;
  color: #fff;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  transition: background 0.3s;
}

.menu-dropdown button:hover {
  background: #ffcc00;
  color: #121212;
}

/* Datos del Residente */
.resident-info {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}

.info-field {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.info-field label {
  font-weight: bold;
  color: #fff;
  flex: 1;
}

.info-field span {
  flex: 2;
  color: #e0e0e0;
}

.info-field button {
  background-color: #ffcc00;
  color: #121212;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.info-field button:hover {
  background-color: #e0b800;
}

/* Formularios de edición */
.edit-name-form,
.edit-surname-form,
.edit-birthdate-form,
.edit-gender-form,
.edit-familyid-form {
  margin-top: 20px;
  background-color: #333;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-name-form input,
.edit-surname-form input,
.edit-birthdate-form input,
.edit-gender-form select,
.edit-familyid-form input {
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #222;
  color: #fff;
}

.edit-name-form button,
.edit-surname-form button,
.edit-birthdate-form button,
.edit-gender-form button,
.edit-familyid-form button {
  background-color: #ffcc00;
  color: #121212;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.edit-name-form button:hover,
.edit-surname-form button:hover,
.edit-birthdate-form button:hover,
.edit-gender-form button:hover,
.edit-familyid-form button:hover {
  background-color: #e0b800;
}

.edit-name-form button + button,
.edit-surname-form button + button,
.edit-birthdate-form button + button,
.edit-gender-form button + button,
.edit-familyid-form button + button {
  background-color: #dc3545;
  margin-left: 10px;
}

.edit-name-form button + button:hover,
.edit-surname-form button + button:hover,
.edit-birthdate-form button + button:hover,
.edit-gender-form button + button:hover,
.edit-familyid-form button + button:hover {
  background-color: #c82333;
}
</style>
