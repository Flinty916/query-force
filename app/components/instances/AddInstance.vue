<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <div class="ml-auto border rounded cursor-pointer" @click="isOpen = true">
        <slot />
      </div>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>New Instance</DialogTitle>
        <DialogDescription>
          Provide client credentials to add a new Salesforce Instance to query.
        </DialogDescription>
      </DialogHeader>
      <form @submit="save" class="grid grid-cols-1 gap-y-4">
        <FormField v-slot="{ componentField }" name="label">
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="My SF Instance"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="url">
          <FormItem>
            <FormLabel>Instance URL</FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="https://my-salesforce.salesforce.com"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="clientId">
          <FormItem>
            <FormLabel>Client ID</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="clientSecret">
          <FormItem>
            <FormLabel>Client Secret</FormLabel>
            <FormControl>
              <Input type="password" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>
        <Button variant="outline" type="submit">Save Changes</Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { FormField } from "../ui/form";
import FormItem from "../ui/form/FormItem.vue";
import FormLabel from "../ui/form/FormLabel.vue";
import FormControl from "../ui/form/FormControl.vue";
import { invoke } from "@tauri-apps/api/core";
import type { Credentials } from "~/types";
import { toast } from "vue-sonner";

const isOpen = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    label: z.string().min(2).max(255),
    url: z.string(),
    clientId: z.string(),
    clientSecret: z.string(),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const emits = defineEmits(["new"]);

const save = form.handleSubmit(async (values) => {
  console.log("Submitted: ", values);
  console.log(Object.keys(values));
  await invoke("save_credentials", values);
  emits("new");
  toast("Salesforce Instance saved!", {
    description: new Date().toLocaleString(),
  });
  isOpen.value = false;
});

const load = async (label: string): Promise<Credentials> => {
  return await invoke<Credentials>("load_credentials", { label });
};

const loadAll = async (): Promise<Credentials[]> => {
  return await invoke<Credentials[]>("load_all_credentials");
};

const all = await loadAll();
</script>
