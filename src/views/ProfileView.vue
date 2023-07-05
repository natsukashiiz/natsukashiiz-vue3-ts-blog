<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useLoadingBar, useMessage } from 'naive-ui';
import type { BlogResponse } from '@/api';
import { findByUser } from '@/api/blog';
import 'md-editor-v3/lib/preview.css';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/AuthStore';
import { onBeforeRouteUpdate } from 'vue-router';

import MBlog from '@/components/MBlog.vue';
import MAvatar from '@/components/MAvatar.vue';

const message = useMessage();
const loading = useLoadingBar();
const authStore = useAuthStore();
const route = useRoute();

const dataList = ref<Array<BlogResponse>>([]);
const uname = ref<string>('');

const handlePageChange = async (curPage: number) => {
    page.value = curPage;
    await fetchData();
};
const handlePageSizeChange = async (curPageSize: number) => {
    pageSize.value = curPageSize;
    await fetchData();
};

const page = ref<number>(1);
const pageSize = ref<number>(100);
const pageCount = ref<number>(100);

async function fetchData() {
    loading.start();
    try {
        const res = await findByUser(uname.value, {
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
        } else if (e instanceof Error) {
            e.message; // works, `e` narrowed to Error
            message.error(e.message);
        }
        loading.error();
    }
}

onMounted(async () => {
    uname.value = String(route.params.uname);
    await fetchData();
});

onBeforeRouteUpdate(async (to, from) => {
    // only fetch the user if the id changed as maybe only the query or the hash changed
    if (to.params.uname !== from.params.uname) {
        uname.value = String(to.params.uname);
        await fetchData();
    }
});
</script>

<template>
    <n-layout position="absolute" style="top: 60px; bottom: 50px">
        <n-grid cols="12" item-responsive style="padding-top: 10px">
            <n-grid-item span="12 400:1 600:1 800:2">
                <MAvatar vertical :name="uname" />
            </n-grid-item>
            <n-grid-item span="12 400:11 600:11 800:10">
                <n-space vertical>
                    <div v-for="data in dataList" :key="data.id">
                        <MBlog :data="data">
                            <template #header-extra v-if="authStore.payload?.uid == data.uid">
                                <n-tag v-if="data.publish" type="success">{{
                                    $t('common.publish')
                                }}</n-tag>
                                <n-tag v-else type="error">{{ $t('common.private') }}</n-tag>
                            </template>
                        </MBlog>
                    </div>
                </n-space>
            </n-grid-item>
        </n-grid>
    </n-layout>
</template>
