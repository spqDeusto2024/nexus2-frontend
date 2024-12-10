<template>
  <div class="map-container">
    <!-- Logo -->
    <img 
      src="@/assets/logo.png" 
      alt="Logo Nexus2" 
      class="logo" 
      @click="redirectToHome" 
    />

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

    <!-- Alerta de Peligro -->
    <div v-if="showAlarm" class="alarm">
      <p>{{ alarmMessage }}</p>
      <button @click="turnOffMachine">Apagar Máquina</button>
    </div>

    <div v-if="machineRepair" class="repair-alert">
      <p>⚠️ La máquina {{ currentMachine }} está apagada. Haz clic en reparar.</p>
      <button class="repair-btn" @click="repairMachine">Reparar Máquina</button>
    </div>

    <!-- Niveles del refugio -->
    <div class="shelter-levels">
      <div class="shelter-level" :class="getLevelClass(energyLevel, 'energy')">
        ⚡ {{ energyLevel }}
      </div>
      <div class="shelter-level" :class="getLevelClass(waterLevel, 'water')">
        💧 {{ waterLevel }}
      </div>
      <div class="shelter-level" :class="getLevelClass(radiationLevel, 'radiation')">
        ☢️ {{ radiationLevel }}
      </div>
    </div>

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
        <button @click="redirectToMachineStatus">Ver Estado de Máquinas</button> 
        <button @click="redirectToCreateResident">Crear Residente</button>
        <button @click="redirectToListResidents">Listar Residentes</button>
        <button @click="redirectToCreateRoom">Crear habitación</button>
        <button @click="redirectToListRooms">Listar habitaciones</button>
        <button @click="redirectToCreateFamily">Crear familia</button>
        <button @click="redirectToListFamily">Ver familias</button>
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
      rooms: [],
      residents: [],
      showResidentsTable: false,
      userId: localStorage.getItem("userId"),
      menuOpen: false,
      activeRoomId: null,
      energyLevel: 0,
      waterLevel: 0,
      radiationLevel: 0,
      showAlarm: false,
      alarmMessage: "",
      currentMachine: "",
      machineRepair: false,
      idAlarm: null, // ID de la alarma
      searchName: "",
      searchSurname: "",
      searchResult: null,
    };
  },
  computed: {
    // Computed properties to handle level alerts
    isEnergyLow() {
      return this.energyLevel < 25;
    },
    isWaterLow() {
      return this.waterLevel < 25;
    },
    isRadiationHigh() {
      return this.radiationLevel > 50;
    },
    alarmStatus() {
      if (this.isRadiationHigh) {
        return { message: "⚠️ Peligro: El nivel de radiación ha superado el límite de seguridad.", machine: "radiation" };
      } else if (this.isEnergyLow) {
        return { message: "⚠️ Peligro: El nivel de energía es bajo.", machine: "energy" };
      } else if (this.isWaterLow) {
        return { message: "⚠️ Peligro: El nivel de agua es bajo.", machine: "water" };
      }
      return null;
    }
  },
  watch: {
    // Detecta cambios en alarmStatus y maneja la lógica de activación/desactivación
    alarmStatus(newVal) {
      if (newVal) {
        if (!this.idAlarm) {
          this.createAlarm(); // Solo crea la alarma si no hay una activa
        }
        this.showAlarm = true;
        this.alarmMessage = newVal.message;
        this.currentMachine = newVal.machine;
      } else {
        if (this.idAlarm) {
          this.updateAlarm("desactivada"); // Si la alarma se desactiva, actualiza el estado
        }
        this.showAlarm = false;
      }
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },

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
          this.searchResult = response.data; 
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
      this.searchResult = null;
    },

    // Método de reparación de máquina
    async repairMachine() {
      try {
        let newLevel = 0;

        if (this.currentMachine === "radiation") {
          newLevel = 20;
        } else if (this.currentMachine === "energy") {
          newLevel = 50;
        } else if (this.currentMachine === "water") {
          newLevel = 50;
        }

        const levelUrl = `http://localhost:8000/shelter/${this.currentMachine}Level?new_${this.currentMachine}_level=${newLevel}`;
        await axios.put(levelUrl);

        const machineUrl = `http://localhost:8000/machine/on?machine_name=${this.currentMachine}`;
        await axios.put(machineUrl);

        this.machineRepair = false;
        this.currentMachine = "";

        if (this.idAlarm) {
          await this.updateAlarm("reparada");
        }

        alert("La máquina se ha reparado correctamente.");
      } catch (error) {
        console.error("Error al reparar la máquina:", error);
        alert("Hubo un error al intentar reparar la máquina.");
      }
    },

    // Método para apagar la máquina (apaga la máquina que causa el peligro)
    async turnOffMachine() {
      console.log("Entrando a turnOffMachine...");
      try {
        const machineUrl = `http://localhost:8000/machine/off?machine_name=${this.currentMachine}`;
        await axios.put(machineUrl);

        this.showAlarm = false;
        this.machineRepair = true;

        await this.createAlarm(); // Crea una nueva alarma si se apaga la máquina

        if (this.idAlarm) {
          await this.updateAlarm("reparada");
        }

        alert("La máquina se ha apagado correctamente.");
      } catch (error) {
        console.error("Error al apagar la máquina:", error);
        alert("Hubo un error al intentar apagar la máquina.");
      }
    },

    // Crear una nueva alarma
    async createAlarm() {
      try {
        const response = await axios.post("http://localhost:8000/alarmLevel/create", {
          start: new Date().toISOString(),
          end: null,
          idRoom: 3, // Aquí deberías especificar el id correcto de la habitación
          createDate: new Date().toISOString(),
        });

        if (response && response.data && response.data.idAlarm) {
          this.idAlarm = response.data.idAlarm;
        } else {
          console.error("La respuesta no contiene el ID de la alarma.");
        }
      } catch (error) {
        console.error("Error al crear la alarma:", error);
      }
    },

    // Actualizar la alarma con su estado final
    async updateAlarm(status) {
      try {
        if (!this.idAlarm) {
          console.warn("No hay alarma para actualizar.");
          return;
        }

        const newEndDate = new Date().toISOString();
        const url = `http://localhost:8000/alarm/putEnd?idAlarm=${this.idAlarm}&new_enddate=${encodeURIComponent(newEndDate)}&status=${status}`;
        await axios.put(url);
      } catch (error) {
        console.error("Error al actualizar la alarma:", error);
      }
    },

    // Método para obtener la clase CSS adecuada según el nivel de los parámetros
    getLevelClass(level, type) {
      if (type === 'radiation' && level > 50) {
        return 'high-level'; 
      }
      
      if ((type === 'energy' || type === 'water') && level < 25) {
        return 'high-level'; 
      }

      return 'normal-level';
    },

    // Método para obtener las habitaciones
    async fetchRooms() {
      try {
        const response = await axios.get("http://localhost:8000/listRooms");
        this.rooms = response.data.rooms.map((room, index) => {
          const column = index % 4;
          const row = Math.floor(index / 4);
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

    // Obtener el emoji adecuado para cada habitación
    getEmojiForRoom(roomName) {
      const roomNameLower = roomName.toLowerCase();
      if (roomNameLower.includes("games")) return "🎮";
      if (roomNameLower.includes("room")) return "🛏️";
      if (roomNameLower.includes("kitchen")) return "🍳";
      if (roomNameLower.includes("mantenimiento") || roomNameLower.includes("maquina")) return "⚙️";
      return "🏠";
    },

    showResidentButton(idRoom) {
      this.activeRoomId = idRoom;
    },

    hideResidentButton() {
      this.activeRoomId = null;
    },

    // Fetch Shelter Levels every 5 seconds
    async fetchShelterLevels() {
      try {
        const [energyResponse, waterResponse, radiationResponse] = await Promise.all([
          axios.get("http://localhost:8000/shelter/energy"),
          axios.get("http://localhost:8000/shelter/water"),
          axios.get("http://localhost:8000/shelter/radiation"),
        ]);

        this.energyLevel = energyResponse.data.energyLevel;
        this.waterLevel = waterResponse.data.waterLevel;
        this.radiationLevel = radiationResponse.data.radiationLevel;
      } catch (error) {
        console.error("Error al obtener los niveles del refugio:", error);
      }
    },

    // Método para obtener los residentes de una habitación
    async fetchRoomResidents(roomId) {
      try {
        const response = await axios.get(`http://localhost:8000/room/residents?idRoom=${roomId}`);
        this.residents = response.data.residents;
        this.showResidentsTable = true;
      } catch (error) {
        console.error("Error al obtener los residentes de la habitación:", error);
      }
    },

    // Cerrar la tabla de residentes
    closeResidentsTable() {
      this.showResidentsTable = false;
      },
    },

    redirectToHome() {
      this.$router.push("/");
    },

    redirectToCreateAdmin() {
      this.$router.push("/createAdmin");
      this.menuOpen = false;
    },

    redirectToListRooms() {
      this.$router.push("/listRooms");
      this.menuOpen = false;
    },

    redirectToCreateResident() {
      this.$router.push("/createResident");
      this.menuOpen = false;
    },

    redirectToListResidents() {
      this.$router.push("/listResidents");
      this.menuOpen = false;
    },

    redirectToCreateFamily(){
      this.$router.push("/createFamily");
      this.menuOpen = false;
    },

    redirectToListFamily(){
      this.$router.push("/listFamily");
      this.menuOpen = false;
    },

    redirectToCreateRoom() {
      this.$router.push("/createRoom");
      this.menuOpen = false;
    },

    redirectToDeleteAdmin() {
      this.$router.push("/deleteAdmin");
      this.menuOpen = false;
    },

    redirectToProfile() {
      this.$router.push("/profile");
    },

    redirectToMachineStatus() {
      this.$router.push("/estadoMaquinas");
      this.menuOpen = false; 
    },

  created() {
    this.fetchRooms();
    this.fetchShelterLevels();
    setInterval(() => this.fetchShelterLevels(), 5000); // Polling cada 5 segundos
  },
};

</script>

<style scoped>
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

.shelter-levels {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.shelter-level {
  background-color: #333;
  padding: 10px 20px;
  border-radius: 10px;
  color: #ffcc00;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
}

/* Niveles del refugio */
.high-level {
  color: red; /* Rojo para niveles altos */
  font-weight: bold;
}

.low-level {
  color: green; /* Verde para niveles bajos */
  font-weight: bold;
}

.normal-level {
  color: yellow; /* Puedes cambiar esto a otro color para el nivel 100 */
  font-weight: normal;
}

.alarm {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff4d4d; /* Rojo fuerte para la alarma */
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.alarm button {
  background-color: #ffcc00;
  color: #121212;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.alarm button:hover {
  background-color: #e0b800;
}

.repair-btn {
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
}

.repair-btn:hover {
  background-color: darkred;
}


</style>
