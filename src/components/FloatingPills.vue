<template>
    <div 
        class="relative w-full h-full overflow-visible" 
        @mousemove="handleMouseMove" 
        @mouseleave="resetPills"
        ref="containerRef"
    >
        <div class="absolute inset-0 overflow-visible">
            <div
                v-for="(pill, index) in pills"
                :key="index"
                class="pill absolute px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium whitespace-nowrap shadow-sm"
                :style="{
                    top: `${pill.y}%`,
                    left: `${pill.x}%`,
                    transform: `translate(${pill.currentX}px, ${pill.currentY}px)`,
                    zIndex: pill.zIndex,
                    transition: 'transform 0.08s linear',
                }"
            >
                {{ pill.label }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref(null)

const pills = ref([])

const generatePills = () => {
    const baseLabels = [
        'Attributes', 'Declarativity', 'Fast Development', 'Scalable',
        'Code-first', 'Dynamic', 'PHP 8.5', 'Open Source', 'Modern',
        'Flexible', 'Extensible', 'Modular', 'Secure', 'Lightweight'
    ]
    
    const pillsArray = []
    const pillCount = Math.floor(Math.random() * 10) + 20
    
    for (let i = 0; i < pillCount; i++) {
        const x = Math.random() * 90 + 5
        const y = Math.random() * 90 + 5
        
        // Params for floating animation
        const floatSpeedX = (Math.random() - 0.5) * 0.4
        const floatSpeedY = (Math.random() - 0.5) * 0.4
        const floatRangeX = Math.random() * 20 + 15
        const floatRangeY = Math.random() * 20 + 15
        const floatPhaseX = Math.random() * Math.PI * 2
        const floatPhaseY = Math.random() * Math.PI * 2
        
        pillsArray.push({
            label: baseLabels[Math.floor(Math.random() * baseLabels.length)],
            x: x,
            y: y,
            // Current position
            currentX: 0,
            currentY: 0,
            // Target position (attraction)
            targetX: 0,
            targetY: 0,
            zIndex: Math.floor(Math.random() * 50) + 1,
            // Floating animation params
            floatSpeedX: floatSpeedX,
            floatSpeedY: floatSpeedY,
            floatRangeX: floatRangeX,
            floatRangeY: floatRangeY,
            floatPhaseX: floatPhaseX,
            floatPhaseY: floatPhaseY,
            originalX: x,
            originalY: y,
        })
    }
    
    return pillsArray
}

pills.value = generatePills()

const mouseX = ref(0)
const mouseY = ref(0)
const containerRect = ref(null)
let mouseInside = false
let floatTime = 0

const handleMouseMove = (event) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    mouseX.value = event.clientX - rect.left
    mouseY.value = event.clientY - rect.top
    containerRect.value = rect
    mouseInside = true
    
    updateAttractionTargets()
}

const updateAttractionTargets = () => {
    if (!containerRect.value) return
    
    pills.value.forEach((pill) => {
        const pillXPx = (pill.originalX / 100) * containerRect.value.width
        const pillYPx = (pill.originalY / 100) * containerRect.value.height
        
        const dx = mouseX.value - pillXPx
        const dy = mouseY.value - pillYPx
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 200
        const maxOffset = 35
        
        if (mouseInside && distance < maxDistance && distance > 3) {
            // Attract toward cursor
            const factor = (1 - distance / maxDistance)
            const strength = factor * maxOffset
            pill.targetX = dx * (strength / 60)
            pill.targetY = dy * (strength / 60)
        } else {
            pill.targetX = 0
            pill.targetY = 0
        }
    })
}

const resetPills = () => {
    mouseInside = false
    pills.value.forEach((pill) => {
        pill.targetX = 0
        pill.targetY = 0
    })
}

// Main animation loop
let animationFrame

const animatePills = () => {
    floatTime += 0.016
    
    pills.value.forEach((pill) => {
        // 1. Floating motion (sinusoidal)
        const floatX = Math.sin(floatTime * pill.floatSpeedX + pill.floatPhaseX) * pill.floatRangeX
        const floatY = Math.cos(floatTime * pill.floatSpeedY + pill.floatPhaseY) * pill.floatRangeY
        
        // 2. Blend floating + attraction
        let targetX = floatX
        let targetY = floatY
        
        if (mouseInside && (pill.targetX !== 0 || pill.targetY !== 0)) {
            // When mouse is inside, attraction overrides floating
            targetX = pill.targetX
            targetY = pill.targetY
        }
        
        // Smooth transition to target
        pill.currentX += (targetX - pill.currentX) * 0.12
        pill.currentY += (targetY - pill.currentY) * 0.12
    })
    
    animationFrame = requestAnimationFrame(animatePills)
}

onMounted(() => {
    animatePills()
})

onUnmounted(() => {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame)
    }
})
</script>

<style scoped>
.pill {
    backdrop-filter: blur(4px);
    cursor: default;
    pointer-events: none;
    user-select: none;
    will-change: transform;
}

.overflow-visible {
    overflow: visible !important;
}
</style>