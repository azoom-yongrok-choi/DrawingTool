<template>
  <div class="drawing-board">
    <div class="tools">
      <button 
        v-for="tool in tools" 
        :key="tool.name"
        :class="{ active: selectedTool === tool.name }"
        @click="selectTool(tool.name)"
      >
        {{ tool.icon }}
      </button>
      <div class="brush-size">
        <input 
          type="range" 
          v-model="strokeWidth" 
          min="1" 
          max="50"
          :disabled="selectedTool === 'eraser'"
        />
        <span class="size-display">{{ strokeWidth }}px</span>
      </div>
      <input type="color" v-model="strokeColor" />
      <label class="file-input">
        🖼️
        <input 
          type="file" 
          accept="image/*" 
          @change="handleImageUpload"
          style="display: none"
        />
      </label>
      <button @click="undo">↩️</button>
      <button @click="redo">↪️</button>
      <button @click="clearCanvas">🗑️</button>
    </div>
    <v-stage
      ref="stageRef"
      :config="stageConfig"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @touchstart="handleMouseDown"
      @touchmove="handleMouseMove"
      @touchend="handleMouseUp"
    >
      <v-layer ref="layerRef">
        <v-image
          v-if="backgroundImage"
          :config="backgroundImageConfig"
        />
        <template v-for="item in magicWandLayers" :key="item.id">
          <v-image
            :config="{
              image: item.image,
              x: 0,
              y: 0,
              width: stageConfig.width,
              height: stageConfig.height,
              opacity: 0.5
            }"
          />
        </template>
        <template v-for="item in drawingLayers" :key="item.id">
          <v-line
            :config="{
              points: item.points,
              stroke: item.color,
              strokeWidth: item.width,
              tension: 0.5,
              lineCap: 'round',
              lineJoin: 'round',
              opacity: 0.5
            }"
          />
        </template>
      </v-layer>
    </v-stage>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useHistory, type DrawingItem } from '~/composables/useHistory'
import { simplifyLine } from '~/composables/useLineSimplification'
import { floodFill } from '~/composables/useFloodFill'

const stageConfig = reactive({
  width: 800,
  height: 600
})

const tools = [
  { name: 'brush', icon: '🖌️' },
  { name: 'eraser', icon: '⌫' },
  { name: 'magicwand', icon: '✨' }
]

const selectedTool = ref('brush')
const strokeColor = ref('#000000')
const strokeWidth = ref(5)
const isDrawing = ref(false)

const lines = ref<DrawingItem[]>([])
const stageRef = ref<any>(null)
const layerRef = ref<any>(null)
const lastPointerPosition = ref<{x: number, y: number} | null>(null)

// 히스토리 관리자 초기화
const drawingHistory = useHistory()
const canUndo = computed(() => drawingHistory.canUndo)
const canRedo = computed(() => drawingHistory.canRedo)

// 포인트 간 최소 거리 (이 거리보다 가까운 포인트는 무시)
const MIN_DISTANCE = 3

// 두 점 사이의 거리 계산
const getDistance = (p1: {x: number, y: number}, p2: {x: number, y: number}): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

const backgroundImage = ref<HTMLImageElement | null>(null)

// 배경 이미지 설정을 위한 반응형 객체 추가
const backgroundImageConfig = ref({
  image: null as HTMLImageElement | null,
  width: 0,
  height: 0,
  x: 0,
  y: 0
})

const selectTool = (tool: string) => {
  selectedTool.value = tool
}

const updateHistory = () => {
  console.log('Updating history:', lines.value)
  drawingHistory.push([...lines.value])
  console.log('Current history state:', drawingHistory.currentState)
  console.log('Can undo:', drawingHistory.canUndo)
  console.log('Can redo:', drawingHistory.canRedo)
}

const handleMouseDown = async (e: any) => {
  const stage = e.target.getStage()
  const pos = stage.getPointerPosition()

  if (selectedTool.value === 'magicwand') {
    // 현재 스테이지의 전체 상태를 캡처
    const dataURL = stage.toDataURL()
    const img = new Image()
    img.src = dataURL

    await new Promise(resolve => { img.onload = resolve })

    // 임시 캔버스 생성 및 현재 상태 그리기
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = stage.width()
    tempCanvas.height = stage.height()
    const ctx = tempCanvas.getContext('2d')
    if (!ctx) return

    // 현재 스테이지 상태 그리기
    ctx.drawImage(img, 0, 0)

    // 현재 픽셀의 이미지 데이터 가져오기
    const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)

    // RGB 색상 변환
    const color = strokeColor.value
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)

    // 플러드 필 실행
    const filledImageData = floodFill(imageData, Math.round(pos.x), Math.round(pos.y), {
      r, g, b, a: 1
    })

    // 결과를 새 이미지로 변환
    ctx.putImageData(filledImageData, 0, 0)

    // 이미지를 Konva.Image로 변환하여 추가
    const imageObj = new Image()
    imageObj.src = tempCanvas.toDataURL()
    await new Promise(resolve => { imageObj.onload = resolve })

    // 새로운 매직완드 작업 추가
    const newMagicWand: DrawingItem = {
      id: Date.now(),
      points: [0, 0, stage.width(), stage.height()],
      image: imageObj,
      type: 'magicwand',
      imageData: filledImageData
    }

    // 상태 업데이트 및 히스토리 저장
    lines.value = [...lines.value, newMagicWand]
    updateHistory()
    return
  }

  isDrawing.value = true
  lastPointerPosition.value = pos
  
  // 새로운 선 추가
  const newLine: DrawingItem = {
    id: Date.now(),
    points: [pos.x, pos.y],
    color: selectedTool.value === 'eraser' ? '#ffffff' : strokeColor.value,
    width: selectedTool.value === 'eraser' ? 20 : strokeWidth.value,
    type: 'line'
  }
  
  lines.value = [...lines.value, newLine]
  // mouseDown에서는 히스토리 업데이트하지 않음
}

const handleMouseMove = (e: any) => {
  if (!isDrawing.value) return

  const stage = e.target.getStage()
  const currentPosition = stage.getPointerPosition()
  
  // 이전 포인트와의 거리가 최소 거리보다 작으면 무시
  if (lastPointerPosition.value && 
      getDistance(lastPointerPosition.value, currentPosition) < MIN_DISTANCE) {
    return
  }

  const lastLine = lines.value[lines.value.length - 1]
  const newPoints = [...lastLine.points, currentPosition.x, currentPosition.y]
  
  // 새 배열을 생성하여 상태 업데이트
  lines.value = [
    ...lines.value.slice(0, -1),
    { ...lastLine, points: newPoints }
  ]
  
  lastPointerPosition.value = currentPosition
}

const handleMouseUp = () => {
  if (!isDrawing.value) return
  
  isDrawing.value = false
  lastPointerPosition.value = null
  
  // 마지막 선 최적화
  const lastLine = lines.value[lines.value.length - 1]
  if (lastLine && lastLine.points.length > 4) {
    const optimizedPoints = simplifyLine(lastLine.points)
    lines.value = [
      ...lines.value.slice(0, -1),
      { ...lastLine, points: optimizedPoints }
    ]
  }
  
  // mouseUp에서만 히스토리 업데이트
  updateHistory()
}

const undo = () => {
  const previousState = drawingHistory.undo()
  lines.value = previousState
}

const redo = () => {
  const nextState = drawingHistory.redo()
  lines.value = nextState
}

const clearCanvas = () => {
  lines.value = []
  drawingHistory.clear()
}

const updateBackgroundImageConfig = (img: HTMLImageElement) => {
  const container = stageRef.value.$el.parentElement
  const containerWidth = container.offsetWidth
  const containerHeight = container.offsetHeight

  const imageRatio = img.width / img.height
  const containerRatio = containerWidth / containerHeight

  let scale = 1
  let offsetX = 0
  let offsetY = 0

  if (imageRatio > containerRatio) {
    scale = containerWidth / img.width
    offsetY = (containerHeight - (img.height * scale)) / 2
  } else {
    scale = containerHeight / img.height
    offsetX = (containerWidth - (img.width * scale)) / 2
  }

  backgroundImageConfig.value = {
    image: img,
    width: img.width * scale,
    height: img.height * scale,
    x: offsetX,
    y: offsetY
  }
}

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const reader = new FileReader()

  reader.onload = async (e) => {
    const img = new Image()
    img.src = e.target?.result as string
    
    await new Promise((resolve) => {
      img.onload = () => {
        backgroundImage.value = img
        updateBackgroundImageConfig(img)
        resolve(true)
      }
    })
  }

  reader.readAsDataURL(file)
}

// 매직완드 레이어와 그리기 레이어를 분리
const magicWandLayers = computed(() => {
  return lines.value.filter(item => item.type === 'magicwand')
})

const drawingLayers = computed(() => {
  return lines.value.filter(item => item.type === 'line')
})

// 컴포넌트 마운트 시 캔버스 크기 조정
onMounted(() => {
  const updateSize = () => {
    if (!stageRef.value?.$el) return
    const container = stageRef.value.$el.parentElement
    if (!container) return
    stageConfig.width = container.offsetWidth
    stageConfig.height = container.offsetHeight
  }
  
  updateSize()
  window.addEventListener('resize', updateSize)
})
</script>

<style scoped>
.drawing-board {
  width: 100%;
  height: calc(100vh - 40px); /* 상하 여백 20px씩 */
  background: white;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 20px;
}

.tools {
  padding: 10px 20px; /* 좌우 패딩 증가 */
  background: #E8F5E9;
  display: flex;
  gap: 10px;
  border-bottom: 2px solid #81C784;
  align-items: center;
  flex-wrap: wrap; /* 도구가 많을 때 줄바꿈 */
  justify-content: center; /* 중앙 정렬 */
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

v-stage {
  flex: 1;
  width: 100%;
  height: 100%;
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
</style> 