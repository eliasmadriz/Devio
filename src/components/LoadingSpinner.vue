<template>
  <div :class="{dark: variant === 'dark'}" class="loading spinner" key="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
</template>

<script>
  export default {
    props: ['variant']
  }
</script>

<style>
    /* Loading animation */
  .spinner {
    text-align: center;
    --spinner-ball-size: 8px;
    --spinner-ball-color: rgba(255,255,255, .8);
  }

  .spinner.dark > div {
    --spinner-ball-color: rgba(0,0,0,.2);
  }

  .spinner > div {
    width: var(--spinner-ball-size);
    height: var(--spinner-ball-size);
    background-color: var(--spinner-ball-color);
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  .spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  .spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }

  @-webkit-keyframes sk-bouncedelay {
    0%, 80%, 100% { -webkit-transform: scale(0) }
    40% { -webkit-transform: scale(1.0) }
  }

  @keyframes sk-bouncedelay {
    0%, 80%, 100% { 
      -webkit-transform: scale(0);
      transform: scale(0);
    } 40% { 
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }
</style>

