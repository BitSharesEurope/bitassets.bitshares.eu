<template>
 <div v-if="is_loaded()">
  <div class="ui two column grid">
   <div class="column">
    <CallPositionsOverview
     :callPositions="callPositions"
     :asset="asset"
     :collateral_asset="collateral_asset"
     :ticker="ticker"
     :settlementPrice=settlementPrice
     />
   </div>
   <div class="column">
    <sui-tab>
     <sui-tab-pane title="# vs. ratio">
      <CallPositionsChartRatios
       :callPositions="callPositions"
       :asset="asset"
       :collateral_asset="collateral_asset"
       :settlementPrice=settlementPrice
       />
     </sui-tab-pane>
     <sui-tab-pane title="Amount vs. ratio">
      <CallPositionsChartRatioVsAmount
       :callPositions="callPositions"
       :asset="asset"
       :collateral_asset="collateral_asset"
       :settlementPrice=settlementPrice
       />
     </sui-tab-pane>
     <sui-tab-pane title="CDF">
      <CallPositionsChartRatioVsAmountCDF
       :callPositions="callPositions"
       :asset="asset"
       :collateral_asset="collateral_asset"
       :settlementPrice=settlementPrice
       />
     </sui-tab-pane>
    </sui-tab>
   </div>
  </div>
 </div>
</template>

<script>
  import CallPositionsOverview from './CallPositionsOverview'
  import CallPositionsChartRatioVsAmount from './CallPositionsChartRatioVsAmount'
  import CallPositionsChartRatioVsAmountCDF from './CallPositionsChartRatioVsAmountCDF'
  import CallPositionsChartRatios from './CallPositionsChartRatios'
  import histogram from '../histogram'

  export default {
    name: 'Backing',
    props: [
     "asset",
     "collateral_asset",
     "callPositions",
     "ticker",
     "asset_bitasset_data",
    ],
    components: {
      CallPositionsChartRatioVsAmount,
      CallPositionsChartRatios,
      CallPositionsOverview,
      CallPositionsChartRatioVsAmountCDF
    },
    data () {
      return {
        chart_amount_vs_ratio: null,
        chart_amount_vs_ratio_labels: null,
        chart_amount_vs_ratio_cdf: null,
        chart_amount_vs_ratio_cdf_labels: null,
      };
    },
    computed: {
      symbol() {
       return this.asset.symbol;
      },
      settlementPrice() {
        if (!this.asset_bitasset_data) return
        if (!this.asset) return;
        if (!this.collateral_asset) return;
        let feed = this.asset_bitasset_data.current_feed.settlement_price;
        return (feed.base.amount * 10 ** this.collateral_asset.precision) / (feed.quote.amount * 10 ** this.asset.precision);
      },
    },
    methods: {
      is_loaded() {
        return (
          this.asset &&
          this.collateral_asset &&
          this.ticker &&
          this.asset_bitasset_data
        );
      },
    }
  }
</script>

<style>
</style>
