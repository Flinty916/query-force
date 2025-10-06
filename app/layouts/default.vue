<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="w-full">
      <Toaster />
      <div class="w-full border-b-2 flex items-center mb-2 h-14">
        <SidebarTrigger class="ml-2 mt-2" />
        <NuxtLink class="m-2 ml-auto" to="/">
          <Button variant="outline">
            <Home class="" /> Home
          </Button>
        </NuxtLink>
      </div>
      <slot />
    </main>
  </SidebarProvider>
</template>

<script lang="ts" setup>
import AppSidebar from "~/components/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";
import { Home } from "lucide-vue-next";
import Button from "~/components/ui/button/Button.vue";
const { list, loading, error, save, loadAll } = useCredentials({
  autoLoad: true,
});
</script>

<style></style>
