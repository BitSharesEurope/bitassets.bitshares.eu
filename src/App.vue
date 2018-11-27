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
     <LoadingIndicator v-if="loading" :size=16 :width=3 />
    </div>
   </div>
  </div>
  <div class="ui main container">
   <div class="ui grid">
    <div class="column">
     <div class="row">
      <sui-dropdown
       selection
       :options="dropdown_options"
       v-model="symbol"
       placeholder="Select BitAsset"
       id="symbol_dropdown"
       class="small"
       />
     </div>
     <div class="row">
      <CallPositions :symbol="symbol" v-on:loading="setLoading"/>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script>
import 'semantic-ui-css/semantic.min.css';
import CallPositions from './components/CallPositions'
import LoadingIndicator from './components/LoadingIndicator'

export default {
  name: 'App',
  components: {
    CallPositions,
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
      symbol: "USD",
      enabled_symbols: ["USD", "CNY", "EUR"]
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
 background-color: #FFFFFF;
}
.ui.menu .item img.logo {
 margin-right: 1.5em;
}
.main.container {
 margin-top: 7em;
 margin-bottom: 5em;
}
.ui.footer.segment {
 margin: 5em 0em 0em;
 padding: 5em 0em;
}
.header.branding img {
 height: 50px;
}
.ui.vertical.footer.segment {
 border: 0px;
}

/* Index
-------------------------------------------------- */
.headlogo {
 height: 40px;
}

.tiny.text {
   font-size: .8rem;
}

.mainlogo {
 margin-top: -80px;
}

.reglogo {
 height: 64px !important;
}
</style>
