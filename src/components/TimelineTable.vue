<template>
    <div class="bg-pink-300">
  
        <div class="m-4 flex space-x-2">
            <!-- Legg til ferie-knapp -->
            <button
                @click="showAddModal = true"
                class="bg-rebeccapurple text-white font-semibold px-4 py-2 rounded shadow hover:bg-purple-700"
            >
                Legg til ferie
            </button>

            <!-- rediger ferie-knapp -->
            <button
                @click="showEditModal = true"
                class="bg-pink-500 text-white font-semibold px-4 py-2 rounded shadow hover:bg-pink-600"
            >
                Rediger ferie
            </button>

            <!-- rediger ferie-knapp -->
                <button
                @click="showEditModal = true"
                class="bg-pink-500 text-white font-semibold px-4 py-2 rounded shadow hover:bg-pink-600"
            >
                Tulleknapp
            </button>
        </div>  

  
       <!-- Tabell -->
        <div class="overflow-x-auto max-w-full">
            <table class="table-auto border-collapse min-w-[800px]">

                <thead>
                <tr>
                    <!-- Empty top-left corner cell -->
                    <th class="sticky left-0 bg-pink-300 z-10 px-2 py-1"></th>

                    <!-- Date columns -->
                    <th
                    v-for="date in dates"
                    :key="date"
                    class="px-2 py-1 text-xs"
                    :class="{ 'bg-pink-400': isWeekend(date) }"
                    >
                    <div
                        class="text-xs transform -rotate-45 origin-bottom-left whitespace-nowrap">
                           {{ formatDisplayDate(date) }}
                    </div>
                    </th>
                </tr>
                </thead>


                <tbody>
                <tr
                    v-for="(friend, index) in friends"
                    :key="friend.name"
                    :class="{
                    'bg-pink-200': index % 2 === 0,
                    'bg-pink-300': index % 2 === 1
                    }"
                >
                    <td
                    class="sticky left-0 z-10 px-2 py-1 font-bold whitespace-nowrap bg-inherit"
                    >
                    {{ friend.name }}
                    </td>

                    <td
                    v-for="date in dates"
                    :key="date"
                    class="w-8 h-8 text-center border"
                    :class="[
                        index % 2 === 0 ? 'border-pink-300' : 'border-pink-200',
                        isOnHoliday(friend, date) ? 'bg-rebeccapurple' : ''
                    ]"
                    ></td>
                </tr>
                </tbody>

            </table>
        </div>

  
      <!-- Modal: Legg til ferie -->
      <div
        v-if="showAddModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-pink-300 p-6 rounded shadow w-96">
          <h2 class="text-lg font-bold mb-4">Legg til ferie</h2>
  
          <div class="grid grid-cols-2 gap-4 items-center">
            <!-- Navn -->
            <div class="font-semibold">Navn</div>
            <div>
              <input
                type="text"
                v-model="newHoliday.name"
                class="p-2 w-full rounded"
                placeholder="Skriv navn"
              >
            </div>
  
            <!-- Ferie -->
            <div class="font-semibold col-span-2 mt-4">Ferie</div>
  
            <div class="text-sm font-medium">Avreisedato</div>
            <div>
              <input
                type="date"
                v-model="newHoliday.startDate"
                class="p-2 rounded w-full"
              >
            </div>
  
            <div class="text-sm font-medium">Returdato</div>
            <div>
              <input
                type="date"
                v-model="newHoliday.endDate"
                class="p-2 rounded w-full"
              >
            </div>
          </div>
  
          <!-- Modal buttons -->
          <div class="flex justify-end space-x-2 mt-6">
            <button
              @click="showAddModal = false"
              class="px-3 py-1 bg-gray-300 rounded"
            >
              Avbryt
            </button>
            <button
              @click="addHoliday"
              class="px-3 py-1 bg-rebeccapurple text-white rounded"
            >
              Lagre
            </button>
          </div>
        </div>
      </div>

        <!-- Modal: Rediger ferie -->
        <div
        v-if="showEditModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
        <div class="bg-pink-300 p-6 rounded shadow w-96">
            <h2 class="text-lg font-bold mb-4">Rediger ferie</h2>

            <div v-if="friends.length === 0" class="text-gray-600">Ingen ferier registrert ennå.</div>

            <div v-for="friend in friends" :key="friend.name" class="mb-4">
            <div class="font-semibold">{{ friend.name }} {{ getRandomIcon() }}{{ getRandomIcon() }} </div>
                <ul class="ml-4 list-disc">
                    <li
                    v-for="(holiday, index) in friend.holidays"
                    :key="index"
                    class="flex justify-between items-center"
                    >
                    <span>{{ holiday.start }} → {{ holiday.end }}</span>
                    <button
                        @click="deleteHoliday(friend.name, index)"
                        class="text-red-500 text-sm px-2 py-1 hover:text-red-700"
                    >
                        🗑️
                    </button>
                    </li>
                </ul>
            </div>

            <div class="flex justify-end space-x-2 mt-4">
            <button
                @click="showEditModal = false"
                class="px-3 py-1 bg-gray-300 rounded"
            >
                Lukk
            </button>
            </div>
        </div>
        </div>

  
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'

  const summerIcons = [
  "🌞", // Sunshine
  "🌴", // Palm tree
  "🏖️", // Beach with umbrella
  "🏕️", // Camping
  "✈️", // Airplane
  "🚗", // Road trip
  "🚢", // Cruise
  "🎢", // Amusement park
  "🍦", // Ice cream
  "🏊‍♀️", // Swimming
  "🎒", // Backpack / Hiking
  "🏞️", // Nature / Outdoors
  "🎠", // Carousel
  "🐚", // Seashell
  "🏄‍♀️"  // Surfing
]

  
  const LOCAL_STORAGE_KEY = 'feriekalender-v1'
  
  const showAddModal = ref(false)
  const showEditModal = ref(false)
  
  const newHoliday = ref({
    name: '',
    startDate: '',
    endDate: ''
  })
  
  // Watch for startDate changes → update endDate = startDate + 1 day
  watch(() => newHoliday.value.startDate, (newStartDate) => {
    if (newStartDate) {
      const start = new Date(newStartDate)
      const nextDay = new Date(start)
      nextDay.setDate(start.getDate() + 1)
  
      const year = nextDay.getFullYear()
      const month = (nextDay.getMonth() + 1).toString().padStart(2, '0')
      const day = nextDay.getDate().toString().padStart(2, '0')
      const formattedNextDay = `${year}-${month}-${day}`
  
      if (
        !newHoliday.value.endDate ||
        newHoliday.value.endDate < newStartDate
      ) {
        newHoliday.value.endDate = formattedNextDay
      }
    }
  })
  
  // Load friends from localStorage (or empty)
  const friends = ref(loadFriends())
  
  function loadFriends() {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }
  
  function saveFriends() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(friends.value))
  }
  
  function addHoliday() {
    console.log('Saving holiday:', newHoliday.value)
  
    let friend = friends.value.find(f => f.name === newHoliday.value.name)
  
    if (!friend) {
      friend = { name: newHoliday.value.name, holidays: [] }
      friends.value.push(friend)
    }
  
    friend.holidays.push({
      start: newHoliday.value.startDate,
      end: newHoliday.value.endDate
    })
  
    saveFriends()
  
    showAddModal.value = false
  
    newHoliday.value = { name: '', startDate: '', endDate: '' }
  }
  
  // --- Date helpers ---
  
  function formatDate(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  function formatDisplayDate(dateStr) {
    const d = new Date(dateStr)
    const formatted = d.toLocaleDateString('nb-NO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
  }
  
  function isWeekend(dateStr) {
    const d = new Date(dateStr)
    const day = d.getDay()
    return day === 0 || day === 6
  }
  
  function isOnHoliday(friend, dateStr) {
    return friend.holidays.some(period => {
      return dateStr >= period.start && dateStr <= period.end
    })
  }
  
  function deleteHoliday(friendName, holidayIndex) {
    const friend = friends.value.find(f => f.name === friendName)
    if (!friend) return
  
    friend.holidays.splice(holidayIndex, 1)
  
    if (friend.holidays.length === 0) {
      friends.value = friends.value.filter(f => f.name !== friendName)
    }
  
    saveFriends()
  }

  function getRandomIcon() {
  const index = Math.floor(Math.random() * summerIcons.length)
  return summerIcons[index]
}

  
  // --- Create dates array ---
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 1)
  const endDate = new Date('2025-08-20')
  
  const dates = ref([])
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.value.push(formatDate(new Date(d)))
  }
  </script>
  
  