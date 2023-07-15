<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import {
    useLoadingBar,
    useMessage,
    NTag,
    type FormInst,
    type FormValidationError,
    type FormRules,
    type UploadCustomRequestOptions
} from 'naive-ui';
import type { UpdateUserRequest, UserResponse } from '@/api';
import { update, removeAvatar } from '@/api/user';
import { account, avatar } from '@/api/user';
import { t, updateTitle, useIsMobile } from '@/tools/Comm';
import { useAuthStore } from '@/stores/AuthStore';
import MAvatar from '@/components/MAvatar.vue';
import { TrashOutline as TrashIcon } from '@vicons/ionicons5';

const authStore = useAuthStore();
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
const updForm = ref<UpdateUserRequest>({
    email: ''
});

async function customRequest({ file, data, onFinish, onError }: UploadCustomRequestOptions) {
    loading.start();
    const formData = new FormData();
    if (data) {
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key as keyof UploadCustomRequestOptions['data']]);
        });
    }

    if (file.file?.size && file.file.size > 10485760) {
        message.warning('ขนาดไฟล์เกิน');
        loading.error();
        return;
    }

    formData.append('file', file.file as File);
    try {
        const res = await avatar(formData);
        if (res.status === 200 && res.data.code === 0) {
            const result = res.data.result;
            accountRef.value.avatar = result?.avatar || '';
            await authStore.fetchRefreshToken();
            loading.finish();
            onFinish();
        } else {
            loading.error();
            message.error('Failed!');
            onError();
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

async function handleRemoveAvatar() {
    try {
        const res = await removeAvatar();
        if (res.status === 200 && res.data.code === 0) {
            const result = res.data.result;
            accountRef.value.avatar = result?.avatar || '';
            await authStore.fetchRefreshToken();
            loading.finish();
        } else {
            loading.error();
            message.error('Failed!');
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

function handleUpdate(e: MouseEvent) {
    e.preventDefault();
    formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
        if (!errors) {
            loading.start();
            try {
                const res = await update(updForm.value);
                if (res.status === 200 && res.data.code === 0) {
                    loading.finish();
                    message.success(t('common.saved'));
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
    });
}

const updRules: FormRules = {
    email: [
        {
            required: true,
            message: 'Email is required'
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
                loading.finish();
            }
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
    updForm.value.email = accountRef.value.email;
    updateTitle('Settings');
});
</script>

<template>
    <n-card style="width: 700px">
        <template #header>
            <n-space justify="space-between">
                <n-h3>{{ $t('settings.picture') }}</n-h3>
                <n-tag type="error" :size="isMobile ? 'small' : 'medium'">{{
                    $t('settings.must')
                }}</n-tag>
            </n-space>
        </template>
        <n-space align="center">
            <MAvatar
                :name="authStore.payload?.name"
                :avatar="authStore.payload?.avatar"
                can-preview
                :size="isMobile ? 80 : 100"
            />
            <n-space vertical>
                <n-upload :custom-request="customRequest" accept="image/png, image/jpg, image/jpeg">
                    <n-button
                        v-if="accountRef.avatar"
                        tertiary
                        strong
                        :size="isMobile ? 'small' : 'medium'"
                        >{{ $t('settings.update') }}</n-button
                    >
                    <n-button v-else tertiary strong :size="isMobile ? 'small' : 'medium'">{{
                        $t('settings.add')
                    }}</n-button>
                </n-upload>
            </n-space>
            <n-tooltip trigger="hover">
                <template #trigger>
                    <n-button text @click="handleRemoveAvatar">
                        <n-icon size="large">
                            <TrashIcon />
                        </n-icon>
                    </n-button>
                </template>
                {{ $t('common.remove') }}
            </n-tooltip>
        </n-space>
    </n-card>
    <n-card :title="$t('settings.settings')" style="width: 700px; margin-top: 15px">
        <n-form ref="formRef" :model="updForm" :rules="updRules">
            <n-form-item path="uid" label="UID">
                <n-input :value="String(accountRef.id)" disabled />
            </n-form-item>
            <n-form-item path="username" :label="$t('common.username')">
                <n-input :value="accountRef.username" disabled />
            </n-form-item>
            <n-form-item path="email" :label="$t('common.email')">
                <n-input v-model:value="updForm.email" @keydown.enter.prevent />
            </n-form-item>
        </n-form>
        <n-button @click="handleUpdate" type="primary" block secondary strong>{{
            $t('action.submit')
        }}</n-button>
    </n-card>
</template>
