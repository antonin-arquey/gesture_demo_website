import Vue from 'vue';
import 'bootstrap';

import ProbabilityChart from './components/ProbabilityChart.vue';
import ListGestures from './components/ListGestures.vue';
import Game from './components/Game.vue';

new Vue({ // eslint-disable-line no-new
  el: '#app',
  template: `
  <div class="container-fluid">
    <div class="row">
      <video id="video" class="col-md-4 col-sm-12"></video>
      <ProbabilityChart class="col-md-8 col-sm-12"></ProbabilityChart>
    </div>
    <ListGestures></ListGestures>
    <Game></Game>
  </div>
  `,
  components: {
    ProbabilityChart,
    ListGestures,
    Game,
  },
});
