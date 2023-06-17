<script setup lang="ts">
import { useAuthStore } from "@/stores/AuthStore";

const authStore = useAuthStore();
const payload = authStore.payload;
</script>

<template>
<h1>Profile</h1>
  <hr>
  {{
  JSON.stringify(payload, null, 2)
  }}
</template>

<style scoped>

</style>