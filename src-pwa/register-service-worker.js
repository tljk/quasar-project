import { register } from "register-service-worker";
import { useAppStore } from "src/stores/appStore";

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready(/* registration */) {
    const appStore = useAppStore();
    appStore.setServiceWorker("ready", "true");
  },

  registered(/* registration */) {
    const appStore = useAppStore();
    appStore.setServiceWorker("registered", "true");
  },

  cached(/* registration */) {
    const appStore = useAppStore();
    appStore.setServiceWorker("cached", "true");
  },

  updatefound(/* registration */) {
    const appStore = useAppStore();
    appStore.setServiceWorker("updatefound", "true");
  },

  updated(/* registration */) {
    const appStore = useAppStore();
    appStore.setServiceWorker("updated", "true");
  },

  offline() {
    const appStore = useAppStore();
    appStore.setServiceWorker("offline", "true");
  },

  error(/* err */) {
    const appStore = useAppStore();
    appStore.setServiceWorker("error", err);
  },
});
