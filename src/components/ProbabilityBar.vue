<template lang="html">
  <div class="proba-bar">
    <span class="name">{{name}}</span>
    <div class="progress">
      <div class="progress-bar" role="progressbar" v-bind:style="'width:'+ probability*100 + '%'"
      v-bind:aria-valuenow="probability" aria-valuemin="0" aria-valuemax="1">
        {{ probability }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    probability: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      required: true,
    }
  },
};
</script>

<style lang="scss" scoped>
  .proba-bar {
    margin-bottom: 10px;
  }
</style>
