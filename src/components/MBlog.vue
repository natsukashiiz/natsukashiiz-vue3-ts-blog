<script setup lang="ts">
import type { BlogResponse } from '@/api';
import { t, textLimit, useIsMobile, renderIcon } from '@/tools/Comm';
import { MdPreview } from 'md-editor-v3';
import { useThemeStore } from '@/stores/ThemeStore';
import {
    Bookmark as BookmarkActiveIcon,
    BookmarkOutline as BookmarkIcon,
    CreateOutline as PencilIcon
} from '@vicons/ionicons5';
import { add, remove } from '@/api/bookmark';
import { useMessage } from 'naive-ui';
import { useAuthStore } from '@/stores/AuthStore';
import { onBeforeMount, ref } from 'vue';
import router from '@/router';

const props = defineProps<{
    data: BlogResponse;
}>();

const authStore = useAuthStore();
const message = useMessage();
const isMobile = useIsMobile();

const bookmarkRef = ref<boolean>(true);

onBeforeMount(() => {
    bookmarkRef.value = props.data.bookmark || false;
});

// function
async function handleAddBookmark(blogId: number) {
    try {
        const res = await add({ blogId });
        if (res.status === 200 && res.data.code === 0) {
            bookmarkRef.value = true;
            message.success(t('bookmark.added'));
            return;
        }
        if (res.data.code === 312) {
            bookmarkRef.value = true;
            return;
        }
    } catch (e: unknown) {
        if (typeof e === 'string') {
            message.error(e);
        } else if (e instanceof Error) {
            e.message; // works, `e` narrowed to Error
            message.error(e.message);
        }
    }
}

async function handleRemoveBookmark(blogId: number) {
    try {
        const res = await remove(blogId);
        if (res.status === 200 && res.data.code === 0) {
            bookmarkRef.value = false;
            message.success(t('bookmark.removed'));
        }
    } catch (e: unknown) {
        if (typeof e === 'string') {
            message.error(e);
        } else if (e instanceof Error) {
            e.message; // works, `e` narrowed to Error
            message.error(e.message);
        }
    }
}
</script>

<template>
    <n-card :embedded="!data.publish" bordered>
        <n-space justify="space-between">
            <div>
                <slot name="header"></slot>
            </div>
            <n-space justify="end" style="margin-top: 6px">
                <slot name="header-extra"></slot>
                <n-tag>
                    <n-time :time="new Date(data.cdt)" format="MMM dd, yyyy" />
                </n-tag>
                <n-tag strong bordered>
                    {{ data.category }}
                </n-tag>
                <div
                    v-if="
                        authStore.isAuthenticated() &&
                        (data.publish || data.uid === authStore.payload?.uid)
                    "
                >
                    <n-tooltip trigger="hover" v-if="!bookmarkRef">
                        <template #trigger>
                            <n-button size="small" @click="handleAddBookmark(data.id)">
                                <template #icon>
                                    <n-icon>
                                        <BookmarkIcon />
                                    </n-icon>
                                </template>
                            </n-button>
                        </template>
                        {{ $t('bookmark.add') }}
                    </n-tooltip>
                    <n-tooltip trigger="hover" v-else>
                        <template #trigger>
                            <n-button
                                size="small"
                                type="primary"
                                @click="handleRemoveBookmark(data.id)"
                            >
                                <template #icon>
                                    <n-icon>
                                        <BookmarkActiveIcon />
                                    </n-icon>
                                </template>
                            </n-button>
                        </template>
                        {{ $t('bookmark.remove') }}
                    </n-tooltip>
                    <n-button
                        v-if="data.uid === authStore.payload?.uid"
                        :disabled="isMobile"
                        size="small"
                        ghost
                        :render-icon="renderIcon(PencilIcon)"
                        @click="() => router.push(`/blog/${data.id}/write`)"
                        style="margin-left: 10px"
                    />
                </div>
            </n-space>
        </n-space>
        <n-divider />
        <n-h1>
            <n-text code strong>
                {{ data.title }}
            </n-text>
        </n-h1>
        <MdPreview
            v-if="data.publish"
            editor-id="preview-only"
            preview-theme="github"
            :theme="useThemeStore().theme"
            :model-value="textLimit(data.content, 200)"
            language="en-US"
        />
        <n-space v-if="data.publish" justify="end">
            <router-link :to="`/@${data.uname}/blog/${data.id}`">
                {{ $t('common.readMore') }}
            </router-link>
        </n-space>
    </n-card>
</template>

<style scoped>
a {
    text-decoration: none;
}
</style>
