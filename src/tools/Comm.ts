import { type Component, h } from 'vue';
import { NIcon } from 'naive-ui';

function textLimt(text: string, limit: number): string {
    return text.substring(0, limit) + (text.length > limit ? '...' : '');
}

function avatarName(text: string): string {
    return text.substring(0, 1).toUpperCase();
}

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

export { textLimt, avatarName, renderIcon };
