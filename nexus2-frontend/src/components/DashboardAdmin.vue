<template>
  <div class="map-container">
    <!-- Logo -->
    <img 
      src="@/assets/logo.png" 
      alt="Logo Nexus2" 
      class="logo" 
      @click="redirectToHome" 
    />

    <!-- Cabecera -->
    <div class="map-header">
      <h1 class="map-title">Mapa de Habitaciones</h1>
      <p class="map-subtitle">Explora las habitaciones disponibles en el refugio.</p>
    </div>

    <!-- Menú Hamburguesa con Perfil -->
    <div class="hamburger-menu">
      <div class="profile-icon" @click="redirectToProfile">👤</div>
      <button class="hamburger-btn" @click="toggleMenu">☰</button>
      <div v-if="menuOpen" class="menu-dropdown">
        <button @click="redirectToCreateAdmin">Crear Administrador</button>
        <button @click="redirectToDeleteAdmin">Eliminar Administrador</button>
      </div>
    </div>

    <!-- Contenedor del mapa -->
    <div class="map-layout">
      <div
        v-for="room in rooms"
        :key="room.idRoom"
        class="room-block"
        :style="{ top: `${room.y}px`, left: `${room.x}px` }"
        @mouseenter="showResidentButton(room.idRoom)"
        @mouseleave="hideResidentButton"
      >
        <div class="room-icon">
          <span class="btn-icon">{{ getEmojiForRoom(room.roomName) }}</span>
        </div>
        <span class="room-name">{{ room.roomName }}</span>
        
        <!-- Botón de listar residentes (solo visible al pasar el ratón) -->
        <button v-if="activeRoomId === room.idRoom" class="list-residents-btn" @click="fetchRoomResidents(room.idRoom)">
          Listar Residentes
        </button>
      </div> 
    </div>

    <!-- Tabla de residentes -->
    <div v-if="showResidentsTable" class="residents-table">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Fecha de Nacimiento</th>
            <th>Género</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resident in residents" :key="resident.idResident">
            <td>{{ resident.name }}</td>
            <td>{{ resident.surname }}</td>
            <td>{{ resident.birthDate }}</td>
            <td>{{ resident.gender }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="closeResidentsTable">Cerrar</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RoomMap",
  data() {
    return {
      rooms: [], // Almacena habitaciones obtenidas del backend
      residents: [], // Almacena los residentes de la habitación seleccionada
      showResidentsTable: false, // Controla la visibilidad de la tabla de residentes
      userId: localStorage.getItem("userId"), // Obtener el userId del localStorage
      menuOpen: false, // Estado del menú hamburguesa
      activeRoomId: null, // ID de la habitación activa (para mostrar el botón "Listar Residentes")
    };
  },
  methods: {
    // Alterna el estado del menú hamburguesa
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },

    // Redirige al usuario a la página de inicio
    redirectToHome() {
      this.$router.push("/");  // Cambia "/home" por la ruta correcta en tu aplicación
    },

    // Redirige al componente Crear Administrador
    redirectToCreateAdmin() {
      this.$router.push("/createAdmin");
      this.menuOpen = false; // Cierra el menú
    },

    // Redirige al componente Eliminar Administrador
    redirectToDeleteAdmin() {
      this.$router.push("/deleteAdmin");
      this.menuOpen = false; // Cierra el menú
    },

    // Redirige al perfil del usuario
    redirectToProfile() {
      this.$router.push("/profile"); // Cambia "/profile" por la ruta de tu componente de perfil
    },

    // Llamada al backend para obtener las habitaciones
    async fetchRooms() {
      try {
        const response = await axios.get("http://localhost:8000/listRooms");
        this.rooms = response.data.rooms.map((room, index) => {
          const column = index % 4; // Calcular la columna de la habitación
          const row = Math.floor(index / 4); // Calcular la fila de la habitación
          return {
            ...room,
            x: column * 160,
            y: row * 160,
          };
        });
      } catch (error) {
        console.error("Error al obtener las habitaciones:", error);
        alert("No se pudo cargar el mapa de habitaciones.");
      }
    },

    // Obtiene el emoji adecuado según el nombre de la habitación
    getEmojiForRoom(roomName) {
      if (roomName.toLowerCase().includes("room")) {
        return "🛏️"; // Emoji de cama
      } else if (roomName.toLowerCase().includes("kitchen")) {
        return "🍳"; // Emoji de cocina
      } else {
        return "🏠"; // Emoji genérico
      }
    },

    // Muestra el botón "Listar Residentes" al pasar el ratón sobre una habitación
    showResidentButton(idRoom) {
      this.activeRoomId = idRoom;
    },

    // Oculta el botón "Listar Residentes" al salir el ratón de la habitación
    hideResidentButton() {
      this.activeRoomId = null;
    },

    // Llamada al backend para obtener los residentes de la habitación
    async fetchRoomResidents(idRoom) {
      try {
        const response = await axios.get(`http://localhost:8000/room/residents?idRoom=${idRoom}`);
        
        if (response.data.status === "ok") {
          this.residents = response.data.residents;
          this.showResidentsTable = true;
        } else {
          alert("No se encontraron residentes para esta habitación.");
        }
      } catch (error) {
        console.error("Error al obtener los residentes:", error);
        alert("Hubo un error al cargar los residentes.");
      }
    },

    // Cierra la tabla de residentes
    closeResidentsTable() {
      this.showResidentsTable = false;
      this.residents = [];
    },
  },

  // Al crear el componente, si el usuario no está logueado, lo redirigimos al login
  created() {
    if (!this.userId) {
      alert("Debes iniciar sesión para acceder al mapa.");
      this.$router.push("/"); // Redirige al login si no hay usuario logueado
    } else {
      this.fetchRooms(); // Si el usuario está logueado, obtenemos las habitaciones
    }
  },
};
</script>

<style scoped>
/* Contenedor general */
.map-container {
  position: relative;
  padding: 20px;
  min-height: 100vh;
  background-color: #121212;
  color: #e0e0e0;
  font-family: 'Poppins', sans-serif;
}

/* Estilos de la tabla de residentes */
.residents-table {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 80%;
  margin: 20px auto;
}

.residents-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

.residents-table th, .residents-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #444;
}

.residents-table th {
  background-color: #ffcc00;
  color: #121212;
}

.residents-table tr:nth-child(even) {
  background-color: #222;
}

.residents-table button {
  background-color: #ffcc00;
  color: #121212;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.residents-table button:hover {
  background-color: #e0b800;
}

/* Contenedor del mapa */
.map-layout {
  position: relative;
  width: 100%;
  height: 600px;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background: url('@/assets/map-grid.png') center/cover;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.room-block {
  position: absolute;
  width: 160px;
  height: 160px;
  text-align: center;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.room-icon {
  font-size: 2rem;
}

.room-name {
  font-size: 1rem;
  margin-top: 10px;
  font-weight: bold;
}

.list-residents-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #ffcc00;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.list-residents-btn:hover {
  background-color: #e0b800;
}

/* Contenedor general */
.map-container {
  position: relative;
  padding: 20px;
  min-height: 100vh;
  background-color: #121212;
  color: #e0e0e0;
  font-family: 'Poppins', sans-serif;
}

/* Estilos de la tabla de residentes */
.residents-table {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 80%;
  margin: 20px auto;
}

.residents-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

.residents-table th, .residents-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #444;
}

.residents-table th {
  background-color: #ffcc00;
  color: #121212;
}

.residents-table tr:nth-child(even) {
  background-color: #222;
}

.residents-table button {
  background-color: #ffcc00;
  color: #121212;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.residents-table button:hover {
  background-color: #e0b800;
}

/* Contenedor general */
.map-container {
  position: relative;
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

/* Cabecera */
.map-header {
  text-align: center;
  margin-bottom: 20px;
  color: #e0e0e0;
}

.map-title {
  font-size: 2.2rem;
  color: #ffcc00; /* Naranja para el título */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.map-subtitle {
  font-size: 1.1rem;
  color: #bdbdbd;
}

/* Contenedor del mapa */
.map-layout {
  position: relative;
  width: 100%;
  height: 600px;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background: url('@/assets/map-grid.png') center/cover; /* Fondo de cuadrícula */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
  z-index: 1; /* Asegura que el mapa esté por debajo del menú */
}

.room-block {
  position: absolute;
  width: 160px;
  height: 160px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #e0e0e0;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.3s;
}

.room-block:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.room-name {
  margin-top: 10px;
  font-size: 14px;
  color: #ffcc00;
}

.room-icon {
  font-size: 40px;
}

/* Menú Hamburguesa */
.hamburger-menu {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  z-index: 10; /* Asegura que el menú esté por encima del mapa */
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
  z-index: 9; /* Asegura que el dropdown esté sobre cualquier otro elemento */
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
  background: #555;
}

/* Icono del perfil */
.profile-icon {
  display: inline-block;
  font-size: 24px; /* Tamaño del emoji */
  cursor: pointer;
  margin-right: 10px; /* Espaciado entre el perfil y el menú */
  transition: transform 0.2s ease;
}

.profile-icon:hover {
  transform: scale(1.1); /* Efecto de agrandamiento al pasar el mouse */
}
</style>
