import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
    const prefix = 'theme';
    const theme = ref<string>('light');
    const isLight = ref<boolean>(true);
    const isDark = ref<boolean>(false);

    function loadTheme() {
        const localTheme = localStorage.getItem(prefix);
        if (localTheme != null) {
            theme.value = localTheme as string;
            isLight.value = theme.value === 'light';
            isDark.value = theme.value === 'dark';
        }
    }

    function saveTheme(theme: string) {
        localStorage.setItem(prefix, theme);
    }

    function changeTheme() {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
        saveTheme(theme.value);
    }

    loadTheme();

    return { theme, saveTheme, changeTheme, isLight, isDark };
});
