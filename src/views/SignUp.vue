<script setup lang="ts">
// import
import { ref } from "vue";
import type { FormInst, FormRules, FormValidationError } from "naive-ui";
import { NButton, NCard, NCol, NForm, NFormItem, NInput, NRow, NSpace, useMessage } from "naive-ui";
import { useRouter } from "vue-router";
import type { SignupRequest } from "@/api";

const router = useRouter();

// variable
const formRef = ref<FormInst | null>(null);
const modelRef = ref<SignupRequest>({
  email: null,
  username: null,
  password: null
});

// functions
function handleSubmit(e: MouseEvent) {
  const message = useMessage();
  e.preventDefault();
  formRef.value?.validate(
    (errors: Array<FormValidationError> | undefined) => {
      if (!errors) {
        // message.success("Valid");
        router.push({ name: "profile" });
      } else {
        console.log(errors);
        message.error("Invalid");
      }
    }
  );
}

// other
const rules: FormRules = {
  email: [
    {
      required: true,
      message: "Email is required"
    }
  ],
  username: [
    {
      required: true,
      message: "Username is required"
    }
  ],
  password: [
    {
      required: true,
      message: "Password is required"
    }
  ]
};
</script>

<template>
  <n-space justify="center" style="margin-top: 20vh">
    <n-card title="Sign Up" style="width: 500px">
      <n-form ref="formRef" :model="modelRef" :rules="rules">
        <n-form-item path="email" label="Email">
          <n-input v-model:value="modelRef.email" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="username" label="Username">
          <n-input v-model:value="modelRef.username" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="password" label="Password">
          <n-input
            v-model:value="modelRef.password"
            type="password"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button
                roundee
                type="primary"
                @click="handleSubmit"
              >
                Submit
              </n-button>
            </div>
          </n-col>
        </n-row>
      </n-form>
    </n-card>
    <pre>{{ JSON.stringify(model, null, 2) }}
</pre>
  </n-space>
</template>

<style scoped>

</style>