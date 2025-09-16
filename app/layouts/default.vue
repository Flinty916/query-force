<template>
  <SidebarProvider>
    <AppSidebar />
    <main>
      <Toaster />
      <SidebarTrigger />
      <slot />
      {{ list }}
    </main>
  </SidebarProvider>
</template>

<script lang="ts" setup>
import AppSidebar from '~/components/AppSidebar.vue';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
const { list, loading, error, save, loadAll } = useCredentials({ autoLoad: true })
</script>

<style></style>