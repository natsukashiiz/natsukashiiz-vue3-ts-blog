<script setup lang="ts">
// import
import { ref } from 'vue';
import type { FormInst, FormRules, FormValidationError } from 'naive-ui';
import { useMessage, useLoadingBar } from 'naive-ui';
import { useRouter } from 'vue-router';
import type { SignupRequest } from '@/api';
import { signUp } from '@/api/auth';

const router = useRouter();
const message = useMessage();
const loading = useLoadingBar();

// variable
const formRef = ref<FormInst | null>(null);
const modelRef = ref<SignupRequest>({
    email: null,
    username: null,
    password: null
});

// functions
function handleSubmit(e: MouseEvent) {
    e.preventDefault();
    formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
        if (!errors) {
            loading.start();
            try {
                const res = await signUp(modelRef.value);
                if (res.status === 200 && res.data.code === 0) {
                    loading.finish();
                    await router.push({ name: 'signIn' });
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

// other
const rules: FormRules = {
    email: [
        {
            required: true,
            message: 'Email is required'
        }
    ],
    username: [
        {
            required: true,
            message: 'Username is required'
        }
    ],
    password: [
        {
            required: true,
            message: 'Password is required'
        }
    ]
};
</script>

<template>
    <n-space justify="center" style="margin-top: 10vh">
        <n-card :title="$t('menu.signUp')" style="width: 500px">
            <n-form ref="formRef" :model="modelRef" :rules="rules">
                <n-form-item path="email" :label="$t('common.email')">
                    <n-input v-model:value="modelRef.email" @keydown.enter.prevent />
                </n-form-item>
                <n-form-item path="username" :label="$t('common.username')">
                    <n-input v-model:value="modelRef.username" @keydown.enter.prevent />
                </n-form-item>
                <n-form-item path="password" :label="$t('common.password')">
                    <n-input
                        v-model:value="modelRef.password"
                        type="password"
                        @keydown.enter.prevent
                    />
                </n-form-item>
                <n-row :gutter="[0, 24]">
                    <n-col :span="24">
                        <div style="display: flex; justify-content: flex-end">
                            <n-button roundee type="primary" @click="handleSubmit">
                                {{ $t('action.submit') }}
                            </n-button>
                        </div>
                    </n-col>
                </n-row>
            </n-form>
        </n-card>
    </n-space>
</template>

<style scoped></style>
