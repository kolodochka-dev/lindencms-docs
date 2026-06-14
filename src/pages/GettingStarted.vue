<template>
    <div class="min-h-screen bg-gray-50">
        <NavBar />
        <div class="max-w-4xl mx-auto px-6 py-12">
            <h1 class="text-4xl font-bold mb-6">Getting Started</h1>
            
            <h2 class="text-2xl font-semibold mt-8 mb-4">Installation</h2>
            <CodeBlock code="composer require lindencms/cms" language="bash" />
            
            <h2 class="text-2xl font-semibold mt-8 mb-4">Publish Assets</h2>
            <CodeBlock code="php artisan vendor:publish --tag=lindencms-assets" language="bash" />
            
            <h2 class="text-2xl font-semibold mt-8 mb-4">Run Migrations</h2>
            <CodeBlock code="php artisan migrate" language="bash" />
            
            <h2 class="text-2xl font-semibold mt-8 mb-4">Install CMS</h2>
            <CodeBlock code="php artisan lindencms:install" language="bash" />
            
            <div class="mt-12 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-blue-800">✅ After installation, visit <code class="bg-blue-100 px-2 py-0.5 rounded">/cms</code> to access the dashboard.</p>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import CodeBlock from '../components/CodeBlock.vue'
</script>