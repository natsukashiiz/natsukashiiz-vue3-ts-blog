<script setup lang="ts">
import { avatarName } from '@/tools/Comm';
import { ref } from 'vue';
const props = defineProps<{
    vertical?: boolean;
    showTitile?: boolean;
    uid?: number;
    name?: string;
    avatar?: string;
    showName?: boolean;
    canPreview?: boolean;
    size?: number;
}>();

const showModalRef = ref<boolean>(false);

function handlePreview() {
    if (props.canPreview) showModalRef.value = true;
}
</script>

<template>
    <n-modal v-model:show="showModalRef" preset="card" style="width: 600px">
        <img :src="avatar" style="width: 100%" />
    </n-modal>
    <n-space :vertical="vertical" align="center">
        <n-avatar
            v-if="avatar"
            @click="handlePreview"
            round
            :src="avatar"
            style="cursor: pointer"
            :size="size"
            lazy
        />
        <n-avatar v-else round :size="size">
            {{ avatarName(name || '?') }}
        </n-avatar>
        <div v-if="showName">
            <n-text strong> {{ name }} </n-text>
        </div>
        <div v-if="showTitile">{{ uid ? 'UID' + ': ' : '' }} {{ uid }}</div>
        <div v-if="showTitile">
            {{ name ? $t('common.name') + ': ' + name : '' }}
        </div>
    </n-space>
</template>

<style scoped>
.n-avatar {
    font-size: 50px;
}
</style>
