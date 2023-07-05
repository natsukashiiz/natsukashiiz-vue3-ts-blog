<script setup lang="ts">
import type { BlogResponse } from '@/api';
import { textLimt } from '@/tools/Comm';
import { MdPreview } from 'md-editor-v3';
import { useThemeStore } from '@/stores/ThemeStore';
import { BookmarkOutline as BookmarkIcon, Bookmark as BookmarkActiveIcon } from '@vicons/ionicons5';
import { add, remove } from '@/api/bookmark';
import { useMessage } from 'naive-ui';
import { useAuthStore } from '@/stores/AuthStore';
import { colorFormText } from '@/tools/Comm';

defineProps<{
    data: BlogResponse;
}>();

const authStore = useAuthStore();
const message = useMessage();

// function
async function handleAddBookmark(blogId: number) {
    add({ blogId });
    message.success('Added bookmark');
}

async function handleRemoveBookmark(blogId: number) {
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
        <n-space justify="end" v-if="authStore.isAuthenticated()">
            <n-tag strong bordered>
                {{ data.category }}
            </n-tag>
            <n-tooltip trigger="hover">
                <template #trigger>
                    <n-button size="small" @click="handleAddBookmark(data.id)">
                        <template #icon>
                            <n-icon><BookmarkIcon /></n-icon>
                        </template>
                    </n-button>
                </template>
                Add to bookmarks
            </n-tooltip>
            <!-- <n-tooltip trigger="hover" v-else>
                <template #trigger>
                    <n-button size="small" color="#ff69b4" @click="handleRemoveBookmark(data.id)">
                        <template #icon>
                            <n-icon><BookmarkActiveIcon /> </n-icon>
                        </template>
                    </n-button>
                </template>
                Remove from bookmarks
            </n-tooltip> -->
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
