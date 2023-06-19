<script setup lang="ts">
import { avatarName } from '@/tools/Comm';
defineProps<{
    name: string;
}>();
</script>

<template>
    <n-space align="center">
        <n-avatar round>
            {{ avatarName(name) }}
        </n-avatar>
        {{ name }}
    </n-space>
</template>
