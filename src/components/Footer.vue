<template>
  <footer class="container-fluid footer">
    <div class="container">
      &copy; Devio 2017 - 2018
      
      <router-link to="/credits">Créditos</router-link>
    </div>
  </footer>
</template>

<style scoped>
  .footer {
    background-color: var(--neutral);
    bottom: 0;
    color: var(--dark);
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    padding: .5rem;
    position: absolute;
    width: 100%
  }
  
  .footer .container {
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
  }
</style>