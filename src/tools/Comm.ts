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

function htmlToBase64(html: string): string {
    const encoder = new TextEncoder();
    const data: Uint8Array = encoder.encode(html);
    const base64 = btoa(String.fromCharCode.apply(null, data));
    return base64;
}

function base64ToHtml(base64: string): string {
    var decodedData = atob(base64);
    var decoder = new TextDecoder();
    var html = decoder.decode(new Uint8Array([...decodedData].map((char) => char.charCodeAt(0))));
    return html;
}

export { textLimt, avatarName, renderIcon, htmlToBase64, base64ToHtml };
