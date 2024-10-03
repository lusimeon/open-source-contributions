<script setup>
const {public} = useRuntimeConfig();
  
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  script: [
    { src: 'https://analytics.simeonlucas.fr/umami.js', "data-website-id": public.umamiWebsiteId ?? '' },
  ],
})
</script>

<template>
  <ClientOnly>
    <Cursor />
  </ClientOnly>
  <NuxtPage />
  <p class="text-center py-6 pb-10 text-sm">
    <UButton
      to="https://github.com/atinux/my-pull-requests"
      target="_blank"
      color="black"
      size="xs"
      icon="i-simple-icons-github"
    >
      Create my own contributions page
    </UButton>
  </p>
</template>

<style lang="postcss">
body {
  @apply min-h-screen text-gray-700 font-sans;
  background-color: #fbfefb;
  font-family: IBM Plex Mono, monospace;
  color: #282728;
}
</style>
