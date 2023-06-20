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
import { avatarName, renderIcon, t } from '@/tools/Comm';
import type { Option } from 'naive-ui/es/legacy-transfer/src/interface';

const emit = defineEmits<{
    openModal: [value: boolean];
}>();

// common
const authStore = useAuthStore();

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
                { default: () => t('menu.home') }
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
            onClick: () => emit('open-modal', true)
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
</script>

<template>
    <n-space justify="space-between">
        <n-menu mode="horizontal" :options="menuOptions" />
        <n-space>
            <!-- select lang -->
            <n-select
                :bordered="false"
                v-model:value="$i18n.locale"
                :options="langOptions"
                style="width: 100px"
            />
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
