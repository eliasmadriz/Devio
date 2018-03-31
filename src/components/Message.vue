<template>
  <div class="message" 
    v-if="(config.show && config.type === type) || config.permanent"
    :class="{'danger': config.variant === 'danger', 'info': config.variant === 'info'}">
    {{ config.text }}
    <slot></slot>
    <button class="close-button" v-if="!config.permanent" @click="config.show = false">×</button>
  </div>
</template>

<script>
  export default {
    props: ['config', 'type']
  }
</script>

<style scoped>
  .message {
    background-color: white;
    border: 1px solid black;
    border-radius: 4px;
    padding: .75em 3rem .75rem 1rem;
    overflow: hidden;
    position: relative;
    text-align: left;
    width: 100%;
  }

  .close-button {
    color: darkslategray;
    height: 100%;    
    font-size: 1.6rem;
    font-weight: bold;
    line-height: 100%;
    opacity: .5;
    position: absolute;
    right: 0;
    top: 0;
    width: 3rem;
    text-shadow: 0 1px 0 white;
  }

  .close-button:hover {
    opacity: 1;
  }

  .danger {    
    background-color: #f4c5c5;
    border-color: #f7b4b4;
    color: brown;
  }

  .info {
    background: #cce8f2;
    border-color: #afcfdb;
    color: #226174;
  }
</style>
