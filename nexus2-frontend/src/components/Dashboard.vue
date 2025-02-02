<template>
  <div class="map-container">
    <!-- Logo que redirige al home -->
    <router-link to="/" class="logo-container">
      <img src="@/assets/logo.png" alt="Logo Nexus2" class="logo" />
    </router-link>

      <!-- Búsqueda de residente -->
    <div class="search-container">
      <input 
        v-model="searchName" 
        type="text" 
        placeholder="Nombre"
        class="search-input" 
      />
      <input 
        v-model="searchSurname" 
        type="text" 
        placeholder="Apellido" 
        class="search-input" 
      />
      <button @click="searchResident" class="search-btn">Buscar</button>
    </div>

    <!-- Mensaje de resultado de búsqueda -->
    <div v-if="searchResult" class="search-result">
      <p>
        La persona se encuentra en la habitación: 
        <span class="green-text">{{ searchResult.room.roomName }}</span>
        <button class="close-btn" @click="closeResult">×</button>
      </p>
    </div>
    
    <!-- Botón de perfil que redirige a /residentProfile -->
    <router-link to="/residentProfile" class="profile-button">
      <span class="profile-icon">👤</span> Perfil
    </router-link>

    <!-- Notificación de acceso -->
    <div v-if="showNotification" :class="['notification', notificationType]">
      <span>{{ notificationMessage }}</span>
      <button class="close-btn" @click="closeNotification">✖</button>
    </div>

    <!-- Cabecera -->
    <div class="map-header">
      <h1 class="map-title">Mapa de Habitaciones</h1>
      <p class="map-subtitle">Explora las habitaciones disponibles en el refugio.</p>
    </div>

    <!-- Contenedor del mapa -->
    <div class="map-layout">
      <div
        v-for="room in rooms"
        :key="room.idRoom"
        class="room-block"
        :style="{ top: room.y + 'px', left: room.x + 'px' }"
      >
        <!-- Emoji dependiendo del tipo de habitación -->
        <div class="room-icon">
          <span class="btn-icon">{{ getEmojiForRoom(room.roomName) }}</span>
        </div>
        <span class="room-name">{{ room.roomName }}</span>

        <!-- Botón "Moverme aquí" -->
        <button class="move-btn" @click="moveToRoom(room)">
          Moverme aquí
        </button>
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
      notificationMessage: "", // Mensaje de la notificación
      notificationType: "", // Tipo de la notificación: "success" o "error"
      showNotification: false, // Si se debe mostrar la notificación o no
      searchName: "",
      searchSurname: "",
      searchResult: null,
    };
  },
  methods: {

    async searchResident() {
      if (this.searchName.trim() === "" || this.searchSurname.trim() === "") {
        alert("Por favor, ingrese tanto el nombre como el apellido.");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8000/resident/search`, {
          params: {
            name: this.searchName,
            surname: this.searchSurname
          }
        });

        if (response.data.status === "ok" && response.data.room) {
          this.searchResult = response.data; // Guardamos el resultado en searchResult
        } else {
          this.searchResult = null;
          alert("No se encontró ningún residente con esos datos.");
        }
      } catch (error) {
        console.error("Error al buscar al residente:", error);
        alert("Hubo un error al realizar la búsqueda.");
      }
    },

    // Método para cerrar el mensaje de búsqueda
    closeResult() {
      this.searchResult = null; // Cerramos el mensaje al poner searchResult a null
    },

    // Llamada al backend para obtener las habitaciones
    async fetchRooms() {
      try {
        const response = await axios.get("http://localhost:8000/listRooms");
        this.rooms = response.data.rooms.map((room, index) => {
          const column = index % this.columns; // Calcular la columna de la habitación
          const row = Math.floor(index / this.columns); // Calcular la fila de la habitación
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
        const roomNameLower = roomName.toLowerCase();
      // Añadimos una condición especial para "games"
      if (roomNameLower.includes("games")) {
        return "🎮";  // Emoji para juegos
      } else if (roomNameLower.includes("room")) {
        return "🛏️";
      } else if (roomNameLower.includes("kitchen")) {
        return "🍳";
      } else if (roomNameLower.includes("mantenimiento") || roomNameLower.includes("maquina")) {
        return "⚙️";
      } else {
        return "🏠";  // Por defecto, para otras habitaciones
      }
    },

    // Lógica para mover al usuario a la habitación seleccionada
    async moveToRoom(room) {
      if (!this.userId) {
        alert("Debes iniciar sesión para moverte.");
        this.$router.push("/"); // Redirige al login si no hay usuario logueado
        return;
      }

      try {
        // Paso 1: Verificar si el residente puede acceder a la habitación
        const accessUrl = `http://localhost:8000/room/access?idResident=${this.userId}&idRoom=${room.idRoom}`;
        const accessResponse = await axios.get(accessUrl);

        const accessMessage = accessResponse.data.message || "Ocurrió un error desconocido.";

        // Paso 2: Analizar la respuesta del backend
        if (accessMessage.includes("denied")) {
          // Mostrar notificación de acceso denegado
          this.showNotification = true;
          this.notificationMessage = accessMessage;
          this.notificationType = "error"; // Rojo
          return; // Detener aquí, no realizar el PUT
        }

        if (!accessMessage.includes("granted")) {
          // Si el mensaje no contiene "granted", asumimos que algo salió mal
          this.showNotification = true;
          this.notificationMessage = "Error al verificar el acceso.";
          this.notificationType = "error";
          return; // Detener aquí, no realizar el PUT
        }

        // Paso 3: Si el acceso es permitido, realizar el PUT para mover al residente
        const levelUrl = `http://localhost:8000/resident/idRoom?resident_id=${this.userId}&new_room_id=${room.idRoom}`;
        const moveResponse = await axios.put(levelUrl);

        const moveMessage = moveResponse.data.message || "Error al intentar mover a la habitación.";

        // Analizar el resultado del PUT
        if (moveMessage === "Room updated successfully.") {
          this.notificationMessage = "Te has movido a la habitación correctamente.";
          this.notificationType = "success"; // Verde
        } else {
          this.notificationMessage = moveMessage;
          this.notificationType = "error"; // Rojo
        }

        this.showNotification = true;

      } catch (error) {
        console.error("Error al mover al usuario:", error);
        this.notificationMessage =
          "Ocurrió un error al intentar acceder a la habitación.";
        this.notificationType = "error";
        this.showNotification = true;
      }
    },

    // Método para cerrar la notificación
    closeNotification() {
      this.showNotification = false;
    },
  },

  created() {
    if (!this.userId) {
      alert("Debes iniciar sesión para acceder al mapa.");
      this.$router.push("/"); // Redirige al login si no hay usuario logueado
    } else {
      this.fetchRooms();
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

/* Contenedor del logo con enlace */
.logo-container {
  position: absolute;
  top: 20px;
  left: 20px;
}

.logo {
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
}

/* Habitaciones como bloques */
.room-block {
  position: absolute;
  width: 140px;
  height: 140px;
  background: #2a2a2a; /* Fondo gris oscuro */
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 3px solid #444;
  font-size: 1rem;
  font-weight: 600;
  cursor: default;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.4);
}

.room-block:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.5);
}

/* Emoji de habitación */
.room-icon {
  margin-bottom: 10px;
  font-size: 2rem;
}

/* Nombre de la habitación */
.room-name {
  text-transform: uppercase;
  text-align: center;
  font-size: 0.9rem;
}

/* Botón de mover */
.move-btn {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffcc00;
  color: #121212;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s;
  opacity: 0; /* Inicialmente oculto */
  pointer-events: none; /* No se puede interactuar mientras no esté visible */
}

.room-block:hover .move-btn {
  opacity: 1; /* Aparece al hacer hover sobre la habitación */
  pointer-events: auto;
}

.move-btn:hover {
  background-color: #e0b800;
  transform: scale(1.05);
}

/* Botón de perfil */
.profile-button {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #ffcc00;
  color: #121212;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  border-radius: 8px;
  transition: transform 0.3s ease, background-color 0.3s ease;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.profile-button:hover {
  background-color: #e0b800;
  transform: scale(1.05);
}

.profile-icon {
  margin-right: 8px;
  font-size: 1.2rem;
}

.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.search-input {
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 150px;
}

.search-btn {
  padding: 10px 20px;
  background-color: #4caf50; /* Verde */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #45a049;
}

/* Estilo para el mensaje de búsqueda exitosa */
.search-result {
  text-align: center;
  font-size: 1.2rem;
  color: #4caf50; /* Verde */
  position: relative; /* Para posicionar el botón de cierre */
  padding: 10px;
  border: 1px solid #4caf50;
  background-color: #e8f5e9;
  border-radius: 5px;
  max-width: 400px;
  margin: 10px auto;
}

.green-text {
  font-weight: bold;
  color: #28a745;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  color: #28a745;
  font-size: 20px;
  cursor: pointer;
  font-weight: bold;
}

.close-btn:hover {
  color: #d32f2f; /* Rojo para el hover */
}

</style>