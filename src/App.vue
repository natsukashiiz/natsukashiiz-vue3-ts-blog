<script setup lang="ts">
import type { Component } from "vue";
import { h, ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import type { MenuOption } from "naive-ui";
import {
  NAvatar,
  NButton,
  NDropdown,
  NIcon,
  NLayout,
  NLayoutFooter,
  NLayoutHeader,
  NLoadingBarProvider,
  NMenu,
  NMessageProvider,
  NSpace
} from "naive-ui";
import {
  HomeOutline as HomeIcon,
  LogOutOutline as LogoutIcon,
  PersonCircleOutline as UserIcon,
  TimeOutline as TimeIcon
} from "@vicons/ionicons5";
import { useAuthStore } from "@/stores/AuthStore";

const authStore = useAuthStore();
const activeKey = ref<string | null>(null);

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "home"
          }
        },
        { default: () => "Home" }
      ),
    key: "Home",
    icon: renderIcon(HomeIcon)
  }
];

const options: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "profile"
          }
        },
        { default: () => "Profile" }
      ),
    key: "profile",
    icon: renderIcon(UserIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "signHistory"
          }
        },
        { default: () => "Sign history" }
      ),
    key: "signHistory",
    icon: renderIcon(TimeIcon)
  },
  // {
  //   label: "Edit Profile",
  //   key: "editProfile",
  //   icon: renderIcon(EditIcon)
  // },
  {
    label: "Logout",
    key: "logout",
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
  <n-loading-bar-provider>
    <n-message-provider>
      <div style="height: 100vh; position: relative">
        <n-layout position="absolute">
          <n-layout-header style="height: 60px; padding: 12px" bordered>
            <n-space justify="space-between">
              <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
              <div v-if="!authStore.isAuthenticated()">
                <RouterLink :to="{name: 'signIn'}" style="margin-right: 10px;">
                  <n-button type="default">
                    Sign In
                  </n-button>
                </RouterLink>
                <RouterLink :to="{name: 'signUp'}">
                  <n-button type="primary">
                    Create a account
                  </n-button>
                </RouterLink>
              </div>
              <n-dropdown :options="options" v-else>
                <n-avatar
                  round
                  size="medium"
                  src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                />
              </n-dropdown>
            </n-space>
          </n-layout-header>
          <RouterView />
          <n-layout-footer
            bordered
            position="absolute"
            style="height: 60px; padding: 12px"
          >
            Power by <a target="_blank" href="https://github.com/natsukashiiz">ɴᴀᴛsᴜᴋᴀsʜɪɪᴢ
          </a>
          </n-layout-footer>
        </n-layout>
      </div>
    </n-message-provider>
  </n-loading-bar-provider>
</template>
