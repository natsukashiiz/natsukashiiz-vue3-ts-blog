<script setup lang="ts">
import { onMounted, ref } from 'vue';
import 'md-editor-v3/lib/style.css';
import { MdEditor } from 'md-editor-v3';
import { useLoadingBar, useMessage } from 'naive-ui';
import { findById, update, publish } from '@/api/blog';
import { useRoute } from 'vue-router';
import router from '@/router';

const message = useMessage();
const loading = useLoadingBar();
const route = useRoute();

const text = ref<string>('');
const title = ref<string>('');
const publishRef = ref<boolean>(false);
const blogId = ref<number>(0);

async function handleSave() {
    loading.start();
    try {
        const res = await update(blogId.value, { title: title.value, content: text.value });
        if (res.status === 200 && res.data.code === 0) {
            if (res.data.result) {
                title.value = res.data.result.title;
                text.value = res.data.result.content;
            }
            loading.finish();
            message.success('Saved');
        }
        if (res.data && res.data.code) {
            loading.error();
            message.error('Failed to save');
        }
    } catch (e: unknown) {
        if (typeof e === 'string') {
            message.error(e);
        } else if (e instanceof Error) {
            e.message;
            message.error(e.message);
        }
        loading.error();
    }
}

async function handlePublish() {
    await handleSave();
    loading.start();
    try {
        const res = await publish(blogId.value);
        if (res.status === 200 && res.data.code === 0) {
            if (res.data.result) {
                title.value = res.data.result.title;
                text.value = res.data.result.content;
                publishRef.value = res.data.result.publish;
            }
            loading.finish();
            // message.success(`${publishRef.value ? 'Publish' : 'Private'}`);
        }
    } catch (e: unknown) {
        if (typeof e === 'string') {
            message.error(e);
        } else if (e instanceof Error) {
            e.message;
            message.error(e.message);
        }
        loading.error();
    }
}

async function fetchData() {
    loading.start();
    try {
        const res = await findById(blogId.value);
        if (res.status === 200 && res.data.code === 0) {
            if (res.data.result) {
                title.value = res.data.result.title;
                text.value = res.data.result.content;
                publishRef.value = res.data.result.publish;
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
    <n-space justify="space-between">
        <n-input
            v-model:value="title"
            @keyup.enter="handleSave"
            placeholder="Title"
            :bordered="false"
            size="large"
            style="width: 50rem"
        />
        <n-switch
            v-model:value="publishRef"
            @update:value="handlePublish"
            style="margin-bottom: 10px"
        >
            <template #checked>Publish</template>
            <template #unchecked>Private</template>
        </n-switch>
    </n-space>
    <MdEditor v-model="text" language="en-US" preview-theme="github" @save="handleSave" />
</template>
