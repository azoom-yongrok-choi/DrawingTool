<template>
  <div class="tools">
    <button 
      v-for="tool in tools" 
      :key="tool.name"
      :class="{ active: selectedTool === tool.name }"
      @click="$emit('select-tool', tool.name)"
    >
      {{ tool.icon }}
    </button>
    <div class="brush-size" v-if="selectedTool === 'brush'">
      <input 
        type="range" 
        v-model.number="strokeWidth"
        min="1" 
        max="50"
      />
      <span class="size-display">{{ strokeWidth }}px</span>
    </div>
    <div class="tolerance-slider" v-if="selectedTool === 'magicwand'">
      <input 
        type="range" 
        v-model.number="colorTolerance"
        min="0" 
        max="100"
        step="1"
      />
      <span class="tolerance-display">허용치: {{ colorTolerance }}%</span>
    </div>
    <input 
      type="color" 
      v-model="strokeColor"
    />
    <label class="file-input">
      🖼️
      <input 
        type="file" 
        accept="image/*" 
        @change="$emit('upload-image', $event)"
        style="display: none"
      />
    </label>
    <button @click="$emit('undo')" :disabled="!canUndo">↩️</button>
    <button @click="$emit('redo')" :disabled="!canRedo">↪️</button>
    <button @click="$emit('clear')">🗑️</button>
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

.brush-size {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
}

.brush-size input[type="range"] {
  width: 100px;
  accent-color: #81C784;
}

.size-display {
  font-size: 12px;
  color: #2E7D32;
  min-width: 45px;
}

.tools button {
  padding: 8px 12px;
  border: 2px solid #81C784;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tools button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tools button:hover:not(:disabled) {
  background: #C8E6C9;
}

.tools button.active {
  background: #81C784;
  color: white;
}

.tools input[type="color"] {
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
}

.file-input:hover {
  background: #C8E6C9;
}

.tolerance-slider {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
}

.tolerance-slider input[type="range"] {
  width: 100px;
  accent-color: #81C784;
}

.tolerance-display {
  font-size: 12px;
  color: #2E7D32;
  min-width: 80px;
}
</style> 