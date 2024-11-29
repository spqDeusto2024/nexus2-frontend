<template>
  <div class="admin-container">
    <!-- Logo -->
    <img 
      src="@/assets/logo.png" 
      alt="Logo Nexus2" 
      class="logo" 
      @click="redirectToHome" 
    />

    <!-- Notificación de acción -->
    <div
      v-if="showNotification"
      :class="['notification', notificationType]"
    >
      <span>{{ notificationMessage }}</span>
      <button class="close-btn" @click="closeNotification">✖</button>
    </div>

    <!-- Cabecera -->
    <div class="admin-header">
      <h1 class="admin-title">Gestión de Administradores</h1>
      <p class="admin-subtitle">Administra los usuarios con privilegios en el sistema.</p>
    </div>

    <!-- Tabla de administradores -->
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in admins" :key="admin.idAdmin">
          <td>{{ admin.idAdmin }}</td>
          <td>{{ admin.email }}</td>
          <td>
            <button class="delete-btn" @click="deleteAdmin(admin.idAdmin)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "AdminManagement",
  data() {
    return {
      admins: [], // Lista de administradores obtenida del backend
      notificationMessage: '',  // Mensaje de la notificación
      notificationType: '',     // Tipo de la notificación: "success" o "error"
      showNotification: false,  // Si se debe mostrar la notificación o no
    };
  },
  methods: {
    // Redirige al usuario a la página de inicio
    redirectToHome() {
      this.$router.push("/");  // Cambia "/home" por la ruta correcta en tu aplicación
    },

    // Método para cerrar la notificación
    closeNotification() {
      this.showNotification = false;
    },

    // Obtiene la lista de administradores del backend
    async fetchAdmins() {
      try {
        const response = await axios.get("http://localhost:8000/admin/list");
        if (response.data.status === "ok") {
          this.admins = response.data.admins;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener los administradores:", error);
        this.showNotification = true;
        this.notificationMessage = "Error al cargar la lista de administradores.";
        this.notificationType = "error";
      }
    },

    // Elimina un administrador por su ID
    async deleteAdmin(adminId) {
      if (confirm("¿Estás seguro de que deseas eliminar este administrador?")) {
        try {
          const response = await axios.delete("http://localhost:8000/admin/delete", {
            params: { admin_id: adminId },
          });

          if (response.data.status === "ok") {
            this.showNotification = true;
            this.notificationMessage = "Administrador eliminado exitosamente.";
            this.notificationType = "success";
            this.fetchAdmins(); // Recarga la lista de administradores
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          console.error("Error al eliminar al administrador:", error);
          this.showNotification = true;
          this.notificationMessage = "Error al intentar eliminar al administrador.";
          this.notificationType = "error";
        }
      }
    },
  },

  // Al crear el componente, carga la lista de administradores
  created() {
    this.fetchAdmins();
  },
};
</script>
<style scoped>
/* Contenedor general */
.admin-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #121212; /* Fondo oscuro */
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

/* Notificación */
.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  width: 80%;
  max-width: 500px;
  z-index: 999;
}

.notification.success {
  background-color: #4CAF50; /* Verde */
}

.notification.error {
  background-color: #f44336; /* Rojo */
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}

.close-btn:hover {
  color: #ddd;
}

/* Cabecera */
.admin-header {
  text-align: center;
  margin-bottom: 20px;
}

.admin-title {
  font-size: 2.2rem;
  color: #ffcc00; /* Naranja para el título */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.admin-subtitle {
  font-size: 1.1rem;
  color: #bdbdbd;
}

/* Tabla */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.admin-table th, .admin-table td {
  border: 1px solid #444;
  padding: 10px;
  text-align: center;
}

.admin-table th {
  background-color: #333;
  color: #fff;
}

.admin-table tr:nth-child(even) {
  background-color: #222;
}

.admin-table tr:hover {
  background-color: #444;
}

/* Botón Eliminar */
.delete-btn {
  background-color: #f44336;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background-color: #d32f2f;
}
</style>
