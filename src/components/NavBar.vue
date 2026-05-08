<script setup lang="ts">
// NavBar component — horizontal top navigation bar
// Uses Vue Router's <RouterLink> for client-side navigation without full page reloads
import { RouterLink } from 'vue-router'

// Define the navigation links as an array for easy maintenance
const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'History', to: '/history' },
  { name: 'Stats', to: '/stats' },
  { name: 'Goals', to: '/goals' },
]
</script>

<template>
  <!-- Top navigation bar, fixed height with bottom border -->
  <nav class="w-full bg-white border-b border-gray-200 px-8 py-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <!-- App title / logo -->
      <span class="text-xl font-bold text-gray-800">Student Budget</span>

      <!-- Navigation links -->
      <ul class="flex gap-6">
        <li v-for="link in navLinks" :key="link.name">
          <!--
            RouterLink renders an <a> tag that handles navigation internally.
            router-link-active class is automatically added when the route matches.
            'exact' prop on activeClass ensures Home only highlights on exact "/" match.
          -->
          <RouterLink
            :to="link.to"
            class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            active-class="text-blue-600 border-b-2 border-blue-600 pb-1"
            :exact="link.to === '/'"
          >
            {{ link.name }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
