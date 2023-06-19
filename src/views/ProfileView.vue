<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useLoadingBar, useMessage } from 'naive-ui';
import type { BlogResponse } from '@/api';
import { findByUser } from '@/api/blog';
import { PaginationState } from '@/api/enum';
import 'md-editor-v3/lib/preview.css';
import { avatarName } from '@/tools/Comm';
import MBlog from '@/components/MBlog.vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/AuthStore';

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
            limit: pageSize.value,
            sortBy: PaginationState.SORT_BY.toString(),
            sortType: PaginationState.SORT_TYPE.toString()
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

watch(
    () => route.params.uname,
    async (newUname: string) => {
        uname.value = newUname;
        await fetchData();
    }
);
</script>

<template>
    <n-layout has-sider position="absolute" style="top: 70px; bottom: 70px">
        <n-layout-sider bordered content-style="padding: 50px;">
            <n-space align="center">
                <n-avatar round size="large">
                    {{ avatarName(uname ?? '?') }}
                </n-avatar>
            </n-space>
            Name: {{ uname }}
        </n-layout-sider>
        <n-layout content-style="padding: 15px;">
            <n-space vertical>
                <div v-for="data in dataList" :key="data.id">
                    <MBlog :data="data">
                        <template #header-extra v-if="authStore.payload?.uid == data.uid">
                            <n-tag v-if="data.publish" type="success">Publish</n-tag>
                            <n-tag v-else type="error">Private</n-tag>
                        </template>
                    </MBlog>
                </div>
            </n-space>
        </n-layout>
    </n-layout>
</template>

<style scoped>
.n-card {
    max-width: 50%;
    margin-left: auto;
    margin-right: auto;
}
</style>
