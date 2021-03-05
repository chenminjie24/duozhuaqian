import Vue from 'vue'
import Tabs from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './components/App.vue';

Vue.use(Tabs);
new Vue({
    render: h => h(App)
}).$mount("#app")
