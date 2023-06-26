<script setup lang="ts">
import type { BlogResponse } from '@/api';
import { textLimt } from '@/tools/Comm';
import { MdPreview } from 'md-editor-v3';
import { useThemeStore } from '@/stores/ThemeStore';

defineProps<{
    data: BlogResponse;
}>();
</script>

<template>
    <n-card>
        <n-space justify="space-between">
            <div>
                <slot name="header"></slot>
                <n-time :time="data.cdt" time-zone="UTC" />
            </div>
            <div>
                <slot name="header-extra"></slot>
            </div>
        </n-space>
        <n-divider />
        <router-link :to="`/blog/${data.id}`">
            <n-h1>
                <n-text underline>
                    {{ data.title }}
                </n-text>
            </n-h1>
        </router-link>
        <MdPreview
            editor-id="preview-only"
            :theme="useThemeStore().theme"
            :model-value="textLimt(data.content, 200)"
        />
    </n-card>
</template>

<style scoped>
a {
    text-decoration: none;
}
</style>
