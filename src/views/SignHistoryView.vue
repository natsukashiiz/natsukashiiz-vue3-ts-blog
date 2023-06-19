<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { useLoadingBar, useMessage } from 'naive-ui';
import type { SignHistoryResponse } from '@/api';
import { signHistory } from '@/api/user';
import { PaginationState } from '@/api/enum';

const message = useMessage();
const loading = useLoadingBar();

const signHistoryList = ref<Array<SignHistoryResponse>>([]);
const handlePageChange = async (curPage: number) => {
    page.value = curPage;
    await fetchData();
};
const handlePageSizeChange = async (curPageSize: number) => {
    pageSize.value = curPageSize;
    await fetchData();
};
const page = ref<number>(1);
const pageSize = ref<number>(10);
const pageCount = ref<number>(100);

const columns: DataTableColumns<SignHistoryResponse> = [
    {
        title: '#',
        key: 'id'
    },
    {
        title: 'IP',
        key: 'ipv4'
    },
    {
        title: 'Device',
        key: 'device'
    },
    {
        title: 'Time',
        key: 'cdt'
    }
];

async function fetchData() {
    loading.start();
    try {
        const res = await signHistory({
            page: page.value,
            limit: pageSize.value,
            sortBy: PaginationState.SORT_BY.toString(),
            sortType: PaginationState.SORT_TYPE.toString()
        });
        if (res.status === 200 && res.data.code === 0) {
            loading.finish();
            if (res.data.result) signHistoryList.value = res.data.result;
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
    <n-data-table :columns="columns" :data="signHistoryList" />
    <n-space justify="end">
        <n-pagination
            v-model:page="page"
            v-model:page-size="pageSize"
            :page-count="pageCount"
            show-size-picker
            :page-sizes="[10, 30, 50, 100]"
            :on-update:page="handlePageChange"
            :on-update:page-size="handlePageSizeChange"
            style="margin-top: 10px"
        />
    </n-space>
</template>

<style scoped></style>
