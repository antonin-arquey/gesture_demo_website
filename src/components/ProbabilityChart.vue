<template lang="html">
<div class="probaChart">
  <ProbabilityBar
    v-for="(proba, index) in probabilityVolume"
    v-bind:key="index"
    v-bind:probability="proba"
    v-bind:name="gestureName[index]"
  />
  <button class="btn btn-primary" v-on:click="updateData()">Update data</button>
  <p>{{probabilityVolume[0]}}</p>
</div>
</template>

<script>

import Vue from 'vue';
import ProbabilityBar from './ProbabilityBar.vue';
import conv from '../js/conv';

export default {
  data() {
    return {
      gestureName: ['None', 'Fist', 'Stop', 'Catch', 'Thumb Up', 'Thumb down'],
      probabilityVolume: [0, 0, 0, 0, 0, 0],
    };
  },
  methods: {
    updateData() {
      const probCalculated = conv();
      this.probabilityVolume.forEach((elm, index) => {
        Vue.set(this.probabilityVolume, index, Number(probCalculated[index].toFixed(2)));
      });
    },
  },
  created() {
    /*window.setInterval(() => {
      // this.updateData();
    }, 1000);*/
  },
  components: {
    ProbabilityBar,
  },
};
</script>

<style lang="scss" scoped>
  .probaChart {
    width: 300px;
    height: 300px;
    padding: 20px 20px 20px 20px;
  }
</style>
