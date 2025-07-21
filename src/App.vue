<template>
  <router-view v-slot="{ Component, route }">
    <transition
      :enter-active-class="route.meta.enterActiveClass"
      :leave-active-class="route.meta.leaveActiveClass"
    >
      <keep-alive
        :include="routeStore.cachedViews"
        :max="Number.MAX_SAFE_INTEGER"
      >
        <component :is="replaceName(Component, route)" :key="route.path" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup>
import { useRouteStore } from "@/stores/routeStore";

const routeStore = useRouteStore();

function replaceName(component, route) {
  if (component) {
    component.type.__name = route.path;
    return component;
  }
}
</script>
