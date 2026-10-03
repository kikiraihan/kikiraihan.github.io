<script setup lang="ts">
const { profile } = useAppConfig()
</script>

<template>
  <section class="container-page mt-32 md:mt-48" aria-labelledby="about-preview">
    <div class="grid gap-10 md:grid-cols-12">
      <p class="eyebrow md:col-span-3">
        <span class="text-accent">05</span> / About
      </p>
      <div class="md:col-span-9">
        <h2 id="about-preview" v-reveal class="font-serif text-headline">
          Engineer by training, designer by habit, researcher at heart.
        </h2>
        <div v-reveal="{ delay: 0.1 }" class="mt-8 grid gap-6 text-ink-2 md:grid-cols-2">
          <p>
            {{ profile.shortName }} is what most people call me. I started as a graphic designer in a campus open-source community, moved into web development,
            and went deep into knowledge graphs and machine learning during my master's at IPB University.
          </p>
          <p>
            Today I build payment systems and backend services from Greater Jakarta — and I still care about how things look and feel.
          </p>
        </div>
        <AppButton v-reveal="{ delay: 0.2 }" to="/about" variant="ghost" icon="lucide:arrow-right" class="mt-6 -ml-5">
          More about me
        </AppButton>
      </div>
    </div>
  </section>
</template>
