<script setup lang="ts">
import { onMounted, ref } from 'vue'
import anime from 'animejs'
import { ArrowRight } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products'

const showGallery = ref(false)
const store = useProductsStore()

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 800,
          easing: 'easeOutExpo'
        })
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.venture-card').forEach(card => {
    observer.observe(card)
  })

  anime({
    targets: '.hero-text',
    translateY: [50, 0],
    opacity: [0, 1],
    duration: 1200,
    easing: 'easeOutExpo',
    delay: anime.stagger(200)
  })
  setTimeout(() => { showGallery.value = true }, 1200)
})
</script>

<template>
  <main class="pt-16">
    <!-- Hero -->
    <section class="min-h-[90vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto py-24">
      <div class="hero-text opacity-0 text-xs font-mono uppercase tracking-[0.3em] text-tech mb-6 flex items-center gap-3">
        <span class="inline-block w-8 h-px bg-tech"></span>
        Venture Studio · Problem-First
      </div>
      <h1 class="hero-text opacity-0 text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-tighter font-serif mb-8 max-w-5xl">
        The system<br/>builds itself.
      </h1>
      <p class="hero-text opacity-0 text-lg md:text-2xl text-neutral-500 max-w-2xl font-light leading-relaxed mb-12">
        SALTEDHASH is a venture studio and brand umbrella. We build intelligent software systems and curate natural essentials — guided by elegant utility.
      </p>
      <div class="hero-text opacity-0 flex flex-wrap gap-4">
        <router-link to="/studio" class="group flex items-center gap-2 bg-neutral-900 text-white px-7 py-3.5 text-sm uppercase tracking-widest font-medium hover:bg-tech transition-all duration-300" v-ripple>
          Enter Studio <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </router-link>
        <router-link to="/triu" class="group flex items-center gap-2 border border-neutral-200 px-7 py-3.5 text-sm uppercase tracking-widest font-medium hover:border-naturals hover:text-naturals transition-all duration-300" v-ripple>
          TRIU Naturals <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </router-link>
      </div>
    </section>

    <!-- 2D Product Gallery -->
    <section class="relative h-[65vh] min-h-[480px] overflow-hidden bg-neutral-950">
      <Transition
        enter-active-class="transition-all duration-600 ease-out"
        enter-from-class="opacity-0 translate-y-[30px]"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-[30px]"
      >
        <div v-if="showGallery" class="w-full h-full flex items-center overflow-x-auto overflow-y-hidden px-8 py-12 gap-8 snap-x snap-mandatory hide-scrollbar">
          <div
            v-for="product in (store.products.length ? store.products : store.fallbackProducts).slice(0, 5)"
            :key="product.$id"
            @click="store.openProductPanel(product)"
            class="shrink-0 w-72 h-96 bg-[#FAF9F6] border border-neutral-300 rounded-lg p-6 flex flex-col justify-between cursor-pointer snap-center hover:scale-[1.02] transition-transform shadow-lg relative overflow-hidden"
            v-card-tilt
          >
            <div class="absolute left-0 top-0 bottom-0 w-1.5" :style="{ backgroundColor: product.category === 'natural' ? '#2F4F2F' : (product.category === 'tech' ? '#233CB5' : '#666') }"></div>
            <div>
              <div class="text-[11px] font-mono tracking-widest text-neutral-500 mb-6 uppercase ml-2">{{ product.category || 'uncategorized' }}</div>
              <h3 class="font-serif text-2xl font-bold text-neutral-900 leading-tight">{{ product.name }}</h3>
            </div>
            <div class="mt-auto pt-6">
              <div v-if="product.price" class="text-lg font-medium text-neutral-800">₹{{ product.price.toFixed(2) }}</div>
              <div class="text-[10px] font-mono text-neutral-500 mt-4 text-right">{{ product.brand_code }}</div>
            </div>
          </div>
        </div>
      </Transition>
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-xs font-mono uppercase tracking-widest pointer-events-none">
        Scroll to browse · Click a product to view
      </div>
    </section>

    <!-- Ventures -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 px-6 py-24 max-w-7xl mx-auto">
      <router-link to="/studio" class="venture-card opacity-0 group relative overflow-hidden bg-background border border-neutral-200 p-10 md:p-14 hover:border-tech transition-colors duration-500 min-h-[380px] flex flex-col justify-between" v-card-tilt>
        <div class="absolute inset-0 bg-tech/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        <div class="relative z-10">
          <div class="text-xs font-mono uppercase tracking-widest text-tech mb-4">01 — Services</div>
          <h2 class="font-serif text-4xl md:text-5xl mb-6">Tech & AI/ML</h2>
          <p class="text-neutral-500 max-w-md leading-relaxed">Software automation, AI-driven solutions, and digital strategy to scale your operations efficiently.</p>
        </div>
        <div class="relative z-10 flex items-center gap-2 text-sm uppercase tracking-widest mt-12 font-medium text-tech opacity-0 group-hover:opacity-100 transition-opacity">
          Enter Studio <ArrowRight class="w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </div>
      </router-link>

      <router-link to="/triu" class="venture-card opacity-0 group relative overflow-hidden bg-background border border-neutral-200 p-10 md:p-14 hover:border-naturals transition-colors duration-500 min-h-[380px] flex flex-col justify-between" v-card-tilt>
        <div class="absolute inset-0 bg-naturals/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        <div class="relative z-10">
          <div class="text-xs font-mono uppercase tracking-widest text-naturals mb-4">02 — Products</div>
          <h2 class="font-serif text-4xl md:text-5xl mb-6">TRIU Naturals</h2>
          <p class="text-neutral-500 max-w-md leading-relaxed">Chemical-free care rooted in tradition. Pure neem, rose, and natural utility products for everyday rituals.</p>
        </div>
        <div class="relative z-10 flex items-center gap-2 text-sm uppercase tracking-widest mt-12 font-medium text-naturals opacity-0 group-hover:opacity-100 transition-opacity">
          Explore Catalog <ArrowRight class="w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </div>
      </router-link>

      <router-link to="/studio" class="venture-card opacity-0 group relative overflow-hidden bg-background border border-neutral-200 p-10 md:p-14 hover:border-marketing transition-colors duration-500 min-h-[380px] flex flex-col justify-between" v-card-tilt>
        <div class="absolute inset-0 bg-marketing/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        <div class="relative z-10">
          <div class="text-xs font-mono uppercase tracking-widest text-marketing mb-4">03 — Marketing</div>
          <h2 class="font-serif text-4xl md:text-5xl mb-6">Shri Nandi Marketing</h2>
          <p class="text-neutral-500 max-w-md leading-relaxed">Data-driven growth, digital presence, and brand strategy for businesses ready to scale. Powered by field-tested marketing operations.</p>
        </div>
        <div class="relative z-10 flex items-center gap-2 text-sm uppercase tracking-widest mt-12 font-medium text-marketing opacity-0 group-hover:opacity-100 transition-opacity">
          View Services <ArrowRight class="w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </div>
      </router-link>
    </section>

    <!-- CTA Band -->
    <section class="bg-neutral-900 text-white py-20 px-6 text-center">
      <h3 class="font-serif text-4xl md:text-6xl mb-6">A problem-first product lab.</h3>
      <router-link to="/contact" class="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-medium hover:text-neutral-300 transition-colors" v-ripple>
        Work with us <ArrowRight class="w-4 h-4" />
      </router-link>
    </section>
  </main>
</template>
