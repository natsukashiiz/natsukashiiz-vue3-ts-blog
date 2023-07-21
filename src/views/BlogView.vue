<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useLoadingBar, useMessage } from 'naive-ui';
import {
    Close as CloseIcon,
    Copy as CopyIcon,
    CreateOutline as PencilIcon,
    LogoFacebook as FacebookIcon,
    ShareOutline as ShareIcon
} from '@vicons/ionicons5';
import type { BlogResponse } from '@/api';
import { findById } from '@/api/blog';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useAuthStore } from '@/stores/AuthStore';
import { avatarName, renderIcon, useIsMobile, t } from '@/tools/Comm';
import { useThemeStore } from '@/stores/ThemeStore';
import { updateTitle } from '@/tools/Comm';
import { useHead } from '@vueuse/head';
import MAvatar from '@/components/MAvatar.vue';

const message = useMessage();
const loading = useLoadingBar();
const route = useRoute();
const authStore = useAuthStore();
const isMobile = useIsMobile();

const blogId = ref<number>(0);
const data = ref<BlogResponse>({
    id: 0,
    title: '',
    content: '',
    category: '',
    publish: false,
    cdt: 0,
    uid: 0,
    uname: '',
    avatar: '',
    bookmark: false
});
const showModalOfShare = ref<boolean>(false);
const url = ref<string>(window.location.href);

async function copyLink() {
    try {
        await navigator.clipboard.writeText(url.value);
        message.success(t('common.copied'));
    } catch (e) {
        console.log(e);
        message.error('Not support your device.');
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
            await router.push({ name: 'notFound' });
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
        await router.push({ name: 'home' });
    }

    blogId.value = Number(route.params.id);
    await fetchData();

    updateTitle(data.value.title);
    useHead({
        title: data.value.title,
        meta: [
            { property: 'og:title', content: data.value.title },
            { property: 'og:content', content: data.value.content }
        ]
    });
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
                            <CloseIcon />
                        </n-icon>
                    </template>
                </n-button>
            </template>
            <n-space justify="center">
                <a :href="'https://www.facebook.com/sharer/sharer.php?u=' + url" target="_blank">
                    <n-button color="#4267B2" ghost>
                        <template #icon>
                            <n-icon>
                                <FacebookIcon />
                            </n-icon>
                        </template>
                        Facebook
                    </n-button>
                </a>
                <n-button ghost @click="copyLink">
                    <template #icon>
                        <n-icon>
                            <CopyIcon />
                        </n-icon>
                    </template>
                    {{ $t('common.copyLink') }}
                </n-button>
            </n-space>
        </n-card>
    </n-modal>

    <n-space v-if="data.id !== 0" vertical>
        <n-card>
            <template #header>
                <router-link :to="{ path: `/@${data.uname}` }">
                    <n-space align="center">
                        <MAvatar :name="data.uname" :avatar="data.avatar" />
                        <n-space vertical>
                            <n-h6
                                >{{ data.uname }} <br />
                                <n-time
                                    :time="new Date(data.cdt !== undefined ? data.cdt : 0)"
                                    format="MMM dd, yyyy"
                                />
                            </n-h6>
                        </n-space>
                    </n-space>
                </router-link>
                <n-divider />
                <n-space justify="space-between">
                    <n-h1>
                        {{ data.title }}
                        <n-button
                            v-if="data.uid === authStore.payload?.uid"
                            :disabled="isMobile"
                            size="small"
                            ghost
                            :render-icon="renderIcon(PencilIcon)"
                            @click="() => router.push(`/blog/${data.id}/write`)"
                            style="margin-right: 5px"
                        />
                        <n-tooltip v-if="data.publish" trigger="hover">
                            <template #trigger>
                                <n-button size="small" ghost @click="showModalOfShare = true">
                                    <template #icon>
                                        <n-icon>
                                            <ShareIcon />
                                        </n-icon>
                                    </template>
                                </n-button>
                            </template>
                            {{ $t('common.share') }}
                        </n-tooltip>
                    </n-h1>
                    <n-tag strong bordered style="margin-top: 13px">
                        {{ data.category }}
                    </n-tag>
                </n-space>
            </template>
            <MdPreview
                v-if="data.publish"
                editor-id="preview-only"
                :model-value="data.content"
                :theme="useThemeStore().theme"
                language="en-US"
                preview-theme="github"
            />
        </n-card>
    </n-space>
</template>
