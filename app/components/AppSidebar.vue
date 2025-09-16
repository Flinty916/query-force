<script setup lang="ts">
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from '@/components/ui/sidebar'
import SidebarGroupContent from './ui/sidebar/SidebarGroupContent.vue';
import SidebarMenu from './ui/sidebar/SidebarMenu.vue';
import SidebarMenuItem from './ui/sidebar/SidebarMenuItem.vue';
import SidebarMenuButton from './ui/sidebar/SidebarMenuButton.vue';
import Button from './ui/button/Button.vue';
import { MoonStar, Sun, Wifi, WifiSync, PlusCircle, PlusIcon } from 'lucide-vue-next';
import AddInstance from './instances/AddInstance.vue';

import { useConnectionsStore } from '@/stores/connections'
import { storeToRefs } from 'pinia'

const colourMode = useColorMode()

// credentials composable (talks to Tauri)
const { list, loading, error, loadAll } = useCredentials({ autoLoad: true })

// pinia store for connections
const connections = useConnectionsStore()
const { all } = storeToRefs(connections)

// whenever credentials list changes, sync into connections store
watch(list, (newList) => {
    if (!newList) return
    connections.setConnections(
        newList.map((cred: any) => ({
            id: cred.id,
            title: cred.label,
            url: '#',
            icon: WifiSync,
            connected: false, // default false until user connects
        }))
    )
}, { immediate: true })
</script>

<template>
    <Sidebar>
        <SidebarHeader class="flex items-center w-full flex-row p-2 border-b-4 bg-border">
            <p class="text-xl font-bold">QueryForce</p>
            <AddInstance @new="loadAll">
                <PlusCircle class="p-2" :size="36" />
            </AddInstance>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem v-if="all.length > 0" v-for="item in all" :key="item.title">
                            <SidebarMenuButton asChild>
                                <NuxtLink :to="`/${item.id}`" :class="{ 'text-green-500': item.connected }">
                                    <component :is="(!item.connected) ? item.icon : Wifi" />
                                    <span>{{ item.title }}</span>
                                </NuxtLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem as-child>
                        <SidebarMenuItem v-else class="text-center">
                            No Available Instances
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <Button variant="outline"
                @click="() => { (colourMode.value == 'dark') ? colourMode.preference = 'light' : colourMode.preference = 'dark' }">
                <MoonStar v-if="colourMode.value == 'dark'" :size="12" />
                <Sun v-else :size="12" />
                Colour Toggle
            </Button>
        </SidebarFooter>
    </Sidebar>

</template>