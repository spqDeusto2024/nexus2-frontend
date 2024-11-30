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
      <h1 class="profile-title">Perfil del Administrador</h1>
      <p class="profile-subtitle">Visualiza y edita los datos del administrador.</p>
    </div>

    <!-- Menú Hamburguesa -->
    <div class="hamburger-menu">
      <button class="hamburger-btn" @click="toggleMenu">
        ☰
      </button>
      
      <div v-if="menuOpen" class="menu-dropdown">
        <button @click="redirectToCreateAdmin">Crear Administrador</button>
        <button @click="redirectToDeleteAdmin">Eliminar Administrador</button>
        <button @click="redirectToMachineStatus">Ver Estado de Máquinas</button> 
      </div>
    </div>

    <!-- Datos del Administrador -->
    <div class="admin-info">
      <div class="info-field">
        <label>Email:</label>
        <span>{{ admin.email }}</span>
        <button @click="editEmail">Editar</button>
      </div>
      <div class="info-field">
        <label>Nombre:</label>
        <span>{{ admin.name }}</span>
        <button @click="editName">Editar</button>
      </div>
      <div class="info-field">
        <label>Password:</label>
        <span>{{ admin.password }}</span>
        <button @click="editPassword">Editar</button>
      </div>
    </div>

    <!-- Formulario para editar el email -->
    <div v-if="editingEmail" class="edit-email-form">
      <label for="new-email">Nuevo email:</label>
      <input type="email" v-model="newEmail" id="new-email" placeholder="Nuevo email" />
      <button @click="submitNewEmail">Actualizar email</button>
      <button @click="cancelEditEmail">Cancelar</button>
    </div>

    <!-- Formulario para editar el nombre -->
    <div v-if="editingName" class="edit-name-form">
      <label for="new-name">Nuevo nombre:</label>
      <input type="text" v-model="newName" id="new-name" placeholder="Nuevo nombre" />
      <label for="confirm-name">Repetir nuevo nombre:</label>
      <input type="text" v-model="confirmName" id="confirm-name" placeholder="Repetir nombre" />
      <button @click="submitNewName">Actualizar nombre</button>
      <button @click="cancelEditName">Cancelar</button>
    </div>

    <!-- Formulario para editar la contraseña -->
    <div v-if="editingPassword" class="edit-password-form">
      <label for="new-password">Nueva contraseña:</label>
      <input type="password" v-model="newPassword" id="new-password" placeholder="Nueva contraseña" />
      <label for="confirm-password">Repetir nueva contraseña:</label>
      <input type="password" v-model="confirmPassword" id="confirm-password" placeholder="Repetir contraseña" />
      <button @click="submitNewPassword">Actualizar contraseña</button>
      <button @click="cancelEditPassword">Cancelar</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminProfile",
  data() {
    return {
      admin: { idAdmin: "", email: "", name: "", password: "" },
      userId: localStorage.getItem("userId"),
      menuOpen: false,
      editingEmail: false,
      editingName: false,
      editingPassword: false,
      newEmail: "",
      newName: "",
      confirmName: "",
      newPassword: "",
      confirmPassword: "",
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    redirectToHome() {
      this.$router.push("/");
    },
    redirectToCreateAdmin() {
      this.$router.push("/createAdmin");
      this.menuOpen = false;
    },
    redirectToDeleteAdmin() {
      this.$router.push("/deleteAdmin");
      this.menuOpen = false;
    },
    redirectToMachineStatus() {
      this.$router.push("/estadoMaquinas");
      this.menuOpen = false;
    },
    async fetchAdminData() {
      try {
        if (!this.userId) {
          alert("Debes iniciar sesión para acceder a tu perfil.");
          this.$router.push("/");
          return;
        }
        const response = await axios.get(`http://localhost:8000/admin/get?admin_id=${this.userId}`);
        if (response.data.status === "ok") {
          this.admin = response.data.admin;
        } else {
          alert("No se pudo obtener los datos del administrador.");
        }
      } catch (error) {
        console.error("Error al obtener los datos del administrador:", error);
        alert("Hubo un error al cargar los datos.");
      }
    },
    editEmail() {
      this.editingEmail = true;
    },
    async submitNewEmail() {
      if (!this.newEmail) {
        alert("Por favor, ingresa un nuevo email.");
        return;
      }
      try {
        const url = `http://localhost:8000/admin/email?idAdmin=${this.userId}&new_email=${encodeURIComponent(this.newEmail)}`;
        const response = await axios.put(url);
        if (response.data.status === "ok") {
          alert("Email actualizado exitosamente.");
          this.editingEmail = false;
          this.newEmail = "";
          await this.fetchAdminData();
        } else {
          alert("Error al actualizar el email.");
        }
      } catch (error) {
        console.error("Error al actualizar el email:", error);
        alert("Hubo un error al intentar actualizar el email.");
      }
    },
    cancelEditEmail() {
      this.editingEmail = false;
      this.newEmail = "";
    },
    editName() {
      this.editingName = true;
    },
    async submitNewName() {
      if (this.newName !== this.confirmName) {
        alert("Los nombres no coinciden.");
        return;
      }
      if (!this.newName) {
        alert("Por favor, ingresa un nombre.");
        return;
      }
      try {
        const url = `http://localhost:8000/admin/name?idAdmin=${this.userId}&new_name=${encodeURIComponent(this.newName)}`;
        const response = await axios.put(url);
        if (response.data.status === "ok") {
          alert("Nombre actualizado exitosamente.");
          this.editingName = false;
          this.newName = "";
          this.confirmName = "";
          await this.fetchAdminData();
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
      this.confirmName = "";
    },
    editPassword() {
      this.editingPassword = true;
    },
    async submitNewPassword() {
      if (this.newPassword !== this.confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }
      if (!this.newPassword) {
        alert("Por favor, ingresa una nueva contraseña.");
        return;
      }
      try {
        const url = `http://localhost:8000/admin/password?idAdmin=${this.userId}&new_password=${encodeURIComponent(this.newPassword)}`;
        const response = await axios.put(url);
        if (response.data.status === "ok") {
          alert("Contraseña actualizada exitosamente.");
          this.editingPassword = false;
          this.newPassword = "";
          this.confirmPassword = "";
        } else {
          alert("Error al actualizar la contraseña.");
        }
      } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        alert("Hubo un error al intentar actualizar la contraseña.");
      }
    },
    cancelEditPassword() {
      this.editingPassword = false;
      this.newPassword = "";
      this.confirmPassword = "";
    },
  },
  created() {
    this.userId = localStorage.getItem("userId");
    if (!this.userId) {
      alert("Debes iniciar sesión para acceder a tu perfil.");
      this.$router.push("/");
    } else {
      this.fetchAdminData();
    }
  },
};
</script>

<style scoped>
/* Estilos para formularios y botones */
.edit-email-form, .edit-name-form, .edit-password-form {
  margin-top: 20px;
  background-color: #333;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-email-form input, .edit-name-form input, .edit-password-form input {
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #222;
  color: #fff;
}

.edit-email-form button, .edit-name-form button, .edit-password-form button {
  background-color: #ffcc00;
  color: #121212;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.edit-email-form button:hover, .edit-name-form button:hover, .edit-password-form button:hover {
  background-color: #e0b800;
}
/* Estilos para el formulario de edición de email */
.edit-email-form {
  margin-top: 20px;
  background-color: #333;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-email-form input {
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #222;
  color: #fff;
}

.edit-email-form button {
  background-color: #ffcc00;
  color: #121212;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.edit-email-form button:hover {
  background-color: #e0b800;
}
</style>

<style scoped>
/* Estilos para el formulario de edición de email */
.edit-email-form {
  margin-top: 20px;
  background-color: #333;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-email-form input {
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #222;
  color: #fff;
}

.edit-email-form button {
  background-color: #ffcc00;
  color: #121212;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.edit-email-form button:hover {
  background-color: #e0b800;
}

/* Contenedor general */
.profile-container {
  position: relative;
  padding: 20px;
  min-height: 100vh;
  background-color: #121212;
  color: #e0e0e0;
  font-family: 'Poppins', sans-serif;
}

/* Logo */
.logo {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 120px;
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
  color: #e0e0e0;
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
  display: flex;
  align-items: center;
  z-index: 10;
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

/* Datos del Administrador */
.admin-info {
  margin-top: 60px;
  text-align: left;
}

.info-field {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 10px;
  background-color: #333;
  border-radius: 5px;
}

.info-field label {
  font-weight: bold;
}

.info-field button {
  background-color: #ffcc00;
  color: #121212;
  border: none;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.info-field button:hover {
  background-color: #e0b800;
}

/* Formulario de edición de la contraseña */
.edit-password-form {
  margin-top: 20px;
  background-color: #333;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-password-form input {
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #222;
  color: #fff;
}

.edit-password-form button {
  background-color: #ffcc00;
  color: #121212;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

/* Estilos para el formulario de edición de nombre */
.edit-name-form {
  margin-top: 20px;
  background-color: #333;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-name-form input {
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #222;
  color: #fff;
}

.edit-name-form button {
  background-color: #ffcc00;
  color: #121212;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.edit-name-form button:hover {
  background-color: #e0b800;
}
</style>


<style scoped>
/* Estilos para el formulario de edición de nombre */
.edit-name-form {
  margin-top: 20px;
  background-color: #333;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-name-form input {
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #222;
  color: #fff;
}

.edit-name-form button {
  background-color: #ffcc00;
  color: #121212;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.edit-name-form button:hover {
  background-color: #e0b800;
}


.edit-password-form button:hover {
  background-color: #e0b800;
}
</style>
