<script setup lang="ts">
// import
import { ref } from 'vue';
import type { FormInst, FormRules, FormValidationError } from 'naive-ui';
import { useLoadingBar, useMessage, type TabsInst } from 'naive-ui';
import { useRouter } from 'vue-router';
import type { SigninRequest, SignupRequest } from '@/api';
import { useAuthStore } from '@/stores/AuthStore';
import { signUp } from '@/api/auth';
import { t } from '@/tools/Comm';

const router = useRouter();
const authStore = useAuthStore();
const message = useMessage();
const loading = useLoadingBar();

// variable
const tabsInstRef = ref<TabsInst | null>(null);
const tabsRef = ref(['signin', 'signup']);
const tabValue = ref(tabsRef.value[0]);

const formRef = ref<FormInst | null>(null);
const signInForm = ref<SigninRequest>({
    username: null,
    password: null
});

interface REGISTER extends SignupRequest {
    rePassword: string | null;
}

const signUpForm = ref<REGISTER>({
    email: null,
    username: null,
    password: null,
    rePassword: null
});

// functions
function handleSignIn(e: MouseEvent) {
    e.preventDefault();
    formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
        if (!errors) {
            loading.start();
            try {
                const res = await authStore.login(signInForm.value);
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
        }
    });
}

function handleSignUp(e: MouseEvent) {
    e.preventDefault();
    formRef.value?.validate(async (errors: Array<FormValidationError> | undefined) => {
        if (signUpForm.value.password != signUpForm.value.rePassword) {
            message.error(t('common.passwordNotMatch'));
            return;
        }
        if (!errors) {
            loading.start();
            try {
                const res = await signUp(signUpForm.value);
                if (res.status === 200 && res.data.code === 0) {
                    loading.finish();
                    // await router.push({ name: 'signIn' });
                    message.success(t('common.success'));
                    tabValue.value = tabsRef.value[0];
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

const signUpRules: FormRules = {
    email: [
        {
            required: true,
            message: 'Email is required'
        }
    ],
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
    ],
    rePassword: [
        {
            required: true,
            message: 'Re Enter Password is required',
            min: 8,
            max: 30
        }
    ]
};
</script>

<template>
    <n-space justify="center" style="margin-top: 10vh">
        <n-card style="width: 1000px">
            <n-tabs
                ref="tabsInstRef"
                v-model:value="tabValue"
                size="large"
                justify-content="space-evenly"
                animated
            >
                <n-tab-pane name="signin" :tab="$t('menu.signIn')">
                    <n-form ref="formRef" :model="signInForm" :rules="signInRules">
                        <n-form-item path="username" :label="$t('common.username')">
                            <n-input v-model:value="signInForm.username" @keydown.enter.prevent />
                        </n-form-item>
                        <n-form-item path="password" :label="$t('common.password')">
                            <n-input
                                v-model:value="signInForm.password"
                                type="password"
                                @keydown.enter.prevent
                            />
                        </n-form-item>
                    </n-form>
                    <n-button @click="handleSignIn" type="primary" block secondary strong>{{
                        $t('menu.signIn')
                    }}</n-button>
                </n-tab-pane>
                <n-tab-pane name="signup" :tab="$t('menu.signUp')">
                    <n-form ref="formRef" :model="signUpForm" :rules="signUpRules">
                        <n-form-item path="email" :label="$t('common.email')">
                            <n-input v-model:value="signUpForm.email" @keydown.enter.prevent />
                        </n-form-item>
                        <n-form-item path="username" :label="$t('common.username')">
                            <n-input v-model:value="signUpForm.username" @keydown.enter.prevent />
                        </n-form-item>
                        <n-form-item path="password" :label="$t('common.password')">
                            <n-input
                                v-model:value="signUpForm.password"
                                type="password"
                                @keydown.enter.prevent
                            />
                        </n-form-item>
                        <n-form-item path="rePassword" :label="$t('common.rePassword')">
                            <n-input
                                v-model:value="signUpForm.rePassword"
                                type="password"
                                @keydown.enter.prevent
                            />
                        </n-form-item>
                    </n-form>
                    <n-button @click="handleSignUp" type="primary" block secondary strong>{{
                        $t('menu.signUp')
                    }}</n-button>
                </n-tab-pane>
            </n-tabs>
        </n-card>
    </n-space>
</template>
