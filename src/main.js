import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routes/router.js";
import { createPinia } from "pinia";

const app = createApp(App).use(createPinia()).use(router);
router.isReady().then(() => {
  app.mount("#app");
});
