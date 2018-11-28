<template>
  <div :v-if="is_loaded()">
    <div class="ui icon warning message">
      <i class="exclamation icon"></i>
      <div class="content">
        <div class="header">
          The asset {{symbol}} is in Global Settlment
        </div>
        No open call positions exist, except for a settlement pool.
      </div>
    </div>
    <div class="ui two column stackable grid">
      <div class="column">
        <h4 class="ui header">
          <i class="bar chart icon"></i>
          <div class="content">
            Settlement Fund
            <div class="sub header">Collateral in the fund and outstanding supply</div>
          </div>
        </h4>
        <table class="ui compact selectable celled striped table">
          <tr>
            <td><strong>Settlement Funds</strong></td>
            <td>{{formatAmount(settlement_fund, this.collateral_asset.symbol)}}</td>
          </tr>
          <tr>
            <td><strong>Supply</strong></td>
            <td>{{formatAmount(supply, this.asset.symbol)}}</td>
          </tr>
          <tr>
            <td><strong>MCR</strong></td>
            <td>{{mcr}}%</td>
          </tr>
          <tr>
            <td><strong>Auto Revive Price</strong></td>
            <td>{{formatPrecision(settlementPrice * (mcr/100), 5)}} {{this.asset.symbol}}/{{this.collateral_asset.symbol}}
              <small>or</small>
                {{formatPrecision(1/settlementPrice / (mcr/100), 5)}} {{this.collateral_asset.symbol}}/{{this.asset.symbol}}
            </td>
          </tr>
        </table>
        <h4 class="ui header">
          <i class="line chart icon"></i>
          <div class="content">
            Settlement Prices
            <div class="sub header">Valuation of the settlement fund</div>
          </div>
        </h4>
        <div class="ui grid center aligned">
          <div class="ui small green statistic">
            <div class="value">{{formatPrecision(settlementPrice, 4)}} {{this.asset.symbol}}/{{this.collateral_asset.symbol}}</div>
            <div class="value">{{formatPrecision(1/settlementPrice, 4)}} {{this.collateral_asset.symbol}}/{{this.asset.symbol}}</div>
            <div class="label">Settlement Price</div>
          </div>
          <div class="ui divider"></div>
          <div class="ui small orange statistic">
            <div class="value">{{collateralValueation}}</div>
            <div class="label">Collateral valuation per {{asset.symbol}}</div>
          </div>
        </div>
      </div>
      <div class="column">
        <h4 class="ui header">
          <i class="hand paper outline icon"></i>
          <div class="content">
            Collateral Bids
            <div class="sub header">Existing bids for the collateral in the fund</div>
          </div>
        </h4>
        <table class="ui compact small stripped table">
          <thead>
            <tr>
              <th>Account #</th>
              <th>{{asset.symbol}}</th>
              <th>{{collateral_asset.symbol}}</th>
              <th>Bid Price</th>
              <th>Ratio</th>
            </tr>
          </thead>
          <template v-for="bid in collateral_bids">
            <tr :key="bid.id">
              <td>{{bid.bidder}}</td>
              <td>{{formatAmount(bid_debt(bid.inv_swan_price), asset.symbol)}}</td>
              <td>{{formatAmount(bid_collateral(bid.inv_swan_price), collateral_asset.symbol)}}</td>
              <td>{{bid_price(bid.inv_swan_price)}} {{asset.symbol}}/{{collateral_asset.symbol}}</td>
              <td>{{bid_ratio(bid.inv_swan_price)}}x</td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AssetSelected',
    props: [
      "asset",
      "collateral_asset",
      "ticker",
      "asset_bitasset_data",
      "asset_dynamic_data",
      "collateral_bids"
    ],
    computed: {
      settlement_fund() {
        return this.asset_bitasset_data.settlement_fund / 10 ** this.collateral_asset.precision
      },
      supply() {
        return this.asset_dynamic_data.current_supply / 10 ** this.asset.precision
      },
      settlementPrice() {
        if (!this.asset_bitasset_data) return
        if (!this.asset) return;
        if (!this.collateral_asset) return;
        let feed = this.asset_bitasset_data.settlement_price;
        return (feed.base.amount * 10 ** this.collateral_asset.precision) / (feed.quote.amount * 10 ** this.asset.precision);
      },
      mcr() {
        return this.asset_bitasset_data.current_feed.maintenance_collateral_ratio / 10
      },
      collateralValueation() {
        return (this.lastPrice() * this.settlement_fund / this.supply ).toFixed(5)
      }
    },
    methods: {
      is_loaded() {
        return (
          this.asset &&
          this.collateral_asset &&
          this.ticker &&
          this.asset_bitasset_data &&
          this.asset_dynamic_data &&
          this.collateral_bids
        );
      },
      bid_debt(p) {
        return (p.quote.amount / 10 ** this.asset.precision);
      },
      bid_collateral(p) {
        return (p.base.amount / 10 ** this.collateral_asset.precision);
      },
      bid_price(p) {
        return this.bid_debt(p) / this.bid_collateral(p)
      },
      bid_ratio(p) {
        return (this.lastPrice() * this.bid_collateral(p) / this.bid_debt(p) ).toFixed(2)
      },
      lastPrice() {
        if (!this.asset) return;
        if (!this.collateral_asset) return;
        if (!this.ticker) return;
        let price = parseFloat(this.ticker.latest);
        return price.toFixed(4)
      },
      formatAmount(value, currency) {
        var formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          //maximumFractionDigits: precision,
          minimumFractionDigits: 2
        });
        return formatter.format(value);
      },
      formatPrecision(value, precision) {
        return value.toFixed(precision)
      }
    },
  }
</script>

<style>
</style>
