<script setup lang="ts">
import { create } from '@/api/blog';
import router from '@/router';
import { htmlToBase64 } from '@/tools/Comm';
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
const message = useMessage();

const blogTitle = ref<string | null>(null);
async function submitCallback() {
    if (blogTitle.value === null) {
        message.error('null: ' + blogTitle.value);
        return false;
    } else {
        try {
            const res = await create({
                title: blogTitle.value,
                content: htmlToBase64('## Hello World.')
            });
            if (res.status === 200 && res.data.code === 0) {
                if (res.data.result) {
                    await router.push(`/blog/${res.data.result.id}/write`);
                    return true;
                } else {
                    return false;
                }
            }
            if (res.data && res.data.text) {
                message.error(res.data.code + ': ' + res.data.text);
            }
        } catch (e: unknown) {
            if (typeof e === 'string') {
                message.error(e);
            } else if (e instanceof Error) {
                e.message; // works, `e` narrowed to Error
                message.error(e.message);
            }
            return false;
        }
    }
}
</script>

<template>
    <n-modal
        preset="dialog"
        :title="$t('menu.write')"
        :positive-text="$t('action.submit')"
        :negative-text="$t('action.cancel')"
        @positive-click="submitCallback"
    >
        <n-form inline>
            <n-input v-model:value="blogTitle" />
        </n-form>
    </n-modal>
</template>
