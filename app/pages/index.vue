<template>
  <div class="w-full h-full flex items-center justify-center text-center">
    <div>
      <p class="text-xl font-semibold mb-4">Select a Salesforce Instance</p>
      <AddInstance @new="loadAll" class="mt-4">
        <Button variant="default" class="w-full"
          >Add a Salesforce Instance</Button
        >
      </AddInstance>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AddInstance from "~/components/instances/AddInstance.vue";
import Button from "~/components/ui/button/Button.vue";
import { useCredentials } from "~/composables/useCredentials";
import Separator from "~/components/ui/separator/Separator.vue";

const { list, loading, error, loadAll } = useCredentials({ autoLoad: true });
</script>

<style></style>
