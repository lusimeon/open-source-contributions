<script setup lang="ts">
import type { Contributions } from '~~/types'

const colorMode = useColorMode()
const { data: contributions } = await useFetch<Contributions>('/api/contributions')

if (!contributions.value) {
  throw createError('Could not load User activity')
}

const { user, prs } = contributions.value
const userUrl = `https://github.com/${user.username}`

useHead({
  link: [
    { rel: 'icon', href: '/favicon.png' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'alternate', type: 'application/rss+xml', title: `${user.name}'s recent pull requests`, href: '/feed.xml' },
  ],
})
useSeoMeta({
  title: `${user.name} open-source contributions`,
  description: `${user.name} contributions on GitHub.`,
  ogTitle: `${user.name} contributions`,
  ogDescription: `${user.name} contributions on GitHub.`,
  twitterCard: 'summary_large_image',
  // Feel free to change this image with your own once deployed to NuxtHub
  ogImage: 'https://assets.hub.nuxt.com/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3Bycy5hdGludXguY29tIiwiaWF0IjoxNzI0MTYwMTkxfQ.yYRD-Gs6EyYQSfg27fZVx1Kle7nq7QBSciDui-mbnnU.jpg?theme=light',
  twitterImage: 'https://assets.hub.nuxt.com/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3Bycy5hdGludXguY29tIiwiaWF0IjoxNzI0MTYwMTkxfQ.yYRD-Gs6EyYQSfg27fZVx1Kle7nq7QBSciDui-mbnnU.jpg?theme=light',
})
// TODO: OG Image
</script>

<template>
  <UContainer class="p-4 sm:p-6 lg:p-8 lg:pt-10 max-w-3xl">
    <div class="flex flex-col items-center gap-2">
      <a :href="userUrl" target="_blank"><UAvatar
        :src="user.avatar"
        :alt="user.name"
        size="xl"
      />
      </a>
      <h1 class="text-2xl sm:text-3xl text-center">
        <a :href="userUrl" target="_blank">
          {{ user.name }}
        </a> <span class="text-blue-800">contributions</span>
      </h1>
      <p class="text-center text-gray-500 hover:text-gray-700">
        <NuxtLink :to="userUrl" target="_blank">
          @{{ user.username }}'s open-source contributions on GitHub.
        </NuxtLink>
      </p>
      <div class="flex items-center justify-center gap-1 text-gray-700">
        <UButton
          to="https://simeonlucas.fr/"
          external
          target="_blank"
          :aria-label="`${user.name}'s website`"
          icon="i-ph-link-duotone"
          color="gray"
          variant="link"
        />
        <UButton
          :to="userUrl"
          external
          target="_blank"
          :aria-label="`${user.name}'s GitHub profile`"
          icon="i-ph-github-logo-duotone"
          color="gray"
          variant="link"
        />
        <UButton
          to="/feed.xml"
          external
          target="_blank"
          aria-label="RSS Feed"
          icon="i-ph-rss-simple-duotone"
          color="gray"
          variant="link"
        />
      </div>
      <UDivider class="mt-2 sm:mt-6 mb-6 sm:mb-10 w-1/2 mx-auto" :ui="{ border: { base: 'flex border-gray-150' } }" />
    </div>

    <div class="flex flex-col gap-6 sm:gap-10">
      <PullRequest v-for="pr of prs" :key="pr.url" :data="pr" />
    </div>
  </UContainer>
</template>
