<script setup lang="ts">
import { onMounted } from 'vue'
import { Leaf, Droplets, Sparkles, Wind } from 'lucide-vue-next'
import anime from 'animejs'
import { useProductsStore } from '@/stores/products'

const store = useProductsStore()

onMounted(() => {
  store.fetchProducts()

  anime({
    targets: '.triu-element',
    translateY: [30, 0],
    opacity: [0, 1],
    duration: 1000,
    easing: 'easeOutExpo',
    delay: anime.stagger(150)
  })
})
</script>

<template>
  <div class="px-6 py-12 md:py-32 max-w-7xl mx-auto min-h-screen">
    <div class="max-w-4xl mb-32">
      <div class="triu-element text-xs font-mono uppercase tracking-widest text-naturals mb-8">TRIU Naturals</div>
      <h1 class="triu-element text-5xl md:text-8xl mb-8 font-serif">Rooted in<br/>tradition.</h1>
      <p class="triu-element text-xl md:text-2xl text-foreground/70 font-light leading-relaxed max-w-2xl">
        Chemical-free care returning to the essentials. We curate natural products that respect both heritage and biological utility.
      </p>
    </div>

    <div v-if="store.loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div 
        v-for="i in 3"
        :key="i"
        class="triu-element border border-foreground/10 p-8 md:p-12 bg-background"
      >
        <div class="w-24 h-4 bg-neutral-100 animate-pulse mb-12 rounded"></div>
        <div class="w-full aspect-square bg-neutral-100 animate-pulse mb-8 rounded"></div>
        <div class="w-3/4 h-8 bg-neutral-100 animate-pulse mb-4 rounded"></div>
        <div class="w-1/2 h-6 bg-neutral-100 animate-pulse mb-4 rounded"></div>
        <div class="w-full h-12 bg-neutral-100 animate-pulse rounded"></div>
      </div>
    </div>

    <div v-else-if="store.error" class="text-center py-24 triu-element">
      <p class="text-foreground mb-4">Could not load products. Please try again.</p>
      <button
        @click="store.fetchProducts()"
        class="bg-foreground text-background px-6 py-2 uppercase tracking-widest text-sm hover:bg-foreground/80 transition-colors" v-ripple
      >
        Retry
      </button>
    </div>

    <div v-else-if="store.products.length === 0" class="triu-element">
      <div class="text-center py-24 border border-foreground/10 bg-background/50 mb-16 flex flex-col items-center">
        <h2 class="text-foreground text-3xl md:text-5xl font-serif mb-4">Curated by Request</h2>
        <p class="text-foreground/80 text-sm md:text-base uppercase tracking-widest font-mono mb-6">Available exclusively on order. Limited batch production.</p>
        <p class="text-foreground/60 max-w-2xl text-center leading-relaxed mb-10">
          Every TRIU product is handcrafted in small quantities. We do not maintain standing inventory. Place an inquiry to reserve your selection and receive a personal confirmation within 24 hours.
        </p>
        <router-link
          to="/contact?source=triu"
          class="bg-foreground text-background px-8 py-3.5 rounded-full text-sm font-medium hover:bg-foreground/80 transition-colors uppercase tracking-widest inline-flex items-center justify-center" v-ripple
        >
          Reserve Your Order
        </router-link>
      </div>

      <div class="pt-16 border-t border-foreground/10 text-center">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div class="flex flex-col items-center group">
            <div class="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4 group-hover:bg-naturals/5 transition-colors" v-ripple>
              <Leaf class="w-8 h-8 text-naturals opacity-80" />
            </div>
            <span class="text-sm font-serif text-foreground">Neem & Basil</span>
          </div>
          <div class="flex flex-col items-center group">
            <div class="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4 group-hover:bg-naturals/5 transition-colors" v-ripple>
              <Droplets class="w-8 h-8 text-naturals opacity-80" />
            </div>
            <span class="text-sm font-serif text-foreground">Rose Water</span>
          </div>
          <div class="flex flex-col items-center group">
            <div class="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4 group-hover:bg-naturals/5 transition-colors" v-ripple>
              <Sparkles class="w-8 h-8 text-naturals opacity-80" />
            </div>
            <span class="text-sm font-serif text-foreground">Herbal Hair Oil</span>
          </div>
          <div class="flex flex-col items-center group">
            <div class="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4 group-hover:bg-naturals/5 transition-colors" v-ripple>
              <Wind class="w-8 h-8 text-naturals opacity-80" />
            </div>
            <span class="text-sm font-serif text-foreground">Amla Blend</span>
          </div>
        </div>
        <p class="text-xs text-foreground/40 mt-12 font-mono uppercase tracking-widest">Current formulations. Subject to seasonal availability.</p>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        v-for="product in store.products"
        :key="product.$id"
        @click="store.openProductPanel(product)"
        class="triu-element group border border-foreground/10 p-8 md:p-12 hover:border-naturals transition-colors duration-500 bg-background cursor-pointer relative"
        v-card-tilt
      >
        <div class="flex justify-between items-start mb-12">
          <div class="text-xs font-mono uppercase tracking-widest text-naturals">{{ product.category }}</div>
          <div class="text-[10px] font-mono uppercase tracking-widest bg-neutral-100 px-2 py-1 text-neutral-600 border border-neutral-200">Limited Stock</div>
        </div>

        <div v-if="product.imageFileId" class="w-full aspect-square bg-neutral-100 border border-neutral-200 overflow-hidden mb-8">
          <img
            :src="store.getImageUrl(product.imageFileId)"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <h3 class="text-3xl mb-2 font-serif">{{ product.name }}</h3>
        <div v-if="product.price" class="text-xl mb-4 font-medium text-foreground">₹{{ product.price.toFixed(2) }}</div>
        <p class="text-foreground/70 mb-8">{{ product.description }}</p>

        <router-link
          :to="`/contact?product=${encodeURIComponent(product.name)}&source=triu`"
          @click.stop
          class="inline-block mt-auto w-full text-center border border-neutral-300 text-foreground px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-neutral-900 hover:text-white transition-colors" v-ripple
        >
          Reserve This Item
        </router-link>
      </div>
    </div>
  </div>
</template>
