<script setup lang="ts">
import {onBeforeMount, ref} from 'vue';
import {useLoadingBar, useMessage} from 'naive-ui';
import {CreateOutline as PencilIcon} from '@vicons/ionicons5';
import type {BlogResponse} from '@/api';
import {findById} from '@/api/blog';
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import {useRoute} from 'vue-router';
import router from '@/router';
import {useAuthStore} from '@/stores/AuthStore';
import {avatarName, renderIcon, useIsMobile} from '@/tools/Comm';
import {useThemeStore} from '@/stores/ThemeStore';

const message = useMessage();
const loading = useLoadingBar();
const route = useRoute();
const authStore = useAuthStore();
const isMobile = useIsMobile();

const blogId = ref<number>(0);
const data = ref<BlogResponse>({});

async function fetchData() {
  loading.start();
  try {
    const res = await findById(blogId.value);
    if (res.status === 200 && res.data.code === 0) {
      if (res.data.result) {
        data.value = res.data.result;
      }
      loading.finish();
      return;
    }

    if (res.data.code === 421) {
      message.error(res.data.text);
      loading.error();
      await router.push({name: 'notFound'})
    }
  } catch (e: unknown) {
    if (typeof e === 'string') {
      message.error(e);
    } else if (e instanceof Error) {
      e.message; // works, `e` narrowed to Error
      message.error(e.message);
    }
    loading.error();
  }
}

onBeforeMount(async () => {
  if (route.params.id == null) {
    await router.push({name: 'home'});
  }

  blogId.value = Number(route.params.id);
  await fetchData();
});
</script>

<template>
  <n-space vertical>
    <n-card :bordered="false">
      <template #header>
        <router-link :to="{ path: `/@${data.uname}` }">
          <n-space align="center">
            <n-avatar round size="large">
              {{ avatarName(data.uname) }}
            </n-avatar>
            <n-space vertical>
              <n-h6
              >{{ data.uname }} <br/>
                <n-time :time="new Date(data.cdt !== undefined ? data.cdt : 0)" format="MMM dd, yyyy"/>
              </n-h6>
            </n-space>
          </n-space>
        </router-link>
        <n-divider/>
        <n-h1>
          {{ data.title }}
          <n-button
              v-if="data.uid === authStore.payload?.uid"
              :disabled="isMobile"
              type="primary"
              size="small"
              ghost
              :render-icon="renderIcon(PencilIcon)"
              @click="() => router.push(`/blog/${data.id}/write`)"
          />
        </n-h1>
      </template>
      <MdPreview
          editor-id="preview-only"
          :model-value="data.content"
          :theme="useThemeStore().theme"
          language="en-US"
          preview-theme="github"
      />
    </n-card>
  </n-space>
</template>
