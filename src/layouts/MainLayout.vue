<template>
  <q-layout class="window-height window-width overflow-hidden">
    <q-page-container class="full">
      <q-page class="full">
        <q-tab-panels v-model="tab" animated keep-alive class="full">
          <q-tab-panel name="home" class="full no-padding no-scroll">
            <HomeTab />
          </q-tab-panel>
          <q-tab-panel name="message" class="full no-padding no-scroll">
            <MessageTab />
          </q-tab-panel>
          <q-tab-panel name="user" class="full no-padding no-scroll">
            <UserTab />
          </q-tab-panel>
        </q-tab-panels>
      </q-page>
    </q-page-container>
    <q-footer>
      <q-tabs v-model="tab" align="justify" narrow-indicator>
        <q-tab name="home" icon="home" />
        <q-tab name="message" icon="message" />
        <q-tab name="user" icon="settings" />
      </q-tabs>
    </q-footer>
  </q-layout>
  <q-layout class="fixed overflow-hidden z-max">
    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <transition
          mode="in-out"
          :enter-active-class="route.meta.enterActiveClass"
          :leave-active-class="route.meta.leaveActiveClass"
        >
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import HomeTab from "src/components/HomeTab.vue";
import MessageTab from "src/components/MessageTab.vue";
import UserTab from "src/components/UserTab.vue";

const tab = ref("home");
</script>
