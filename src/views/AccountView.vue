<script setup lang="ts">
import { onBeforeMount, ref, h } from 'vue';
import {
    useLoadingBar,
    useMessage,
    NTag,
    NTime,
    type DataTableColumns,
    type FormInst,
    type FormValidationError,
    type FormRules
} from 'naive-ui';
import type { SignHistoryResponse, SigninRequest, UserResponse } from '@/api';
import { account } from '@/api/user';
import { t, updateTitle, useIsMobile, avatarName } from '@/tools/Comm';
import { useAuthStore } from '@/stores/AuthStore';
import type { FileInfo } from 'naive-ui/es/upload/src/interface';

const message = useMessage();
const loading = useLoadingBar();
const isMobile = useIsMobile();

const accountRef = ref<UserResponse>({
    id: 0,
    username: '',
    email: '',
    avatar: '',
    cdt: 0
});

const formRef = ref<FormInst | null>(null);
const signInForm = ref<SigninRequest>({
    username: null,
    password: null
});

function handleSignIn(e: MouseEvent) {
    e.preventDefault();
    formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
        if (!errors) {
            loading.start();
            try {
                // const res = await authStore.login(signInForm.value);
                // if (res.status === 200 && res.data.code === 0) {
                //     loading.finish();
                //     // await router.push({ name: 'home' });
                //     window.location.href = '/';
                // }
                // if (res.data && res.data.code && res.data.text) {
                //     loading.error();
                //     message.error(res.data.code + ': ' + res.data.text);
                // }
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
    });
}

const signInRules: FormRules = {
    username: [
        {
            required: true,
            message: 'Username is required',
            min: 4,
            max: 30
        }
    ],
    password: [
        {
            required: true,
            message: 'Password is required',
            min: 8,
            max: 30
        }
    ]
};

async function fetchData() {
    loading.start();
    try {
        const res = await account();
        if (res.status === 200 && res.data.code === 0) {
            if (res.data.result) {
                accountRef.value = res.data.result;
            }
            loading.finish();
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

onBeforeMount(async () => {
    await fetchData();
    updateTitle('Sign History');
});
</script>

<template>
    <n-card title="Profile Picture" style="width: 700px">
        <template #header-extra>
            <n-space justify="end">
                <n-tag type="error">Must be JPG, JPEG or PNG and cannot exceed 10MB.</n-tag>
            </n-space>
        </template>
        <n-space>
            <n-avatar round :size="100">
                {{ avatarName(accountRef.username) }}
            </n-avatar>
            <n-space vertical style="margin-top: 25px">
                <n-upload
                    :on-preview="(file: FileInfo) => console.log(file)"
                    action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                >
                    <n-button v-if="accountRef.avatar" tertiary strong
                        >Update Profile Picture</n-button
                    >
                    <n-button v-else tertiary strong>Add Profile Picture</n-button>
                </n-upload>
            </n-space>
        </n-space>
    </n-card>
    <n-card title="Profile Settings" style="width: 700px; margin-top: 15px">
        <n-form ref="formRef" :model="signInForm" :rules="signInRules">
            <n-form-item path="username" label="UID">
                <n-input :value="accountRef.id" disabled />
            </n-form-item>
            <n-form-item path="username" :label="$t('common.username')">
                <n-input :value="accountRef.username" disabled />
            </n-form-item>
            <n-form-item path="username" :label="$t('common.email')">
                <n-input v-model:value="accountRef.email" @keydown.enter.prevent />
            </n-form-item>
        </n-form>
        <n-button @click="handleSignIn" type="primary" block secondary strong>{{
            $t('action.submit')
        }}</n-button>
    </n-card>
</template>

<style scoped></style>
