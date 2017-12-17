<template lang="html">
<div class="probaChart">
  <ProbabilityBar
    v-for="(proba, index) in probabilityVolume"
    v-bind:key="index"
    v-bind:probability="proba"
    v-bind:name="gestureName[index]"
  />
  <button v-on:click="updateData()">Update data</button>
  <p>{{probabilityVolume[0]}}</p>
</div>
</template>

<script>

import Vue from 'vue';
import ProbabilityBar from './ProbabilityBar.vue';

export default {
  data() {
    return {
      gestureName: ['None', 'Fist', 'Stop', 'Catch', 'Thumb Up'],
      probabilityVolume: [0.55, 0.22, 0.33, 0.99, 0.2],
    };
  },
  methods: {
    updateData() {
      const self = this;
      this.probabilityVolume.forEach((elm, index) => {
        Vue.set(self.probabilityVolume, index, Number(Math.random().toFixed(2)));
      });
    },
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
