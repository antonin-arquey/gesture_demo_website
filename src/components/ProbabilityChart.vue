<template lang="html">
<div class="probaChart">
  <p>{{gestureNameMax}}</p>
  <p>{{probabilityMax}}</p>
  <button class="btn btn-primary" v-on:click="updateData()">Update data</button>
  <ProbabilityBar
    v-for="(proba, index) in probabilityVolume"
    v-bind:key="index"
    v-bind:probability="proba"
    v-bind:name="gestureName[index]"
  />
  
</div>
</template>

<script>

import Vue from 'vue';
import ProbabilityBar from './ProbabilityBar.vue';
import conv from '../js/conv';

function argmax(arr) {
  let maxVal = -1;
  let indexMax = 0;
  for(let i = 0; i < arr.length; i++){
    if(arr[i] > maxVal){
      maxVal = arr[i];
      indexMax = i;
    }
  }
  return indexMax;
}

export default {
  data() {
    return {
      gestureName: ['None', 'fist', 'thumb up', 'thumb down', 'stop', 'catch', 'swing', 'phone', 'victory', 'C', 'okay', '2 fingers', '2 fingers horiz', 'rock&roll', 'rock&roll horiz'],
      probabilityVolume: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      probabilityMax: 0,
      gestureNameMax: 'None'
    };
  },
  methods: {
    updateData() {
      const probCalculated = conv();
      this.probabilityVolume.forEach((elm, index) => {
        Vue.set(this.probabilityVolume, index, Number(probCalculated[index].toFixed(2)));
      });
      this.probabilityMax = Math.max(...probCalculated);
      this.gestureNameMax = this.gestureName[argmax(probCalculated)];
    },
  },
  created() {
    window.setInterval(() => {
      this.updateData();
    }, 1);
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
