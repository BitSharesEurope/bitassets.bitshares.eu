<template>
 <div>
  <h4 class="ui header">
   <i class="bar chart icon"></i>
   <div class="content">
    Asset Details
    <div class="sub header">Collateralization, Supply, Pricing</div>
   </div>
  </h4>
  <table class="ui compact selectable celled striped table">
   <template v-for="(item, index) in mainitems">
    <tr :key="index">
     <td><strong>{{item.name}}</strong></td>
     <td :key="item.name">{{ item.value }}</td>
    </tr>
   </template>
  </table>
  <div class="ui grid">
   <div class="column">
    <h4 class="ui header">
     <i class="line chart icon"></i>
     <div class="content">
      Total
      <div class="sub header">Total Collateralization of {{symbol}}</div>
     </div>
    </h4>
    <div class="ui grid row center aligned">
     <div class="ui green statistic">
      <div class="value">{{this.averageRatio}}</div>
      <div class="label">Overall Backing Ratio</div>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script>
  export default {
    name: 'CallPositionsOverview',
    props: ["callPositions", "asset", "collateral_asset", "ticker", "settlementPrice"],
    methods: {
      formatPrice(value, precision, currency) {
        if (!currency) return
        return value.toFixed(precision) + " " + currency;
      }
    },
    computed: {
      symbol() {
        return this.asset.symbol
      },
      mainitems () {
        return [{
          name: "Collateral",
          value: this.totalCollateral
        },{
          name: "Debt",
          value: this.totalDebt
        },{
          name: "Number positions",
          value: this.numberPositions
        },{
          name: "Last Price",
          value: this.lastPrice
        }, {
          name: "Settlement Price",
          value: this.formatSettlementPrice
        }];
      },
      totalCollateral() {
        if (!this.collateral_asset) return;
        if (!this.callPositions) return;
        let value = this.callPositions.reduce(
          (state, x) => state + parseFloat(x.collateral), 0.0)
          / (10 ** this.collateral_asset.precision);
          return this.formatPrice(value, this.collateral_asset.precision, this.collateral_asset.symbol)
      },
      totalDebt() {
        if (!this.asset) return;
        if (!this.callPositions) return;
        let value = this.callPositions.reduce(
          (state, x) => state + parseFloat(x.debt), 0.0)
          / (10 ** this.asset.precision);
        return this.formatPrice(value, this.asset.precision, this.asset.symbol)
      },
      averageRatio() {
        if (!this.asset) return;
        if (!this.callPositions) return;
        if (!this.collateral_asset) return;
        let price = parseFloat(this.settlementPrice);
        let debt = this.callPositions.reduce(
          (state, x) => state + parseFloat(x.debt), 0.0)
          / (10 ** this.asset.precision);
        let collateral = this.callPositions.reduce(
          (state, x) => state + parseFloat(x.collateral), 0.0)
          / (10 ** this.collateral_asset.precision);
        let value = collateral * price / debt;
        return value.toFixed(4) + "x";
      },
      numberPositions() {
        if (!this.collateral_asset) return;
        return this.callPositions.length;
      },
      formatSettlementPrice() {
        if (!this.asset) return;
        if (!this.collateral_asset) return;
        let price = this.settlementPrice;
        return price.toFixed(4) + " " + this.asset.symbol + "/" + this.collateral_asset.symbol;
      },
      lastPrice() {
        if (!this.asset) return;
        if (!this.collateral_asset) return;
        if (!this.ticker) return;
        let price = parseFloat(this.ticker.latest);
        return price.toFixed(4) + " " + this.asset.symbol + "/" + this.collateral_asset.symbol;
      }
    }
  }
</script>

<style>
</style>
