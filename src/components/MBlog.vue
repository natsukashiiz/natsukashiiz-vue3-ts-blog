<script setup lang="ts">
import type { BlogResponse } from '@/api';
import { textLimt } from '@/tools/Comm';
import { MdPreview } from 'md-editor-v3';
import { useThemeStore } from '@/stores/ThemeStore';
import { BookmarkOutline as BookmarkIcon, Bookmark as BookmarkActiveIcon } from '@vicons/ionicons5';
import { add, remove } from '@/api/bookmark';
import { useMessage } from 'naive-ui';
import { useAuthStore } from '@/stores/AuthStore';

defineProps<{
    data: BlogResponse;
}>();

const authStore = useAuthStore();
const message = useMessage();

// function
async function hanndleAddBookmark(blogId: number) {
    add({ blogId });
    message.success('Added bookmark');
}

async function hanndleRemoveBookmark(blogId: number) {
    remove(blogId);
    message.success('Removed bookmark');
}
</script>

<template>
    <n-card>
        <n-space justify="space-between">
            <div>
                <slot name="header"></slot>
                <n-time :time="new Date(data.cdt)" format="MMM dd, yyyy" />
            </div>
            <div>
                <slot name="header-extra"></slot>
            </div>
        </n-space>
        <n-divider />
        <n-space justify="end">
            <n-tag strong bordered type="info">
                {{ data.category.toUpperCase() }}
            </n-tag>
            <n-button
                v-if="authStore.isAuthenticated()"
                size="small"
                @click="hanndleAddBookmark(data.id)"
            >
                <template #icon>
                    <n-icon><BookmarkIcon /></n-icon>
                </template>
            </n-button>
            <n-button
                v-if="authStore.isAuthenticated()"
                size="small"
                color="#ff69b4"
                @click="hanndleRemoveBookmark(data.id)"
            >
                <template #icon>
                    <n-icon><BookmarkActiveIcon /></n-icon>
                </template>
            </n-button>
        </n-space>
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
