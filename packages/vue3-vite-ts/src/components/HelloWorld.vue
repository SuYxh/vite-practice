<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios';

defineProps<{ msg: string }>()

const content = ref(0)

const getGushici = () => {
  axios.get('https://v2.jinrishici.com/one.json').then(res => {
    const { data } = res
    content.value = data.data.content
  }).catch(err => {
    console.log(err);
  })
}

onMounted(() => {
  getGushici()
})

</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <p>{{ content }}</p>

    <a-button type="primary" style="{ marginTop: '20px' }" @click="getGushici">更新</a-button>
  </div>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
