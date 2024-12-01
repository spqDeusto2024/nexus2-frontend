<template>
  <div class="family-container">
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
    <div class="family-header">
      <h1 class="family-title">Gestión de Familias</h1>
      <p class="family-subtitle">Administra las familias en el refugio.</p>
    </div>

    <!-- Tabla de familias -->
    <table class="family-table">
      <thead>
        <tr>
          <th>ID Familia</th>
          <th>Nombre de Familia</th>
          <th>ID de Habitación</th>
          <th>ID de Refugio</th>
          <th>Creada por</th>
          <th>Fecha de Creación</th>
          <th>Acciones</th> <!-- Nueva columna para las acciones -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="family in families" :key="family.idFamily">
          <td>{{ family.idFamily }}</td>
          <td>{{ family.familyName }}</td>
          <td>{{ family.idRoom }}</td>
          <td>{{ family.idShelter }}</td>
          <td>{{ family.createdBy }}</td>
          <td>{{ formatDate(family.createDate) }}</td>
          <td>
            <!-- Botón de eliminar -->
            <button class="delete-btn" @click="deleteFamily(family.idFamily)">
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
  name: "FamilyManagement",
  data() {
    return {
      families: [], // Lista de familias obtenida del backend
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

    // Obtiene la lista de familias del backend
    async fetchFamilies() {
      try {
        const response = await axios.get("http://localhost:8000/family/list");
        if (response.data.status === "ok") {
          this.families = response.data.families;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener las familias:", error);
        this.showNotification = true;
        this.notificationMessage = "Error al cargar la lista de familias.";
        this.notificationType = "error";
      }
    },

    // Formatea la fecha de creación
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(); // Formato local de fecha (ej: 18/11/2024)
    },

    // Elimina una familia usando su ID
    async deleteFamily(familyId) {
      if (confirm("¿Estás seguro de que deseas eliminar esta familia?")) {
        try {
          // Hacer una solicitud DELETE al endpoint de eliminación
          const response = await axios.delete(`http://localhost:8000/family/delete?family_id=${familyId}`);

          if (response.data.status === "ok") {
            this.showNotification = true;
            this.notificationMessage = "Familia eliminada correctamente.";
            this.notificationType = "success";
            this.fetchFamilies(); // Recarga la lista de familias después de la eliminación
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          console.error("Error al eliminar la familia:", error);
          this.showNotification = true;
          this.notificationMessage = "Error al eliminar la familia.";
          this.notificationType = "error";
        }
      }
    }
  },

  // Al crear el componente, carga la lista de familias
  created() {
    this.fetchFamilies();
  },
};
</script>

<style scoped>
/* Contenedor general */
.family-container {
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
.family-header {
  text-align: center;
  margin-bottom: 20px;
}

.family-title {
  font-size: 2.2rem;
  color: #ffcc00; /* Naranja para el título */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.family-subtitle {
  font-size: 1.1rem;
  color: #bdbdbd;
}

/* Tabla */
.family-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.family-table th, .family-table td {
  border: 1px solid #444;
  padding: 10px;
  text-align: center;
}

.family-table th {
  background-color: #333;
  color: #fff;
}

.family-table tr:nth-child(even) {
  background-color: #222;
}

.family-table tr:hover {
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
