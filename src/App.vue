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
    <div class="right menu">
     <div class="item">
      <div class="ui mini inline loader" :class="{'active': loading}"></div>
     </div>
    </div>
   </div>
  </div>
  <div class="ui main container">
   <div class="row">
    <p>
    All details are loaded directly from the Blockchain, no server sitting in
    between. Please select the bitAsset you want to look more details about.
    </p>
    <div class="ui form">
     <div class="field">
      <label>bitAsset:</label>
      <sui-dropdown
       selection
       :options="dropdown_options"
       v-model="symbol"
       placeholder="Select BitAsset"
       id="symbol_dropdown"
       class="small"
       />
     </div>
    </div>
   </div>
   <div class="ui horizontal divider"></div>
   <div class="row">
    <AssetSelected :symbol="symbol" v-on:loading="setLoading"/>
   </div>
  </div>
 </div>
</template>

<script>
import 'semantic-ui-css/semantic.min.css';
import AssetSelected from './components/AssetSelected'
import LoadingIndicator from './components/LoadingIndicator'

export default {
  name: 'App',
  components: {
    AssetSelected,
    LoadingIndicator,
  },
  computed: {
   dropdown_options() {
    return this.enabled_symbols.map(x => {return {text: x, value: x}})
   }
  },
  data () {
    return {
      loading: true,
      symbol: "",
      enabled_symbols: ["", "USD", "CNY", "EUR"]
    }
  },
  methods: {
    setLoading(loading) {
      this.loading = loading;
    }
  }
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
