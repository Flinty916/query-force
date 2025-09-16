<template>
  <section class="px-4">
    <p>Select Conn</p>
    {{ connection }}
  </section>
</template>

<script setup lang="ts">
const route = useRoute();
const connectionId = route.params.tab;

console.log(connectionId);

const { loadAll } = useCredentials();

let connection: Credentials | undefined;
if (connectionId)
  connection = (await loadAll()).find((c) => c.id === connectionId);
else createError("No Connection ID Present");
</script>
