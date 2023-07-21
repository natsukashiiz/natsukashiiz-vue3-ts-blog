<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useLoadingBar, useMessage } from 'naive-ui';
import type { BookmarkResponse } from '@/api';
import { findAll } from '@/api/bookmark';
import 'md-editor-v3/lib/preview.css';
import MBlog from '@/components/MBlog.vue';
import MAvatar from '@/components/MAvatar.vue';
import MEmpty from '@/components/MEmpty.vue';
import router from '@/router';
import { AxiosError } from 'axios';
import { updateTitle } from '@/tools/Comm';

const message = useMessage();
const loading = useLoadingBar();

const dataList = ref<Array<BookmarkResponse>>([]);

const page = ref<number>(1);
const pageSize = ref<number>(100);
const pageCount = ref<number>(100);

async function fetchData() {
    loading.start();
    try {
        const res = await findAll({
            page: page.value,
            limit: pageSize.value
        });
        if (res.status === 200 && res.data.code === 0) {
            loading.finish();
            if (res.data.result) dataList.value = res.data.result;
            if (res.data.pagination) pageCount.value = res.data.pagination.pages;
        }
        if (res.data && res.data.code && res.data.text) {
            loading.error();
            message.error(res.data.code + ': ' + res.data.text);
        }
    } catch (e: unknown) {
        if (typeof e === 'string') {
            message.error(e);
        } else if (e instanceof AxiosError) {
            if (e.code == 'ERR_NETWORK') {
                router.push('/server-error');
            }
            e.message; // works, `e` narrowed to Error
            message.error(e.message);
        }
        loading.error();
    }
}

onBeforeMount(async () => {
    await fetchData();
    updateTitle('Bookmarks');
});
</script>

<template>
    <n-space justify="center">
        <n-gradient-text size="30" type="info">{{ $t('menu.bookmarks') }} </n-gradient-text>
    </n-space>
    <n-space vertical>
        <MEmpty v-if="dataList.length === 0" />
        <div v-else v-for="data in dataList" :key="data.id">
            <MBlog :data="data.blog">
                <template #header>
                    <router-link :to="{ path: `/@${data.blog.uname}` }">
                        <MAvatar :name="data.blog.uname" show-name :avatar="data.blog.avatar"
                    /></router-link>
                </template>
            </MBlog>
        </div>
    </n-space>
</template>
