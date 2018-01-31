<template lang="html">
<div class="prediction">
  <div class="title">
    <h2>Gesture Prediction</h2>
  </div>
  <div class="probaChart d-flex flex-wrap">

    <ProbabilityBar
      v-for="(value, index) in probabilityVolume"
      v-bind:key="index"
      v-bind:probability="value.proba"
      v-bind:name="gestureName[index]"
      v-bind:style="{backgroundColor: value.bgColor}"
    />

  </div>
</div>
</template>

<script>

import Vue from 'vue';
import ProbabilityBar from './ProbabilityBar.vue';
import { init, predict } from '../js/conv';
import gestures from '../json/gestures.json';

export default {
  data() {
    return {
      gestureName: [],
      probabilityVolume: []
    };
  },
  methods: {
    update() {
      const probCalculated = predict();
      let max = 0;
      let index = -1;
      for(let i = 0; i < probCalculated.length; i++){
        if(probCalculated[i] > max){
          max = probCalculated[i];
          index = i;
        }
      }
      this.probabilityVolume.forEach((elm, index) => {
        Vue.set(this.probabilityVolume, index, {proba : Number(probCalculated[index].toFixed(2)),
                                                bgColor : '#7D8DD9'});
      });
      Vue.set(this.probabilityVolume, index, {proba : Number(probCalculated[index].toFixed(2)),
                                            bgColor : '#E79E47'});
    },
  },

  created() {
    Object.keys(gestures).forEach((elm) => {
      this.gestureName.push(elm);
      this.probabilityVolume.push(0);
    });
  },

  mounted() { // Wait till vue component is mounted
    init(() => { // initialization of the predict module
      window.setInterval(() => { // loop the update function every 10ms
        this.update();
      }, 1);
    });
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
  .prediction {
    background-color: rgb(170, 178, 216);
    padding: 2%;
    border-radius: 25px;
  }
</style>
