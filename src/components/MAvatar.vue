<script setup lang="ts">
import { avatarName } from '@/tools/Comm';
defineProps<{
    vertical?: boolean;
    showTitile?: boolean;
    uid?: number;
    name?: string;
}>();
</script>

<template>
    <n-space :vertical="vertical" align="center">
        <n-avatar round>
            {{ avatarName(name || '?') }}
        </n-avatar>
        <div v-if="!showTitile">
            <n-text strong> {{ name }} </n-text>
        </div>
        <div v-if="showTitile">{{ uid ? 'UID' + ': ' : '' }} {{ uid }}</div>
        <div v-if="showTitile">
            {{ name ? $t('common.name') + ': ' + name : '' }}
        </div>
    </n-space>
</template>
