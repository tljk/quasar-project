<template>
  <MainLayout>
    <template #header>
      <q-header v-model="header" bordered>
        <q-toolbar>
          <q-btn class="bg-white" size="sm" flat round>
            <q-avatar size="sm">
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
            </q-avatar>
          </q-btn>
          <q-toolbar-title> Home </q-toolbar-title>
          <q-space />
          <q-btn flat round icon="search" />
        </q-toolbar>
      </q-header>
    </template>
    <template #page>
      <q-page-container>
        <q-tab-panels class="dark-mode" v-model="tab" animated keep-alive>
          <q-tab-panel name="home" class="no-padding no-scroll">
            <HomeTab />
          </q-tab-panel>
          <q-tab-panel name="message" class="no-padding no-scroll">
            <MessageTab />
          </q-tab-panel>
          <q-tab-panel name="user" class="no-padding no-scroll">
            <UserTab />
          </q-tab-panel>
        </q-tab-panels>
      </q-page-container>
    </template>
    <template #footer>
      <q-footer v-model="footer" bordered>
        <q-tabs v-model="tab" align="justify" narrow-indicator>
          <q-tab name="home" icon="home" />
          <q-tab name="message" icon="message" />
          <q-tab name="user" icon="settings" />
        </q-tabs>
      </q-footer>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref } from "vue";
import MainLayout from "@/layouts/MainLayout.vue";
import HomeTab from "@/components/HomeTab.vue";
import MessageTab from "@/components/MessageTab.vue";
import UserTab from "@/components/UserTab.vue";

const tab = ref("home");
const header = ref(true);
const footer = ref(true);
</script>
