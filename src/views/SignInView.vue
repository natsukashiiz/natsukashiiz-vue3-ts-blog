<script setup lang="ts">
// import
import { ref } from 'vue';
import type { FormInst, FormRules, FormValidationError } from 'naive-ui';
import { useLoadingBar, useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import type { SigninRequest } from '@/api';
import { useAuthStore } from '@/stores/AuthStore';

const router = useRouter();
const authStore = useAuthStore();
const message = useMessage();
const loading = useLoadingBar();

// variable
const formRef = ref<FormInst | null>(null);
const modelRef = ref<SigninRequest>({
    username: null,
    password: null
});

// functions
function handleSubmit(e: MouseEvent) {
    e.preventDefault();
    loading.start();
    formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
        if (!errors) {
            try {
                const res = await authStore.login(modelRef.value);
                if (res.status === 200 && res.data.code === 0) {
                    loading.finish();
                    await router.push({ name: 'home' });
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
        } else {
            loading.error();
            console.log(errors);
            message.error('Invalid');
        }
    });
}

// other
const rules: FormRules = {
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
    <n-space justify="center" style="margin-top: 7%">
        <n-card :title="$t('menu.signIn')" style="width: 500px">
            <n-form ref="formRef" :model="modelRef" :rules="rules">
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
                            <n-button type="primary" @click="handleSubmit">{{
                                $t('action.submit')
                            }}</n-button>
                        </div>
                    </n-col>
                </n-row>
            </n-form>
        </n-card>
    </n-space>
</template>

<style scoped></style>
