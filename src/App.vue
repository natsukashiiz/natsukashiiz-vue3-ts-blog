<script setup lang="ts">
import type { Component } from 'vue';
import { h, ref, computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import type { MenuOption, ConfigProviderProps } from 'naive-ui';
import {
    NAvatar,
    NButton,
    NDropdown,
    NIcon,
    NLayout,
    NLayoutFooter,
    NLayoutHeader,
    NLoadingBarProvider,
    NMenu,
    NMessageProvider,
    NModal,
    NSpace,
    NForm,
    NInput,
    darkTheme,
    lightTheme,
    createDiscreteApi,
    useMessage
} from 'naive-ui';
import {
    CreateOutline as CreateIcon,
    HomeOutline as HomeIcon,
    LogOutOutline as LogoutIcon,
    PersonCircleOutline as UserIcon,
    TimeOutline as TimeIcon
} from '@vicons/ionicons5';
import { useAuthStore } from '@/stores/AuthStore';
import { create } from '@/api/blog';
import router from '@/router';

const themeRef = ref<'light' | 'dark'>('dark');
const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
    theme: themeRef.value === 'light' ? lightTheme : darkTheme
}));
const { message, notification, dialog, loadingBar } = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar'],
    {
        configProviderProps: configProviderPropsRef
    }
);

const authStore = useAuthStore();
const activeKey = ref<string | null>(null);

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions: MenuOption[] = [
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'home'
                    }
                },
                { default: () => 'Home' }
            ),
        key: 'Home',
        icon: renderIcon(HomeIcon)
    }
];

const options: MenuOption[] = [
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'profile'
                    }
                },
                { default: () => 'Profile' }
            ),
        key: 'profile',
        icon: renderIcon(UserIcon)
    },
    {
        label: 'Create blog',
        key: 'createBlog',
        icon: renderIcon(CreateIcon),
        props: {
            onClick: () => (showModal.value = true)
        }
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: 'signHistory'
                    }
                },
                { default: () => 'Sign history' }
            ),
        key: 'signHistory',
        icon: renderIcon(TimeIcon)
    },
    {
        label: 'Logout',
        key: 'logout',
        icon: renderIcon(LogoutIcon),
        props: {
            onClick: () => handleLogout()
        }
    }
];

function handleLogout() {
    authStore.logout();
}

const showModal = ref(false);
const blogTitle = ref<string | null>(null);
async function submitCallback() {
    if (blogTitle.value === null) {
        message.error('null: ' + blogTitle.value);
        return false;
    } else {
        try {
            const res = await create({
                title: blogTitle.value,
                content: ''
            });
            if (res.status === 200 && res.data.code === 0) {
                if (res.data.result) {
                    await router.push(`/blog/${res.data.result.id}/editor`);
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
    <n-loading-bar-provider>
        <n-message-provider>
            <div style="height: 100vh; position: relative">
                <n-modal
                    v-model:show="showModal"
                    preset="dialog"
                    title="Create blog"
                    positive-text="Submit"
                    negative-text="Cancel"
                    @positive-click="submitCallback"
                >
                    <n-form inline>
                        <n-input v-model:value="blogTitle" placeholder="Enter title" />
                    </n-form>
                </n-modal>
                <n-layout position="absolute">
                    <n-layout-header style="height: 60px; padding: 12px" bordered>
                        <n-space justify="space-between">
                            <n-menu
                                v-model:value="activeKey"
                                mode="horizontal"
                                :options="menuOptions"
                            />
                            <div v-if="!authStore.isAuthenticated()">
                                <RouterLink :to="{ name: 'signIn' }" style="margin-right: 10px">
                                    <n-button type="default"> Sign In</n-button>
                                </RouterLink>
                                <RouterLink :to="{ name: 'signUp' }">
                                    <n-button type="primary"> Create a account</n-button>
                                </RouterLink>
                            </div>
                            <n-dropdown :options="options" v-else>
                                <n-avatar
                                    round
                                    size="medium"
                                    src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                                />
                            </n-dropdown>
                        </n-space>
                    </n-layout-header>
                    <RouterView />
                    <n-layout-footer
                        bordered
                        position="absolute"
                        style="height: 60px; padding: 12px"
                    >
                        Power by
                        <a target="_blank" href="https://github.com/natsukashiiz">ɴᴀᴛsᴜᴋᴀsʜɪɪᴢ </a>
                    </n-layout-footer>
                </n-layout>
            </div>
        </n-message-provider>
    </n-loading-bar-provider>
</template>
