import { type Component, h } from 'vue';
import { NIcon } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useBreakpoint, useMemo } from 'vooks';

export function textLimt(text: string, limit: number): string {
    return text.substring(0, limit) + (text.length > limit ? '...' : '');
}

export function avatarName(text: string): string {
    return text.substring(0, 1).toUpperCase();
}

export function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

export function htmlToBase64(html: string): string {
    const encoder = new TextEncoder();
    const data: Uint8Array = encoder.encode(html);
    const base64 = btoa(String.fromCharCode.apply(null, data));
    return base64;
}

export function base64ToHtml(base64: string): string {
    const decodedData = atob(base64);
    const decoder = new TextDecoder();
    const html = decoder.decode(new Uint8Array([...decodedData].map((char) => char.charCodeAt(0))));
    return html;
}

export function t(str: string) {
    return () => useI18n().t(str);
}

export function useIsMobile() {
    const breakpointRef = useBreakpoint();
    return useMemo(() => {
        return breakpointRef.value === 'xs';
    });
}

export function useIsTablet() {
    const breakpointRef = useBreakpoint();
    return useMemo(() => {
        return breakpointRef.value === 's';
    });
}

export function useIsSmallDesktop() {
    const breakpointRef = useBreakpoint();
    return useMemo(() => {
        return breakpointRef.value === 'm';
    });
}

export function colorFormText(text: string): { background: string; text: string } {
    let hashCode = 0;
    for (let i = 0; i < text.length; i++) {
        hashCode = (hashCode << 5) - hashCode + text.charCodeAt(i);
        hashCode &= hashCode; // Convert to 32-bit integer
    }

    const randomBackgroundColor = '#' + ((hashCode >>> 0) % 0xffffff).toString(16).padStart(6, '0');

    // Generate contrasting text color for light background
    const textColor = '#000000';

    return { background: randomBackgroundColor, text: textColor };
}
