<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { NCard, NSpace, NAvatar, NDivider, useLoadingBar, useMessage } from 'naive-ui';
import type { BlogResponse } from '@/api';
import { blogList } from '@/api/blog';
import { PaginationState } from '@/api/enum';
import { marked } from 'marked';
import { textLimt } from '@/tools/Comm';
import dateFormat from 'dateformat';

const message = useMessage();
const loading = useLoadingBar();

const dataList = ref<Array<BlogResponse>>([]);

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
        const res = await blogList({
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
    await fetchData();
});
</script>

<template>
    <n-space vertical>
        <n-card
            v-for="data in dataList"
            :key="data.id"
            :segmented="{
                content: true
            }"
        >
            <n-space align="center">
                <n-avatar
                    round
                    size="small"
                    src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                />
                Unknown
            </n-space>
            {{ dateFormat(data.cdt, 'fullDate') }}
            <n-divider />
            <router-link :to="`/blog/${data.id}`">
                <h1>{{ data.title }}</h1>
                <p v-html="marked.parse(textLimt(data.content, 200))" />
            </router-link>
        </n-card>
    </n-space>
</template>

<style scoped>
.n-card {
    max-width: 50%;
    margin-left: auto;
    margin-right: auto;
}
a {
    color: #000;
    text-decoration: none;
}
</style>
