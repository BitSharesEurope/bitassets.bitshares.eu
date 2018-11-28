<template>
 <div>
  <div class="ui menu">
   <div class="ui container">
    <a href="/" class="header">
     <img class="headlogo" alt="logo" src="https://bitshares.eu/static/img/logo.png" />
    </a>
    <div class="menu">
     <div class="item">
      <strong>bitAsset</strong>
      <span class="font-weight-light">BACKING</span>
     </div>
    </div>
   </div>
  </div>
  <div class="ui main container">
   <router-view></router-view>
  </div>
 </div>
</template>

<script>
import 'semantic-ui-css/semantic.min.css';

export default {
  name: 'App',
  components: {},
}
</script>

<style>
body {
 background-color: #fafafa;
}
.ui.menu .item img.logo {
 margin-right: 1.5em;
}
.main.container {
 margin-top: 2em;
}
.headlogo {
 height: 40px;
}
</style>
