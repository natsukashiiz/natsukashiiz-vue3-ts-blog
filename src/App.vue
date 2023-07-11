<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterView } from 'vue-router';
import type { ConfigProviderProps } from 'naive-ui';
import themeOverrides from '@/theme'
import {
    darkTheme,
    lightTheme,
    createDiscreteApi,
    enUS,
    dateEnUS,
    thTH,
    dateThTH,
    jaJP,
    dateJaJP,
    NConfigProvider
} from 'naive-ui';
import { useThemeStore } from '@/stores/ThemeStore';

import MTopbar from '@/components/MTopbar.vue';
import MModalWrite from './components/MModalWrite.vue';
import MFooter from './components/MFooter.vue';

const themeRef = ref<string>('light');
const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
    theme: themeRef.value === 'light' ? lightTheme : darkTheme
}));
createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar'], {
    configProviderProps: configProviderPropsRef
});

const showModalWrite = ref(false);
const themeStore = useThemeStore();
</script>

<template>
    <n-config-provider
        :theme="themeStore.theme === 'light' ? lightTheme : darkTheme"
        :theme-overrides="themeOverrides"
        :locale="$i18n.locale == 'en' ? enUS : $i18n.locale == 'th' ? thTH : jaJP"
        :date-locale="$i18n.locale == 'en' ? dateEnUS : $i18n.locale == 'th' ? dateThTH : dateJaJP"
    >
        <n-loading-bar-provider>
            <n-message-provider>
                <n-notification-provider>
                    <n-dialog-provider>
                        <!-- modal write -->
                        <MModalWrite v-model:show="showModalWrite" />
                        <!-- main -->
                        <n-layout position="absolute">
                            <!-- header -->
                            <n-layout-header style="height: 60px; padding: 12px" bordered>
                                <!-- topbar -->
                                <MTopbar @open-modal="(open) => (showModalWrite = open)" />
                            </n-layout-header>
                            <!-- content -->
                            <RouterView />
                            <!-- footer -->
                            <MFooter />
                        </n-layout>
                    </n-dialog-provider>
                </n-notification-provider>
            </n-message-provider>
        </n-loading-bar-provider>
    </n-config-provider>
</template>
