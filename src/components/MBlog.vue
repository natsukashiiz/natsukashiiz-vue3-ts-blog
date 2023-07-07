<script setup lang="ts">
import type {BlogResponse} from '@/api';
import {t, textLimit} from '@/tools/Comm';
import {MdPreview} from 'md-editor-v3';
import {useThemeStore} from '@/stores/ThemeStore';
import {Bookmark as BookmarkActiveIcon, BookmarkOutline as BookmarkIcon} from '@vicons/ionicons5';
import {add, remove} from '@/api/bookmark';
import {useMessage} from 'naive-ui';
import {useAuthStore} from '@/stores/AuthStore';
import {ref} from "vue";

defineProps<{
  data: BlogResponse;
}>();

const authStore = useAuthStore();
const message = useMessage();
const bookmarkRef = ref<boolean>(false)

// function
async function handleAddBookmark(blogId: number) {
  try {
    const res = await add({blogId});
    if (res.status === 200 && res.data.code === 0) {
      bookmarkRef.value = true;
      message.success(t("bookmark.added"))
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
      message.success(t("bookmark.removed"));
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
  <n-card>
    <n-space justify="space-between">
      <div>
        <slot name="header"></slot>
        <n-time :time="new Date(data.cdt)" format="MMM dd, yyyy"/>
      </div>
      <div>
        <slot name="header-extra"></slot>
      </div>
    </n-space>
    <n-divider/>
    <n-space justify="end" v-if="authStore.isAuthenticated()">
      <n-tag strong bordered>
        {{ data.category }}
      </n-tag>
      <n-tooltip trigger="hover" v-if="!data.bookmark && !bookmarkRef">
        <template #trigger>
          <n-button size="small" @click="handleAddBookmark(data.id)">
            <template #icon>
              <n-icon>
                <BookmarkIcon/>
              </n-icon>
            </template>
          </n-button>
        </template>
        {{ $t("bookmark.add") }}
      </n-tooltip>
      <n-tooltip trigger="hover" v-else>
        <template #trigger>
          <n-button size="small" color="#FF9B9B" @click="handleRemoveBookmark(data.id)">
            <template #icon>
              <n-icon>
                <BookmarkActiveIcon/>
              </n-icon>
            </template>
          </n-button>
        </template>
        {{ $t("bookmark.remove") }}
      </n-tooltip>
    </n-space>
    <n-h1>
      <n-text underline>
        {{ data.title }}
      </n-text>
    </n-h1>
    <MdPreview
        editor-id="preview-only"
        :theme="useThemeStore().theme"
        :model-value="textLimit(data.content, 200)"
    />
    <n-space justify="end">
      <router-link :to="`/blog/${data.id}`">
        {{ $t("common.readMore") }}
      </router-link>
    </n-space>
  </n-card>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
