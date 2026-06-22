<template>
    <div class="bg-white min-h-screen flex flex-col">
        <Header />

        <main class="flex-1">
            <div class="container py-8 md:py-12 px-4 sm:px-6">
                <div class="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                    <div class="w-full lg:w-2/5 text-center lg:text-left">
                        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                            Welcome to <br> LindenCMS <span class="text-red-600">BETA</span>
                        </h1>
                        <p class="content mt-4 max-w-2xl lg:max-w-none mx-auto lg:mx-0">
                            A modern, open‑source PHP CMS built to accelerate development.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                            <a href="docs/" class="btn">
                                Quick Start
                                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                            <a href="https://github.com/kolodochka-dev/lindencms" class="btn btn_light" target="_blank">
                                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd"
                                        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.099 2.646.64.698 1.03 1.59 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                                GitHub
                            </a>
                        </div>
                    </div>

                    <div class="w-full lg:w-3/5">
                        <CodeBlock :tabs="codeTabs" />
                    </div>
                </div>
            </div>

            <section class="border-t border-gray-200">
                <div class="container py-16">
                    <div class="text-center mb-12">
                        <h2>Not just another CMS with static structure</h2>
                        <p class="content max-w-2xl mx-auto">
                            LindenCMS gives you the development speed of a traditional CMS with the flexibility of fully
                            custom code.
                            Designed to reduce development time while keeping your structure dynamic
                        </p>
                    </div>
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard v-for="feature in features" :key="feature.title" :icon="feature.icon"
                            :title="feature.title" :description="feature.description" />
                    </div>
                </div>
            </section>

            <section class="border-t border-gray-200 mt-8">
                <div class="container py-16 text-center">
                    <h2>We Need Your Feedback</h2>
                    <p class="content">
                        This project is developed by a single developer.
                        It's stable for testing, but still a work in progress.
                        Feedback, bug reports, and contributions are welcome — they'll help shape the roadmap.
                        Try it out and help to build a better CMS.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                        <a href="mailto:kolodochka.alesha@gmail.com?subject=LindenCMS%20Feedback" class="btn"
                            target="_blank">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Send Feedback
                        </a>
                        <a href="https://github.com/kolodochka-dev/lindencms/issues" class="btn btn_light"
                            target="_blank">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd"
                                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025.8-.223 1.65-.334 2.5-.334.85 0 1.7.111 2.5.334 1.91-1.294 2.75-1.025 2.75-1.025.545 1.376.201 2.393.099 2.646.64.698 1.03 1.59 1.03 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            GitHub Issues
                        </a>
                    </div>
                </div>
            </section>
        </main>

        <Footer />
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import FloatingPills from '@/components/FloatingPills.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import FeatureCard from '@/components/FeatureCard.vue'

const codeTabs = [
    {
        label: 'Step 1 - Declare',
        language: 'php',
        code: `#[View(
    label: 'Product', 
    icon: 'mdi:package-variant'
)]
class Product extends AppNode
{
    #[View(label: 'Product title')]
	public _String $title;
	
    #[View(label: 'Description')]
	public _Text $description;
	
	#[View(label: 'Price (USD)')]
	#[Validation('required|numeric|min:0')]
	public _Float $price;
}`
    },
    {
        label: 'Step 2 - Use',
        language: 'php',
        code: `Route::get('/product/{id}', AboutPage::class)->name('site.about');

class ProductPage extends Page
{
    #[Load(static fucntion (Product $node, Request $request) {
        $node->refresh($request->route('id'))
    })]
    public Product $product;
}

// Use in resources/views/pages/product-page.blade.php

`
    },
];

const features = [
    {
        // icon: '📝',
        title: 'Code-first Architecture',
        description: 'No GUI builders. Just PHP code.'
    },
    {
        title: 'Fast Development',
        description: 'Define once — get migrations, validation, and API automatically, without endless mapping.'
    },
    // {
    //     title: 'Composable Pages',
    //     description: 'Build pages by composing nodes. No repetitive controllers.'
    // },
    {
        title: 'Modern PHP 8.5',
        description: 'Attributes, closures, typed properties — everything modern PHP offers.'
    }
];

</script>