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
      <!-- Emoji del perfil -->
      <div class="profile-icon" @click="redirectToProfile">
        👤
      </div>
      
      <!-- Botón del menú hamburguesa -->
      <button class="hamburger-btn" @click="toggleMenu">
        ☰
      </button>
      
      <!-- Dropdown del menú -->
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
      >
        <!-- Emoji dependiendo del tipo de habitación -->
        <div class="room-icon">
          <span class="btn-icon">{{ getEmojiForRoom(room.roomName) }}</span>
        </div>
        <span class="room-name">{{ room.roomName }}</span>
      </div>
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
      columns: 4, // Número de columnas en la cuadrícula
      roomSize: 160, // Tamaño de cada habitación en píxeles
      userId: localStorage.getItem("userId"), // Obtener el userId del localStorage
      menuOpen: false, // Estado del menú hamburguesa
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
          const column = index % this.columns; // Calcular la columna de la habitación
          const row = Math.floor(index / this.columns); // Calcular la fila de la habitación

          // Calcular las posiciones X y Y
          return {
            ...room,
            x: column * this.roomSize,
            y: row * this.roomSize,
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
