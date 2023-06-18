import { type Component, h } from 'vue';
import { NIcon } from 'naive-ui';

export function textLimt(text: string, limit: number): string {
    return text.substring(0, limit) + (text.length > limit ? '...' : '');
}

export function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}
