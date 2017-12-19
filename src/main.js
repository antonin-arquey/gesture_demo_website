import Vue from 'vue';
import 'bootstrap';

import ProbabilityChart from './components/ProbabilityChart.vue';

new Vue({ // eslint-disable-line no-new
  el: '#app',
  template: '<ProbabilityChart></ProbabilityChart>',
  components: {
    ProbabilityChart,
  },
});
