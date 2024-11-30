<template>
  <div class="resident-container">
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
    <div class="resident-header">
      <h1 class="resident-title">Gestión de Residentes</h1>
      <p class="resident-subtitle">Administra los residentes en el refugio.</p>
    </div>

    <!-- Tabla de residentes -->
    <table class="resident-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Fecha de Nacimiento</th>
          <th>Género</th>
          <th>ID de Familia</th>
          <th>ID de Habitación</th>
          <th>Acciones</th> <!-- Nueva columna para las acciones -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="resident in residents" :key="resident.idResident">
          <td>{{ resident.idResident }}</td>
          <td>{{ resident.name }}</td>
          <td>{{ resident.surname }}</td>
          <td>{{ formatDate(resident.birthDate) }}</td>
          <td>{{ resident.gender }}</td>
          <td>{{ resident.idFamily }}</td>
          <td>{{ resident.idRoom }}</td>
          <td>
            <!-- Botón de eliminar -->
            <button class="delete-btn" @click="deleteResident(resident.idResident)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ResidentManagement",
  data() {
    return {
      residents: [], // Lista de residentes obtenida del backend
      notificationMessage: '',  // Mensaje de la notificación
      notificationType: '',     // Tipo de la notificación: "success" o "error"
      showNotification: false,  // Si se debe mostrar la notificación o no
    };
  },
  methods: {
    // Redirige al usuario a la página de inicio
    redirectToHome() {
      this.$router.push("/dashboardAdmin");  // Redirigir al dashboard del administrador
    },

    // Método para cerrar la notificación
    closeNotification() {
      this.showNotification = false;
    },

    // Obtiene la lista de residentes del backend
    async fetchResidents() {
      try {
        const response = await axios.get("http://localhost:8000/resident/list");
        if (response.data.status === "ok") {
          this.residents = response.data.residents;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener los residentes:", error);
        this.showNotification = true;
        this.notificationMessage = "Error al cargar la lista de residentes.";
        this.notificationType = "error";
      }
    },

    // Formatea la fecha de nacimiento
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(); // Formato local de fecha (ej: 18/11/2024)
    },

    // Elimina un residente usando su ID
    async deleteResident(residentId) {
      if (confirm("¿Estás seguro de que deseas eliminar este residente?")) {
        try {
          // Hacer una solicitud DELETE al endpoint de eliminación
          const response = await axios.delete(`http://localhost:8000/resident/delete/${residentId}`);

          if (response.data.status === "ok") {
            this.showNotification = true;
            this.notificationMessage = "Residente eliminado correctamente.";
            this.notificationType = "success";
            this.fetchResidents(); // Recarga la lista de residentes después de la eliminación
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          console.error("Error al eliminar el residente:", error);
          this.showNotification = true;
          this.notificationMessage = "Error al eliminar el residente.";
          this.notificationType = "error";
        }
      }
    }
  },

  // Al crear el componente, carga la lista de residentes
  created() {
    this.fetchResidents();
  },
};
</script>

<style scoped>
/* Contenedor general */
.resident-container {
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
.resident-header {
  text-align: center;
  margin-bottom: 20px;
}

.resident-title {
  font-size: 2.2rem;
  color: #ffcc00; /* Naranja para el título */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.resident-subtitle {
  font-size: 1.1rem;
  color: #bdbdbd;
}

/* Tabla */
.resident-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.resident-table th, .resident-table td {
  border: 1px solid #444;
  padding: 10px;
  text-align: center;
}

.resident-table th {
  background-color: #333;
  color: #fff;
}

.resident-table tr:nth-child(even) {
  background-color: #222;
}

.resident-table tr:hover {
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
