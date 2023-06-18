<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { NCard } from 'naive-ui';

const authStore = useAuthStore();
const payload = authStore.payload;
</script>

<template>
  <n-card title="Profile">
    Uid: {{ payload?.uid }} <br />
    Name: {{ payload?.name }}
  </n-card>
</template>

<style scoped></style>
