<script setup lang="ts">
import { onMounted, reactive } from "vue";
import type { DataTableColumns } from "naive-ui";
import { NDataTable } from "naive-ui";
import type { SignHistoryResponse } from "@/api";
import { signHistory } from "@/api/user";

const data = reactive<Array<SignHistoryResponse>>([]);

const columns: DataTableColumns<SignHistoryResponse> = [
  {
    title: "#",
    key: "id"
  },
  {
    title: "IP",
    key: "ipv4"
  },
  {
    title: "Device",
    key: "device"
  },
  {
    title: "Time",
    key: "cdt"
  }
];

onMounted(async () => {
  const res = await signHistory();
  if (res.status === 200 && res.data.code == 0) {
    data.concat(res.data.result);
  }
});
</script>

<template>
  <h1>Sign History</h1>
  <hr>
  <n-data-table
    :columns="columns"
    :data="data"
  />
</template>

<style scoped>

</style>