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

const colourMode = useColorMode()

const items = [
    {
        title: "Cathedral (Production)",
        url: "#",
        icon: WifiSync,
        connected: false,
    },
    {
        title: "Cathedral (Sandbox)",
        url: "#",
        icon: WifiSync,
        connected: false,
    },
    {
        title: "Midland (Production)",
        url: "#",
        icon: WifiSync,
        connected: true,
    },
    {
        title: "Midland (Sandbox)",
        url: "#",
        icon: WifiSync,
        connected: false,
    },
];

</script>

<template>
    <Sidebar>
        <SidebarHeader class="flex items-center w-full flex-row p-2">
            <p class="text-xl text-sky-500 font-semibold">QueryForce</p>
            <AddInstance />
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem v-for="item in items" :key="item.title">
                            <SidebarMenuButton asChild>
                                <div :href="item.url" :class="{ 'text-green-500': item.connected }">
                                    <component :is="(!item.connected) ? item.icon : Wifi" />
                                    <span>{{ item.title }}</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem as-child>
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