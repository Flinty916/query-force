<template>
    <Dialog>
        <DialogTrigger as-child>
            <div class="ml-auto border rounded cursor-pointer">
                <PlusCircle class="p-2" :size="36" />
            </div>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>New Instance</DialogTitle>
                <DialogDescription>
                    Provide client credentials to add a new Salesforce Instance to query.
                </DialogDescription>
            </DialogHeader>
            <div class="grid grid-cols-1 gap-y-4">
                <div class="flex flex-col space-y-2">
                    <Label for="name">Label</Label>
                    <Input type="text" id="name">Instance Name</Input>
                </div>
                <div class="flex flex-col space-y-2">
                    <Label for="url">URL</Label>
                    <Input type="url" id="url">Instance URL</Input>
                </div>
                <div class="flex flex-col space-y-2">
                    <Label for="client_id">Client ID</Label>
                    <Input type="text" id="client_id">ID Key</Input>
                </div>
                <div class="flex flex-col space-y-2">
                    <Label for="client_secret">Client Secret</Label>
                    <Input type="password" id="client_secret">Secret Key</Input>
                </div>
            </div>
            <DialogFooter>
                <Button class="w-full">
                    Save changes
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-vue-next"
</script>