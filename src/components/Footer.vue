<template>
  <footer class="container-fluid footer">
    <div class="container">
      &copy; Devio 2017
      
      <a href="/credits">Credits</a>
    </div>
  </footer>
</template>

<style scoped>
  .footer {
    background-color: var(--neutral);
    bottom: 0;
    color: var(--secondary);
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-top: 2rem;
    padding-top: .5rem;
    padding-bottom: .5rem;
    position: absolute;
  }
  
  .footer .container {
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
  }
</style>