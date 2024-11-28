<template>
  <div class="home">
    <h1>Bienvenido a la aplicación</h1>
    <div>
      <button @click="goToResidentLogin">Iniciar sesión como Residente</button>
      <button @click="goToAdminLogin">Iniciar sesión como Administrador</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    goToResidentLogin() {
      this.$router.push({ name: "ResidentLogin" });
    },
    goToAdminLogin() {
      this.$router.push({ name: "AdminLogin" });
    },
  },
};
</script>

<style>
.home {
  text-align: center;
  margin-top: 20px;
}
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
