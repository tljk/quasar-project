<template>
  <PanContainer class="half-screen">
    <PanContainer vertical class="half-screen">
      <q-page class="half-screen bg-red">0-0</q-page>
      <q-page class="half-screen bg-blue">0-1</q-page>
      <q-page class="half-screen bg-green">0-2</q-page>
      <q-page class="half-screen bg-yellow">0-3</q-page>
      <q-page class="half-screen bg-grey">0-4</q-page>
    </PanContainer>
    <PanContainer vertical class="half-screen">
      <q-page class="half-screen bg-red">1-0</q-page>
      <q-page class="half-screen bg-blue">1-1</q-page>
      <q-page class="half-screen bg-green">1-2</q-page>
      <q-page class="half-screen bg-yellow">1-3</q-page>
      <q-page class="half-screen bg-grey">1-4</q-page>
    </PanContainer>
    <PanContainer vertical class="half-screen">
      <q-page class="half-screen bg-red">2-0</q-page>
      <q-page class="half-screen bg-blue">2-1</q-page>
      <q-page class="half-screen bg-green">2-2</q-page>
      <q-page class="half-screen bg-yellow">2-3</q-page>
      <q-page class="half-screen bg-grey">2-4</q-page>
    </PanContainer>
    <PanContainer vertical class="half-screen">
      <q-page class="half-screen bg-red">3-0</q-page>
      <q-page class="half-screen bg-blue">3-1</q-page>
      <q-page class="half-screen bg-green">3-2</q-page>
      <q-page class="half-screen bg-yellow">3-3</q-page>
      <q-page class="half-screen bg-grey">3-4</q-page>
    </PanContainer>
    <PanContainer vertical class="half-screen">
      <q-page class="half-screen bg-red">4-0</q-page>
      <q-page class="half-screen bg-blue">4-1</q-page>
      <q-page class="half-screen bg-green">4-2</q-page>
      <q-page class="half-screen bg-yellow">4-3</q-page>
      <q-page class="half-screen bg-grey">4-4</q-page>
    </PanContainer>
  </PanContainer>
  <q-btn label="detail" to="/detail"></q-btn>
</template>

<script setup>
import PanContainer from "src/components/PanContainer.vue";
</script>

<style lang="scss" scoped>
.half-screen {
  width: 50vw;
  height: 50vh;
  min-height: unset !important;
}
</style>
