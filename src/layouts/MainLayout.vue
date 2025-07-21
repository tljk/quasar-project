<template>
  <q-layout class="fixed-full">
    <slot name="header">
      <q-header bordered>
        <q-toolbar>
          <q-btn flat round icon="arrow_back" @click="back" />
          <q-toolbar-title> {{ props.title }} </q-toolbar-title>
          <q-space />
          <q-btn-dropdown
            flat
            round
            no-icon-animation
            dropdown-icon="more_vert"
          >
            <slot name="dropdown-content"></slot>
          </q-btn-dropdown>
        </q-toolbar>
      </q-header>
    </slot>

    <q-page-container class="full" v-if="$slots.default">
      <q-page class="full dark-mode scroll hide-scrollbar" :style-fn="styleFn">
        <slot> </slot>
      </q-page>
    </q-page-container>

    <q-page-container class="full" v-if="$slots.gesture">
      <q-page class="full dark-mode no-scroll" :style-fn="styleFn">
        <slot name="gesture"> </slot>
      </q-page>
    </q-page-container>

    <slot name="page"> </slot>

    <slot name="footer"> </slot>
  </q-layout>
</template>

<script setup>
const props = defineProps({
  title: String,
});
const offset = defineModel();

function back() {
  window.history.back();
}

function styleFn(offsetValue) {
  offset.value = offsetValue;
}
</script>
