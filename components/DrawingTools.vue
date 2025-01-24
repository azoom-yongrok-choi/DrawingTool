<template>
  <div class="tools">
    <div class="tool-group">
      <button 
        v-for="tool in tools" 
        :key="tool.name"
        :class="{ active: selectedTool === tool.name }"
        @click="$emit('select-tool', tool.name)"
      >
        {{ tool.icon }} {{ $t(`tools.${tool.name}`) }}
      </button>
    </div>

    <div class="brush-size" v-if="selectedTool === 'brush'">
      <input 
        type="range" 
        v-model.number="strokeWidth"
        min="1" 
        max="50"
        :aria-label="$t('settings.brushSize')"
      />
      <span class="size-display">{{ strokeWidth }}{{ $t('settings.px') }}</span>
    </div>

    <div class="tolerance-slider" v-if="selectedTool === 'magicwand'">
      <input 
        type="range" 
        v-model.number="colorTolerance"
        min="0" 
        max="100"
        step="1"
        :aria-label="$t('settings.toleranceSlider')"
      />
      <span class="tolerance-display">{{ $t('settings.tolerance') }}: {{ colorTolerance }}{{ $t('settings.percent') }}</span>
    </div>

    <div class="tool-group">
      <input 
        type="color" 
        v-model="strokeColor"
        :aria-label="$t('settings.colorPicker')"
      />
      <label class="file-input">
        {{ $t('tools.upload') }}
        <input 
          type="file" 
          accept="image/*" 
          @change="$emit('upload-image', $event)"
          style="display: none"
        />
      </label>
      <button @click="$emit('undo')" :disabled="!canUndo" :aria-label="$t('tools.undo')">{{ $t('tools.undo') }}</button>
      <button @click="$emit('redo')" :disabled="!canRedo" :aria-label="$t('tools.redo')">{{ $t('tools.redo') }}</button>
      <button @click="$emit('clear')" :aria-label="$t('tools.clear')">{{ $t('tools.clear') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  tools: {
    type: Array as () => { name: string; icon: string }[],
    required: true
  },
  selectedTool: {
    type: String,
    required: true
  },
  strokeWidth: {
    type: Number,
    required: true
  },
  strokeColor: {
    type: String,
    required: true
  },
  colorTolerance: {
    type: Number,
    required: true,
    default: 30
  },
  canUndo: {
    type: Boolean,
    required: true
  },
  canRedo: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits([
  'select-tool',
  'update:stroke-width',
  'update:stroke-color',
  'update:color-tolerance',
  'upload-image',
  'undo',
  'redo',
  'clear'
])

const strokeWidth = computed({
  get: () => props.strokeWidth,
  set: (value) => emit('update:stroke-width', value)
})

const strokeColor = computed({
  get: () => props.strokeColor,
  set: (value) => emit('update:stroke-color', value)
})

const colorTolerance = computed({
  get: () => props.colorTolerance,
  set: (value) => emit('update:color-tolerance', value)
})
</script>

<style scoped>
.tools {
  padding: 10px 20px;
  background: #E8F5E9;
  display: flex;
  gap: 10px;
  border-bottom: 2px solid #81C784;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.tool-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.brush-size, .tolerance-slider {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
}

input[type="range"] {
  width: 100px;
  accent-color: #81C784;
}

.size-display, .tolerance-display {
  font-size: 12px;
  color: #2E7D32;
  min-width: 45px;
}

button {
  padding: 8px 12px;
  border: 2px solid #81C784;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #C8E6C9;
}

button.active {
  background: #81C784;
  color: white;
}

input[type="color"] {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid #81C784;
  border-radius: 8px;
  cursor: pointer;
}

.file-input {
  padding: 8px 12px;
  border: 2px solid #81C784;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.file-input:hover {
  background: #C8E6C9;
}
</style> 