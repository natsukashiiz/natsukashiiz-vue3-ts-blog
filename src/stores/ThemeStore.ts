import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
    const prefix = 'theme';
    const theme = ref<string>('light');

    async function loadTheme() {
        const localTheme = localStorage.getItem(prefix);
        if (localTheme != null) {
            theme.value = localTheme as string;
        }
    }

    function changeTheme() {
        console.log('1: ' + theme.value);
        theme.value = theme.value === 'light' ? 'dark' : 'light';
        console.log('2: ' + theme.value);
        localStorage.setItem(prefix, theme.value);
    }

    loadTheme();

    return { theme, changeTheme };
});