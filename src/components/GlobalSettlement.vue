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
    <div class="ui two column grid">
      <div class="column center aligned">
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
        <div class="ui small green statistic">
          <div class="value">{{formatPrecision(settlementPrice, 5)}} {{this.asset.symbol}}/{{this.collateral_asset.symbol}}</div>
          <div class="label">Settlement Price</div>
        </div>
        <div class="ui small green statistic">
          <div class="value">{{formatPrecision(1/settlementPrice, 5)}} {{this.collateral_asset.symbol}}/{{this.asset.symbol}}</div>
          <div class="label">Settlement Price (Inv.)</div>
        </div>
      </div>
      <div class="column">
        <table class="ui compact small stripped table">
          <thead>
            <tr>
              <th>Account #</th>
              <th>{{asset.symbol}}</th>
              <th>{{collateral_asset.symbol}}</th>
              <th>Bid Price</th>
            </tr>
          </thead>
          <template v-for="bid in collateral_bids">
            <tr :key="bid.id">
              <td>{{bid.bidder}}</td>
              <td>{{formatAmount(bid_debt(bid.inv_swan_price), asset.symbol)}}</td>
              <td>{{formatAmount(bid_collateral(bid.inv_swan_price), collateral_asset.symbol)}}</td>
              <td>{{bid_price(bid.inv_swan_price)}} {{asset.symbol}}/{{collateral_asset.symbol}}</td>
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
        var formatter = new Intl.NumberFormat('en-US', {
          maximumFractionDigits: precision,
          minimumFractionDigits: 2
        });
        return formatter.format(value);
      }
    },
  }
</script>

<style>
</style>
