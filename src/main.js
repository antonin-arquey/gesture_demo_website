import Vue from 'vue';
import 'bootstrap';

import ProbabilityChart from './components/ProbabilityChart.vue';

new Vue({ // eslint-disable-line no-new
  el: '#app',
  template: `
  <div class="container-fluid">
    <div class="row">
      <video id="video" class="col-md-4 col-sm-12"></video>
      <ProbabilityChart class="col-md-8 col-sm-12"></ProbabilityChart>
    </div>
  </div>
  `,
  components: {
    ProbabilityChart,
  },
});
