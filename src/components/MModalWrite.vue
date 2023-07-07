<script setup lang="ts">
import { findAll } from '@/api/category';
import { onMounted, ref } from 'vue';
import { type FormInst, type FormRules, type FormValidationError, useMessage } from 'naive-ui';
import { type BlogRequest, type CategoryResponse } from '@/api';
import { create } from '@/api/blog';
import router from '@/router';

const message = useMessage();

const categoriesRef = ref<CategoryResponse[]>();
const categoriesOptions: Array<{ label: string; value: number }> = [];

const formRef = ref<FormInst | null>(null);
const modelRef = ref<BlogRequest>({
    title: null,
    content: '## Hello World.',
    categoryId: null
});

const rules: FormRules = {
    user: {
        title: {
            required: true,
            message: 'Please input title',
            trigger: 'blur'
        },
        categoryId: {
            required: true,
            message: 'Please select category',
            trigger: 'blur'
        }
    }
};

onMounted(async () => {
    await fetchCategories();
    categoriesRef.value?.map((val) => {
        categoriesOptions.push({
            label: val.name,
            value: val.id
        });
    });
});

async function fetchCategories() {
    try {
        const res = await findAll();
        if (res.status === 200 && res.data.code === 0) {
            if (res.data.result) categoriesRef.value = res.data.result;
            return;
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

async function submitCallback() {
    formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
        if (!errors) {
            try {
                const res = await create(modelRef.value);
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
                    return false;
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
    });
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
        <n-form ref="formRef" model="modelRef" rules="rules">
            <n-form-item :label="$t('blog.category')">
                <n-select v-model:value="modelRef.categoryId" :options="categoriesOptions" />
            </n-form-item>
            <n-form-item :label="$t('blog.title')">
                <n-form inline>
                    <n-input v-model:value="modelRef.title" />
                </n-form>
            </n-form-item>
        </n-form>
    </n-modal>
</template>
