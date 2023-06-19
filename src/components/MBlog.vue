<script setup lang="ts">
import type { BlogResponse } from '@/api';
import { textLimt } from '@/tools/Comm';
import dateFormat from 'dateformat';
import { MdPreview } from 'md-editor-v3';

defineProps<{
    data: BlogResponse;
}>();
</script>

<template>
    <n-card>
        <n-space justify="space-between">
            <div>
                <slot name="header"></slot>
                {{ dateFormat(data.cdt, 'fullDate') }}
            </div>
            <div>
                <slot name="header-extra"></slot>
            </div>
        </n-space>
        <n-divider />
        <router-link :to="`/blog/${data.id}`">
            <h1>{{ data.title }}</h1>
            <MdPreview editor-id="preview-only" :model-value="textLimt(data.content, 200)" />
        </router-link>
    </n-card>
</template>

<style scoped>
a {
    color: #000;
    text-decoration: none;
}
</style>
