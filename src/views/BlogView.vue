<script setup lang="ts">
import {onBeforeMount, ref} from 'vue';
import {useLoadingBar, useMessage} from 'naive-ui';
import {
  Close as CloseIcon,
  Copy as CopyIcon,
  CreateOutline as PencilIcon,
  LogoFacebook as FacebookIcon,
  ShareOutline as ShareIcon
} from '@vicons/ionicons5';
import type {BlogResponse} from '@/api';
import {findById} from '@/api/blog';
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import {useRoute} from 'vue-router';
import router from '@/router';
import {useAuthStore} from '@/stores/AuthStore';
import {avatarName, renderIcon, useIsMobile} from '@/tools/Comm';
import {useThemeStore} from '@/stores/ThemeStore';
import useClipboard from 'vue-clipboard3'

const message = useMessage();
const loading = useLoadingBar();
const route = useRoute();
const authStore = useAuthStore();
const isMobile = useIsMobile();

const blogId = ref<number>(0);
const data = ref<BlogResponse>({});
const showModalOfShare = ref<boolean>(false)
const url = ref<string>(window.location.href)

const {toClipboard} = useClipboard()

async function copyLink() {
  try {
    await toClipboard(url.value)
    console.log('Copied to clipboard: ', url.value);
  } catch (e) {
    console.error(e)
  }
}

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
  <n-modal v-model:show="showModalOfShare">
    <n-card
        style="width: 350px"
        :title="$t('common.share')"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
      <template #header-extra>
        <n-button text @click="showModalOfShare = false">
          <template #icon>
            <n-icon>
              <CloseIcon/>
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-space justify="center">
        <a :href="'https://www.facebook.com/sharer/sharer.php?u='+url" target="_blank">
          <n-button color="#4267B2" ghost>
            <template #icon>
              <n-icon>
                <FacebookIcon/>
              </n-icon>
            </template>
            Facebook
          </n-button>
        </a>
        <n-button ghost @click="copyLink">
          <template #icon>
            <n-icon>
              <CopyIcon/>
            </n-icon>
          </template>
          Copy link
        </n-button>
      </n-space>
    </n-card>
  </n-modal>

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
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button @click="showModalOfShare = true">
                <template #icon>
                  <n-icon size="large">
                    <ShareIcon/>
                  </n-icon>
                </template>
              </n-button>
            </template>
            {{ $t("common.share") }}
          </n-tooltip>
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
