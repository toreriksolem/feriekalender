<template>
  <main class="min-h-screen bg-pink-300 flex flex-col items-center justify-start">
    <div class="w-full">
      <div class="bg-rebeccapurple text-white p-4 text-center text-lg font-bold">
        🌞 Feriekalender for venninner 🏖️
      </div>

      <TimelineTable />
    </div>
  </main>
</template>

<script setup>
import TimelineTable from './components/TimelineTable.vue'
</script>
