<template lang="html">
<div >
  <h2>Prédiction du geste</h2>
  <div class="probaChart d-flex flex-wrap">

    <ProbabilityBar
      v-for="(proba, index) in probabilityVolume"
      v-bind:key="index"
      v-bind:probability="proba"
      v-bind:name="gestureName[index]"
    />

  </div>
</div>
</template>

<script>

import Vue from 'vue';
import ProbabilityBar from './ProbabilityBar.vue';
import { init, predict } from '../js/conv';

export default {
  data() {
    return {
      gestureName: ['None', 'fist', 'thumb up', 'thumb down', 'stop', 'catch', 'swing', 'phone', 'victory', 'C', 'okay', '2 fingers', '2 fingers horiz', 'rock&roll', 'rock&roll horiz'],
      probabilityVolume: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
  },
  methods: {
    update() {
      const probCalculated = predict();
      this.probabilityVolume.forEach((elm, index) => {
        Vue.set(this.probabilityVolume, index, Number(probCalculated[index].toFixed(2)));
      });
    },
  },
  mounted() { // Wait till vue component is mounted
    init(); // initialization of the predict module
    window.setInterval(() => {
      this.update();
    }, 10);
  },
  components: {
    ProbabilityBar,
  },
};
</script>

<style lang="scss" scoped>
  .probaChart {
    padding: 20px 20px 20px 20px;
  }
</style>
