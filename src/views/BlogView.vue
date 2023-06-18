<script setup lang="ts">
import { onMounted, reactive, ref, h, type Component } from 'vue';
import { NCard, NSpace, NIcon, NButton, NAvatar, useLoadingBar, useMessage } from 'naive-ui';
import { CreateOutline as PencilIcon } from '@vicons/ionicons5';
import type { BlogResponse } from '@/api';
import { findById } from '@/api/blog';
import { marked } from 'marked';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useAuthStore } from '@/stores/AuthStore';
import { avatarName } from '@/tools/Comm';

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

const message = useMessage();
const loading = useLoadingBar();
const route = useRoute();
const authStore = useAuthStore();

const blogId = ref<number>(0);
const data = reactive<BlogResponse>({
    id: 0,
    title: '',
    content: '',
    publish: false,
    cdt: 0,
    user: {
        id: 0,
        email: '',
        username: '',
        cdt: 0
    }
});

async function fetchData() {
    loading.start();
    try {
        const res = await findById(blogId.value);
        if (res.status === 200 && res.data.code === 0) {
            if (res.data.result) {
                Object.assign(data, res.data.result);
            }
            loading.finish();
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

onMounted(async () => {
    if (route.params.id == null) {
        router.push({ name: 'home' });
    }

    blogId.value = Number(route.params.id);
    await fetchData();
});
</script>

<template>
    <n-space vertical>
        <n-card :bordered="false">
            <template #cover>
                <h1>
                    {{ data.title }}
                    <n-button
                        v-if="data.user?.id == authStore.payload?.uid"
                        type="primary"
                        size="small"
                        ghost
                        :render-icon="renderIcon(PencilIcon)"
                        @click="() => router.push(`/blog/${data.id}/editor`)"
                    />
                </h1>
            </template>
            <template #header>
                <n-space>
                    <n-avatar round>
                        {{ avatarName(data.user.username) }}
                    </n-avatar>
                    <n-space vertical>
                        {{ data.user.username }} |
                        {{ data.cdt }}
                    </n-space>
                </n-space>
            </template>
            <p v-html="marked.parse(data.content)" />
        </n-card>
    </n-space>
</template>

<style scoped>
.n-card {
    max-width: 50%;
    margin-left: auto;
    margin-right: auto;
}
</style>
