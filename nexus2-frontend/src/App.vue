<template>
  <div id="app">
    <!-- Aquí se mostrarán las diferentes vistas -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 20px;
}
</style>
