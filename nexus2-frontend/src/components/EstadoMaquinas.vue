<template>
  <div class="machine-container">
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
    <div class="machine-header">
      <h1 class="machine-title">Gestión de Máquinas</h1>
      <p class="machine-subtitle">Administra las máquinas en el refugio.</p>
    </div>

    <!-- Tabla de máquinas -->
    <table class="machine-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre de la Máquina</th>
          <th>Estado</th>
          <th>Fecha de Creación</th>
          <th>Acciones</th> <!-- Nueva columna para las acciones -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="machine in machines" :key="machine.idMachine">
          <td>{{ machine.idMachine }}</td>
          <td>{{ machine.machineName }}</td>
          <td>{{ machine.on ? 'Encendida' : 'Apagada' }}</td>
          <td>{{ formatDate(machine.createDate) }}</td>
          <td>
            <!-- Botón de eliminar -->
            <button class="delete-btn" @click="deleteMachine(machine.idMachine)">
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
  name: "MachineManagement",
  data() {
    return {
      machines: [], // Lista de máquinas obtenida del backend
      notificationMessage: '',  // Mensaje de la notificación
      notificationType: '',     // Tipo de la notificación: "success" o "error"
      showNotification: false,  // Si se debe mostrar la notificación o no
    };
  },
  methods: {
    // Redirige al usuario a la página de inicio
    redirectToHome() {
      this.$router.push("/dashboardAdmin");  // Cambia "/home" por la ruta correcta en tu aplicación
    },

    // Método para cerrar la notificación
    closeNotification() {
      this.showNotification = false;
    },

    // Obtiene la lista de máquinas del backend
    async fetchMachines() {
      try {
        const response = await axios.get("http://localhost:8000/machine/list");
        if (response.data.status === "ok") {
          this.machines = response.data.machines;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener las máquinas:", error);
        this.showNotification = true;
        this.notificationMessage = "Error al cargar la lista de máquinas.";
        this.notificationType = "error";
      }
    },

    // Formatea la fecha de creación
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(); // Formato local de fecha (ej: 18/11/2024)
    },

    // Elimina una máquina usando su ID
    async deleteMachine(machineId) {
      if (confirm("¿Estás seguro de que deseas eliminar esta máquina?")) {
        try {
          const response = await axios.delete("http://localhost:8000/machine/delete", {
            params: { machine_id: machineId }
          });

          if (response.data.status === "ok") {
            this.showNotification = true;
            this.notificationMessage = "Máquina eliminada correctamente.";
            this.notificationType = "success";
            this.fetchMachines(); // Recarga la lista de máquinas
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          console.error("Error al eliminar la máquina:", error);
          this.showNotification = true;
          this.notificationMessage = "Error al eliminar la máquina.";
          this.notificationType = "error";
        }
      }
    }
  },

  // Al crear el componente, carga la lista de máquinas
  created() {
    this.fetchMachines();
  },
};
</script>

<style scoped>
/* Contenedor general */
.machine-container {
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
.machine-header {
  text-align: center;
  margin-bottom: 20px;
}

.machine-title {
  font-size: 2.2rem;
  color: #ffcc00; /* Naranja para el título */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.machine-subtitle {
  font-size: 1.1rem;
  color: #bdbdbd;
}

/* Tabla */
.machine-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.machine-table th, .machine-table td {
  border: 1px solid #444;
  padding: 10px;
  text-align: center;
}

.machine-table th {
  background-color: #333;
  color: #fff;
}

.machine-table tr:nth-child(even) {
  background-color: #222;
}

.machine-table tr:hover {
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
