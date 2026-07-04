<script setup lang="ts">
import { onMounted } from 'vue'
import { Linkedin, Github, Instagram, Mail } from 'lucide-vue-next'
import anime from 'animejs'

onMounted(() => {
  anime({
    targets: '.about-element',
    translateY: [30, 0],
    opacity: [0, 1],
    duration: 1000,
    easing: 'easeOutExpo',
    delay: anime.stagger(150)
  })
})
</script>

<template>
  <div class="px-6 py-12 md:py-32 max-w-7xl mx-auto min-h-screen flex items-center">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 w-full">
      <div class="flex flex-col justify-center">
        <div class="about-element text-xs font-mono uppercase tracking-widest text-foreground/50 mb-8">The Studio</div>
        <h1 class="about-element text-5xl md:text-8xl mb-8 font-serif">Structure &<br/>Substance.</h1>
        <p class="about-element text-xl text-foreground/70 font-light leading-relaxed mb-6">
          SALTEDHASH operates as an umbrella brand, synthesizing logic with nature. We believe the same principles that govern a robust software architecture can be applied to creating sustainable natural products.
        </p>
        <p class="about-element text-lg text-foreground/70 font-light leading-relaxed">
          It is about stripping away the unnecessary, leaving only what is functional, beautiful, and enduring.
        </p>
      </div>

      <div class="group relative bg-background border border-foreground/10 p-8 md:p-12 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" v-card-tilt>
        <div class="about-element text-xs font-mono uppercase tracking-widest text-foreground/50 mb-12">The Founder</div>
        <h3 class="about-element text-3xl mb-6">Vinay</h3>
        <p class="about-element text-foreground/70 mb-8 leading-relaxed">
          Blending BTech AI/ML logic with deep roots in Indian natural e-commerce. The vision is to build a system where technology scales tradition, and tradition grounds technology.
        </p>
        <div class="about-element text-xs font-mono uppercase tracking-widest text-foreground/40 mb-6 md:mb-0">Architect / Curator</div>

        <div class="md:absolute md:bottom-8 md:left-12 md:right-12 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out flex items-center gap-4 md:mt-0 mt-8 pt-6 md:pt-0 border-t border-neutral-200 md:border-none md:justify-end">
          <a href="https://linkedin.com/in/vinay-saltedhash" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-[#0077b5] hover:border-[#0077b5] transition-colors">
            <Linkedin class="w-4 h-4" />
          </a>
          <a href="https://github.com/triu-official" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-[#333] hover:border-[#333] transition-colors">
            <Github class="w-4 h-4" />
          </a>
          <a href="https://instagram.com/saltedhash" target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-[#E1306C] hover:border-[#E1306C] transition-colors">
            <Instagram class="w-4 h-4" />
          </a>
          <a href="mailto:jdqnx.test@inbox.testmail.app" class="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-tech hover:border-tech transition-colors">
            <Mail class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
