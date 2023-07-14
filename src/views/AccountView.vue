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
import { t, updateTitle, useIsMobile } from '@/tools/Comm';
import { useAuthStore } from '@/stores/AuthStore';

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
    <n-card style="width: 450px">
        <n-space justify="center">
            <n-tooltip trigger="hover">
                <template #trigger>
                    <n-upload
                        action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                        style="cursor: pointer"
                    >
                        <n-avatar
                            round
                            :size="150"
                            src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj"
                        />
                    </n-upload>
                </template>
                Click to upload
            </n-tooltip>
        </n-space>
        <n-divider />
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
