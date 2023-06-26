<script setup lang="ts">
import { h, ref, watch } from 'vue';
import { RouterLink, onBeforeRouteUpdate } from 'vue-router';
import type { MenuOption } from 'naive-ui';
import {
    CreateOutline as CreateIcon,
    HomeOutline as HomeIcon,
    LogOutOutline as LogoutIcon,
    PersonCircleOutline as UserIcon,
    TimeOutline as TimeIcon,
    MenuOutline as MenuIcon
} from '@vicons/ionicons5';
import { useAuthStore } from '@/stores/AuthStore';
import { useThemeStore } from '@/stores/ThemeStore';
import { avatarName, renderIcon, t, useIsMobile, useIsTablet } from '@/tools/Comm';
import type { Option } from 'naive-ui/es/legacy-transfer/src/interface';

const emit = defineEmits<{
    openModal: [value: boolean];
}>();

// common
const authStore = useAuthStore();
const themeStore = useThemeStore();
const isMobile = useIsMobile();
const isTablet = useIsTablet();
const activeKey = ref<string | null>(null);

const langOptions: Option[] = [
    {
        label: 'English',
        value: 'en'
    },
    {
        label: 'ไทย',
        value: 'th'
    },
    {
        label: '日本語',
        value: 'ja'
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
                { default: t('menu.home') }
            ),
        key: 'Home',
        icon: renderIcon(HomeIcon)
    }
];

const userMenu: MenuOption[] = [
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: `/@${authStore.payload?.name}`
                    }
                },
                { default: t('menu.profile') }
            ),
        key: 'profile',
        icon: renderIcon(UserIcon)
    },
    {
        label: t('menu.write'),
        key: 'createBlog',
        icon: renderIcon(CreateIcon),
        props: {
            onClick: () => emit('openModal', true)
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
                { default: t('menu.signHistory') }
            ),
        key: 'signHistory',
        icon: renderIcon(TimeIcon)
    },
    {
        label: t('menu.logout'),
        key: 'logout',
        icon: renderIcon(LogoutIcon),
        props: {
            onClick: () => authStore.logout()
        }
    }
];

const mobileMenuOptions: MenuOption[] = [
    {
        label: 'Lang',
        key: 'Lang',
        icon: renderIcon(HomeIcon),
        children: [
            {
                label: 'English',
                value: 'en'
            },
            {
                label: 'ไทย',
                value: 'th'
            },
            {
                label: '日本語',
                value: 'ja'
            }
        ]
    },
    {
        label: themeStore.theme.toUpperCase(),
        key: 'Theme',
        icon: renderIcon(HomeIcon),
        props: {
            onClick: () => themeStore.changeTheme()
        }
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: `/sign-in`
                    }
                },
                { default: t('menu.signIn') }
            ),
        key: 'singIn',
        icon: renderIcon(UserIcon),
        show: !authStore.isAuthenticated()
    },
    {
        label: 'Profile',
        key: 'Profile',
        icon: renderIcon(UserIcon),
        show: authStore.isAuthenticated(),
        children: [
            {
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                path: `/@${authStore.payload?.name}`
                            }
                        },
                        { default: t('menu.profile') }
                    ),
                key: 'profile',
                icon: renderIcon(UserIcon)
            },
            {
                label: t('menu.write'),
                key: 'createBlog',
                icon: renderIcon(CreateIcon),
                props: {
                    onClick: () => emit('openModal', true)
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
                        { default: t('menu.signHistory') }
                    ),
                key: 'signHistory',
                icon: renderIcon(TimeIcon)
            },
            {
                label: t('menu.logout'),
                key: 'logout',
                icon: renderIcon(LogoutIcon),
                props: {
                    onClick: () => authStore.logout()
                }
            }
        ]
    }
];

function saveLangStore(value: string) {
    localStorage.setItem('lang', value);
}

watch(
    () => authStore.isAuthenticated(),
    (x) => {
        console.log({ x });
    }
);
</script>

<template>
    <n-space :justify="isMobile ? 'space-between' : 'space-around'">
        <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
        <n-space v-if="!isMobile">
            <!-- select lang -->
            <n-select
                :bordered="false"
                v-model:value="$i18n.locale"
                :options="langOptions"
                @update:value="saveLangStore"
                style="width: 100px"
            />
            <n-button @click="themeStore.changeTheme()" style="text-transform: capitalize">{{
                themeStore.theme
            }}</n-button>
            <!-- show if not login -->
            <div v-if="!authStore.isAuthenticated()">
                <RouterLink :to="{ name: 'signIn' }">
                    <n-button type="primary">{{ $t('menu.signIn') }}</n-button>
                </RouterLink>
            </div>
            <!-- user drop down menu -->
            <n-dropdown :options="userMenu" v-else>
                <n-avatar round>
                    {{ avatarName(authStore.payload?.name ?? '?') }}
                </n-avatar>
            </n-dropdown>
        </n-space>
        <n-dropdown v-else :options="mobileMenuOptions">
            <n-icon size="large" style="margin-top: 5px"><MenuIcon /></n-icon>
        </n-dropdown>
    </n-space>
</template>
