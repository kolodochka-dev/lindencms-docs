<template>
    <div class="rounded-xl overflow-hidden border border-gray-200 min-h-[450px] my-4 shadow">
        <div class="flex justify-between items-center gap-4 p-2 bg-gray-50 border-b border-gray-200">
            <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2">
                    <button
                        v-for="(tab, index) in tabs"
                        :key="index"
                        @click="activeTab = index"
                        :class="[
                            'tab-btn',
                            activeTab === index ? 'tab-btn-active' : 'tab-btn-inactive'
                        ]"
                    >
                        {{ tab.label }}
                    </button>
                </div>
                <div v-if="currentTabDescription" class="text-xs text-gray-500 mt-1 ml-1 leading-relaxed">
                    {{ currentTabDescription }}
                </div>
            </div>
            <button @click="copyCode" class="flex-shrink-0 bg-white border border-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-md cursor-pointer transition-all duration-150">
                <span v-if="!copied">Copy</span>
                <span v-else>✓ Copied</span>
            </button>
        </div>
        <pre class="m-0 p-4 overflow-x-auto font-mono text-sm leading-relaxed bg-white"><code v-html="highlightedCode" class="font-mono"></code></pre>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import hljs from 'highlight.js/lib/core'
import php from 'highlight.js/lib/languages/php'
import bash from 'highlight.js/lib/languages/bash'
import 'highlight.js/styles/github.css'

hljs.registerLanguage('php', php)
hljs.registerLanguage('bash', bash)

const props = defineProps({
    tabs: {
        type: Array,
        required: true,
        default: () => []
    },
    activeTabIndex: {
        type: Number,
        default: 0
    }
})

const activeTab = ref(props.activeTabIndex)
const copied = ref(false)

const currentCode = computed(() => {
    const tab = props.tabs[activeTab.value]
    return tab ? tab.code : ''
})

const currentLanguage = computed(() => {
    const tab = props.tabs[activeTab.value]
    return tab ? tab.language : 'php'
})

const currentTabDescription = computed(() => {
    const tab = props.tabs[activeTab.value]
    return tab ? tab.description : ''
})

const highlightedCode = computed(() => {
    if (!currentCode.value) return ''
    const lang = hljs.getLanguage(currentLanguage.value) ? currentLanguage.value : 'php'
    return hljs.highlight(currentCode.value, { language: lang }).value
})

const copyCode = async () => {
    await navigator.clipboard.writeText(currentCode.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
}

watch(() => props.activeTabIndex, (newIndex) => {
    if (newIndex !== undefined && newIndex !== activeTab.value) {
        activeTab.value = newIndex
    }
})
</script>

<style scoped>
.tab-btn {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.375rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.15s ease;
    background: transparent;
    border: none;
}

.tab-btn-active {
    background: #dee3ea;
    color: #1e293b;
    font-weight: 600;
}

.tab-btn-inactive {
    color: #64748b;
}

.tab-btn-inactive:hover {
    background: #f1f5f9;
    color: #334155;
}

:deep(.hljs-attr) {
    font-weight: 900 !important;
}

:deep(.hljs-meta),
:deep(.hljs-keyword) {
    font-weight: 900 !important;
}
</style>