<template>
    <nav class="fixed top-0 w-full z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center gap-2">
                    <span class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LindenCMS</span>
                </div>
                <div class="hidden md:flex gap-8">
                    <router-link to="/" class="text-gray-300 hover:text-primary transition">Home</router-link>
                    <router-link to="/getting-started" class="text-gray-300 hover:text-primary transition">Getting Started</router-link>
                    <router-link to="/core" class="text-gray-300 hover:text-primary transition">Core</router-link>
                    <router-link to="/templator" class="text-gray-300 hover:text-primary transition">Templator</router-link>
                    <router-link to="/cms" class="text-gray-300 hover:text-primary transition">CMS</router-link>
                </div>
                <a href="https://github.com/kolodochkaorigin/lindencms" target="_blank" class="text-gray-300 hover:text-primary transition flex items-center gap-1">
                    <iconify-icon icon="mdi:github" class="text-xl"></iconify-icon>
                    <span class="hidden sm:inline">GitHub</span>
                </a>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.router-link-active {
    color: #509caf;
}
</style>