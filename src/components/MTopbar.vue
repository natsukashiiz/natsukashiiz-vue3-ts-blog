<script setup lang="ts">
import { h } from 'vue';
import { RouterLink } from 'vue-router';
import type { MenuOption } from 'naive-ui';
import {
    CreateOutline as CreateIcon,
    HomeOutline as HomeIcon,
    LogOutOutline as LogoutIcon,
    PersonCircleOutline as UserIcon,
    TimeOutline as TimeIcon
} from '@vicons/ionicons5';
import { useAuthStore } from '@/stores/AuthStore';
import { useThemeStore } from '@/stores/ThemeStore';
import { avatarName, renderIcon, t } from '@/tools/Comm';
import type { Option } from 'naive-ui/es/legacy-transfer/src/interface';

const emit = defineEmits<{
    openModal: [value: boolean];
}>();

// common
const authStore = useAuthStore();
const themeStore = useThemeStore();

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

function saveLangStore(value: string) {
    localStorage.setItem('lang', value);
}
</script>

<template>
    <n-space justify="space-around">
        <n-menu mode="horizontal" :options="menuOptions" />
        <n-space>
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
                <RouterLink :to="{ name: 'signUp' }" style="margin-right: 10px">
                    <n-button type="primary">{{ $t('menu.signUp') }}</n-button>
                </RouterLink>
                <RouterLink :to="{ name: 'signIn' }">
                    <n-button type="default">{{ $t('menu.signIn') }}</n-button>
                </RouterLink>
            </div>
            <!-- user drop down menu -->
            <n-dropdown :options="userMenu" v-else>
                <n-avatar round>
                    {{ avatarName(authStore.payload?.name ?? '?') }}
                </n-avatar>
            </n-dropdown>
        </n-space>
    </n-space>
</template>
