<script setup lang="ts">
import { h, ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { MenuOption } from 'naive-ui';
import {
    BookmarksOutline as BookmarkIcon,
    CreateOutline as CreateIcon,
    HomeOutline as HomeIcon,
    LanguageOutline as LangIcon,
    LogInOutline as LoginIcon,
    LogOutOutline as LogoutIcon,
    MenuOutline as MenuIcon,
    MoonOutline as DarkIcon,
    PersonCircleOutline as UserIcon,
    SunnyOutline as LightIcon,
    TimeOutline as TimeIcon
} from '@vicons/ionicons5';
import { useAuthStore } from '@/stores/AuthStore';
import { useThemeStore } from '@/stores/ThemeStore';
import { avatarName, renderIcon, t, useIsMobile } from '@/tools/Comm';
import type { Option } from 'naive-ui/es/legacy-transfer/src/interface';

const emit = defineEmits<{
    openModal: [value: boolean];
}>();

// common
const authStore = useAuthStore();
const themeStore = useThemeStore();
const isMobile = useIsMobile();
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
                        name: 'bookmarks'
                    }
                },
                { default: t('menu.bookmarks') }
            ),
        key: 'bookmarks',
        icon: renderIcon(BookmarkIcon)
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
        label: t('menu.language'),
        key: 'Lang',
        icon: renderIcon(LangIcon),
        children: [
            {
                label: 'English',
                value: 'en',
                props: {
                    onClick: () => {
                        saveLangStore('en');
                        window.location.reload();
                    }
                }
            },
            {
                label: 'ไทย',
                value: 'th',
                props: {
                    onClick: () => {
                        saveLangStore('th');
                        window.location.reload();
                    }
                }
            },
            {
                label: '日本語',
                value: 'ja',
                props: {
                    onClick: () => {
                        saveLangStore('ja');
                        window.location.reload();
                    }
                }
            }
        ]
    },
    {
        label: t('menu.theme'),
        key: 'Theme',
        icon: renderIcon(themeStore.theme == 'light' ? LightIcon : DarkIcon),
        children: [
            {
                label: t('theme.light'),
                props: {
                    onClick: () => {
                        themeStore.saveTheme('light');
                        window.location.reload();
                    }
                }
            },
            {
                label: t('theme.dark'),
                props: {
                    onClick: () => {
                        themeStore.saveTheme('dark');
                        window.location.reload();
                    }
                }
            }
        ]
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
        icon: renderIcon(LoginIcon),
        show: !authStore.isAuthenticated()
    },
    {
        label: t('menu.profile'),
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
                disabled: true
            },
            {
                label: () =>
                    h(
                        RouterLink,
                        {
                            to: {
                                name: 'bookmarks'
                            }
                        },
                        { default: t('menu.bookmarks') }
                    ),
                key: 'bookmarks',
                icon: renderIcon(BookmarkIcon)
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
</script>

<template>
    <n-space :justify="isMobile ? 'space-between' : 'space-around'">
        <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
        <n-space v-if="!isMobile">
            <!-- theme -->
            <n-switch
                v-model:value="themeStore.isDark"
                @update:value="themeStore.changeTheme()"
                style="margin-top: 6px"
            >
                <template #checked-icon>
                    <n-icon :component="DarkIcon" />
                </template>
                <template #unchecked-icon>
                    <n-icon :component="LightIcon" />
                </template>
            </n-switch>
            <!-- select lang -->
            <n-select
                v-model:value="$i18n.locale"
                :options="langOptions"
                @update:value="saveLangStore"
                style="width: 88px"
            />
            <!-- show if not login -->
            <div v-if="!authStore.isAuthenticated()">
                <RouterLink :to="{ name: 'signIn' }">
                    <n-button type="primary">{{ $t('menu.signIn') }}</n-button>
                </RouterLink>
            </div>
            <!-- user drop down menu -->
            <n-dropdown :options="userMenu" v-else>
                <n-avatar round style="border: #ff5a99ff 2px solid">
                    {{ avatarName(authStore.payload?.name ?? '?') }}
                </n-avatar>
            </n-dropdown>
        </n-space>
        <n-dropdown v-else :options="mobileMenuOptions">
            <n-button text style="margin-top: 11px; margin-right: 20px">
                <n-icon size="large">
                    <MenuIcon />
                </n-icon>
            </n-button>
        </n-dropdown>
    </n-space>
</template>
