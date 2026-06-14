<template>
    <div class="feature-card text-center p-6 rounded-xl border-2 hover:outline-6 outline-d5 border-d4 hover:shadow-md">
        <div class="feature-icon text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
            {{ icon }}
        </div>
        <h3 class="hover:text_light">{{ title }}</h3>
        <p class="text-gray-600 text-sm leading-relaxed">{{ description }}</p>
    </div>
</template>

<script setup>
defineProps({
    icon: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})
</script>

<style scoped>
.feature-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
    transform: translateY(-4px);
}
</style>