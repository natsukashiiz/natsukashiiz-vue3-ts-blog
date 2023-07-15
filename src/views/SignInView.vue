<script setup lang="ts">
// import
import { onBeforeMount, ref } from 'vue';
import type { FormInst, FormRules, FormValidationError } from 'naive-ui';
import { useLoadingBar, useMessage, type TabsInst } from 'naive-ui';
import type { SigninRequest, SignupRequest } from '@/api';
import { useAuthStore } from '@/stores/AuthStore';
import { signUp } from '@/api/auth';
import { t, useIsMobile, updateTitle } from '@/tools/Comm';

const authStore = useAuthStore();
const message = useMessage();
const loading = useLoadingBar();
const isMobile = useIsMobile();

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
                    // await router.push({ name: 'home' });
                    window.location.href = '/';
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
            message: 'Minimum is 4 and Maximum is 30 characters',
            min: 4,
            max: 30
        }
    ],
    password: [
        {
            required: true,
            message: 'Minimum is 6 and Maximum is 30 characters',
            min: 6,
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
            message: 'Minimum is 4 and Maximum is 30 characters',
            min: 4,
            max: 30
        }
    ],
    password: [
        {
            required: true,
            message: 'Minimum is 6 and Maximum is 30 characters',
            min: 6,
            max: 30
        }
    ],
    rePassword: [
        {
            required: true,
            message: 'Minimum is 6 and Maximum is 30 characters',
            min: 6,
            max: 30
        }
    ]
};

onBeforeMount(() => {
    updateTitle('Sign in');
});
</script>

<template>
    <n-space justify="center" :style="{ 'margin-top': isMobile ? '5vh' : '10vh' }">
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
                                show-password-on="click"
                                type="password"
                                @keydown.enter.prevent
                            />
                        </n-form-item>
                    </n-form>
                    <n-button @click="handleSignIn" type="primary" block secondary strong>{{
                        $t('menu.signIn')
                    }}</n-button>
                    <n-space justify="end" style="margin-top: 5px">
                        <a href="#forgot">{{ $t('common.forgotPassword') }}</a>
                    </n-space>
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
                                show-password-on="click"
                                type="password"
                                @keydown.enter.prevent
                            />
                        </n-form-item>
                        <n-form-item path="rePassword" :label="$t('common.rePassword')">
                            <n-input
                                v-model:value="signUpForm.rePassword"
                                show-password-on="click"
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
