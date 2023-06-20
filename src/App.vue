<script setup lang="ts">
import { h, ref, computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import type { MenuOption, ConfigProviderProps } from 'naive-ui';
import {
    darkTheme,
    lightTheme,
    createDiscreteApi,
    thTH,
    dateThTH,
    NConfigProvider
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
import { avatarName, renderIcon, htmlToBase64 } from '@/tools/Comm';

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

const lang = ref('English');
const authStore = useAuthStore();

const langOptions = [
    {
        label: 'English',
        value: 'enUs'
    },
    {
        label: 'ไทย',
        value: 'thTh'
    }
];

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
                        path: `/@${authStore.payload?.name}`
                    }
                },
                { default: () => 'Profile' }
            ),
        key: 'profile',
        icon: renderIcon(UserIcon)
    },
    {
        label: 'Write',
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
                content: htmlToBase64('## Hello World.')
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
    <n-config-provider :locale="thTH" :date-locale="dateThTH">
        <n-loading-bar-provider>
            <n-message-provider>
                <div style="height: 100vh; position: relative">
                    <!-- modal write -->
                    <n-modal
                        v-model:show="showModal"
                        preset="dialog"
                        title="Write"
                        positive-text="Submit"
                        negative-text="Cancel"
                        @positive-click="submitCallback"
                    >
                        <n-form inline>
                            <n-input v-model:value="blogTitle" placeholder="Enter title" />
                        </n-form>
                    </n-modal>
                    <n-layout position="absolute">
                        <!-- header -->
                        <n-layout-header style="height: 60px; padding: 12px" bordered>
                            <!-- topbar -->
                            <n-space justify="space-between">
                                <n-menu mode="horizontal" :options="menuOptions" />
                                <n-space>
                                    <n-popselect
                                        v-model:value="lang"
                                        :options="langOptions"
                                        :on-update:value="(val:string) => lang = langOptions.find(e=>e.value==val)?.label ?? 'English'"
                                    >
                                        <n-button>{{ lang }}</n-button>
                                    </n-popselect>
                                    <div v-if="!authStore.isAuthenticated()">
                                        <RouterLink
                                            :to="{ name: 'signIn' }"
                                            style="margin-right: 10px"
                                        >
                                            <n-button type="default"> Sign In</n-button>
                                        </RouterLink>
                                        <RouterLink :to="{ name: 'signUp' }">
                                            <n-button type="primary"> Create a account</n-button>
                                        </RouterLink>
                                    </div>
                                    <n-dropdown :options="options" v-else>
                                        <n-avatar round>
                                            {{ avatarName(authStore.payload?.name ?? '?') }}
                                        </n-avatar>
                                    </n-dropdown>
                                </n-space>
                            </n-space>
                        </n-layout-header>
                        <!-- content -->
                        <RouterView />
                        <!-- footer -->
                        <n-layout-footer
                            bordered
                            position="absolute"
                            style="height: 50px; padding: 12px"
                        >
                            Power by
                            <a target="_blank" href="https://github.com/natsukashiiz"
                                >ɴᴀᴛsᴜᴋᴀsʜɪɪᴢ
                            </a>
                        </n-layout-footer>
                    </n-layout>
                </div>
            </n-message-provider>
        </n-loading-bar-provider>
    </n-config-provider>
</template>
