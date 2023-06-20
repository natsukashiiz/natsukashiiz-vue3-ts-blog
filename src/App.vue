<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterView } from 'vue-router';
import type { ConfigProviderProps } from 'naive-ui';
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

import MTopbar from '@/components/MTopbar.vue';
import MModalWrite from './components/MModalWrite.vue';
import MFooter from './components/MFooter.vue';

const themeRef = ref<'light' | 'dark'>('dark');
const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
    theme: themeRef.value === 'light' ? lightTheme : darkTheme
}));
createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar'], {
    configProviderProps: configProviderPropsRef
});

const showModalWrite = ref(false);
</script>

<template>
    <n-config-provider
        :locale="$i18n.locale == 'en' ? enUS : $i18n.locale == 'th' ? thTH : jaJP"
        :date-locale="$i18n.locale == 'en' ? dateEnUS : $i18n.locale == 'th' ? dateThTH : dateJaJP"
    >
        <n-loading-bar-provider>
            <n-message-provider>
                <!-- container -->
                <div style="height: 100vh; position: relative">
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
                </div>
            </n-message-provider>
        </n-loading-bar-provider>
    </n-config-provider>
</template>
