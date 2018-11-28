<template>
 <div>
  <div class="row">
   <div v-if="load_reg">
    <CallPositions 
        :asset="asset"
        :collateral_asset="collateral_asset"
        :callPositions="callPositions"
        :ticker="ticker"
        :asset_bitasset_data="asset_bitasset_data"
        />
   </div>
   <div v-if="load_gs">
    <GlobalSettlement
     :asset="asset"
     :collateral_asset="collateral_asset"
     :ticker="ticker"
     :asset_dynamic_data="asset_dynamic_data"
     :asset_bitasset_data="asset_bitasset_data"
     :collateral_bids="collateral_bids"
     />
   </div>
  </div>
 </div>
</template>

<script>
  import BitSharesConnect from './BitSharesConnect'
  import CallPositions from './CallPositions'
  import GlobalSettlement from './GlobalSettlement'

  export default {
    name: 'Asset',
    props: ["symbol"],
    extends: BitSharesConnect,
    components: {
      CallPositions,
        GlobalSettlement
    },
    data() {
      return {
        callPositions: [],
        ticker: {},
        asset_id: "1.3.121",
        asset: {},
        collateral_asset_id: {},
        collateral_asset: {},
        asset_bitasset_data: {},
        asset_dynamic_data: {},
        collateral_bids: [],
        no_gs: null,
      }
    },
    computed: {
      load_gs() {
        return (this.no_gs === false && this.is_loaded())
      },
      load_reg() {
        return (this.no_gs === true && this.is_loaded())
      }
    },
    watch: { 
      symbol: function(newVal, oldVal) { // watch it
        this.$emit('loading', true);
        this.reset();
        this.getAssets();
      }
    },
    methods: {
      reset() {
          this.asset = null
          this.collateral_asset = null
          this.ticker = null
          this.asset_bitasset_data = null
          this.collateral_bids = []
      },
      onConnected() {
        this.getAssets();
      },
      async getAssets() {
        let o = await this.chain.getAssetFromSymbols([this.symbol])
          .catch((err) => { console.log(err); });
        o = o[0];
        this.asset = o;
        this.asset_id = o.id;
        this.getAdditioanlData();
        this.finish_loading();
      },
      async getAdditioanlData() {
        if (!this.asset) return;

        let c = await this.chain.getObjects([this.asset.bitasset_data_id, this.asset.dynamic_asset_data_id])
          .catch(o => console.error(o));
        this.asset_bitasset_data = c[0];
        this.asset_dynamic_data = c[1];

        this.no_gs = !(this.asset_bitasset_data.settlement_fund)
        if (!this.no_gs) {
          this.loadCollateralBids()
          console.log("In GS, loaded collateral bids")
        }
        this.collateral_asset_id = c[0].options.short_backing_asset;
        let d = await this.chain.getObjects([this.collateral_asset_id])
          .catch(o => console.error(o));
        this.collateral_asset = d[0];
        this.getCallPositions();
        this.getTicker();
        this.finish_loading();
      },
      async loadCollateralBids() {
        if (!this.asset_id) return;
        this.collateral_bids = await this.chain.getCollateralBids(this.asset_id)
          .catch(o => console.error(o));
        this.finish_loading();
      },
      async getCallPositions() {
        if (!this.asset_id) return;

        this.callPositions = await this.chain.getCallOrders(this.asset_id)
          .catch(o => console.error(o));
        this.finish_loading();
      },
      async getTicker() {
        if (!this.asset_id) return;
        if (!this.collateral_asset_id) return;
        this.ticker = await this.chain.getTicker(
          this.asset_id,
          this.collateral_asset_id
        )
          .catch(o => console.error(o));
        this.finish_loading();
      },
      is_loaded() {
        return (
          this.asset &&
          this.collateral_asset &&
          this.ticker &&
          this.asset_bitasset_data &&
          (!this.no_gs || this.collateral_bids)
        );
      },
      finish_loading() {
        if (this.is_loaded())
          this.$emit('loading', false);
      },
    }
  }
</script>

<style>
</style>
