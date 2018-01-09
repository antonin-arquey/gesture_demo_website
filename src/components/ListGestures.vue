<template lang="html">
  <div class="main">
    <h2>Liste des gestes reconnus</h2>
    <div class="row">
      <div class="col-md-2 gesture-picture"
        v-for="(name, index) in Object.keys(gesturesName)"
        v-bind:key="index" v-if="name !== ''">

        <img v-bind:src="'/assets/'+gesturesName[name]" v-bind:alt="name">
        <p>{{name}}</p>
      </div>
    </div>
  </div>

</template>

<script>

import gestures from '../json/gestures.json';

export default {
  data() {
    return {
      gesturesName: gestures,
      picturePath: require.context('../img/', true, /\.(png|jpe?g|gif|svg)(\?.*)?$/),
    };
  },
  created() {
    delete this.gesturesName.None;
  },
};
</script>

<style lang="scss" scoped>
  .main{
    margin-top: 30px;
  }
  .row {
    margin-top: 30px;
  }
  .gesture-picture {
    margin-bottom: 40px;
    margin-right: 10px;

    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
</style>
