
<script setup>
import { ref, onMounted } from 'vue'
import { VueFlow } from '@vue-flow/core'

const elements = ref([
  {
    id: '1',
    position: { x: 50, y: 50 },
    label: 'Node 1',
  }
]);

onMounted(() => {
  elements.value.push({
    id: '2',
    label: 'Node 2',
    position: { x: 150, y: 50 },
  })
})
</script>

<template>
  <VueFlow v-model="elements"/>
</template>