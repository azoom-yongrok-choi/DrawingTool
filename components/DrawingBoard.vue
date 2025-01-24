<template>
  <div class="drawing-board">
    <DrawingTools
      :tools="tools"
      :selected-tool="selectedTool"
      :stroke-width="strokeWidth"
      :stroke-color="strokeColor"
      :color-tolerance="colorTolerance"
      :can-undo="canUndo"
      :can-redo="canRedo"
      @select-tool="selectTool"
      @update:stroke-width="strokeWidth = $event"
      @update:stroke-color="strokeColor = $event"
      @update:color-tolerance="colorTolerance = $event"
      @upload-image="handleImageUpload"
      @undo="undo"
      @redo="redo"
      @clear="clearCanvas"
    />
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
              opacity: 0.7
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
import { useHistory, type DrawingItem, type LineItem, type MagicWandItem } from '~/composables/useHistory'
import { simplifyLine } from '~/composables/useLineSimplification'
import { floodFill } from '~/composables/useFloodFill'
import DrawingTools from '~/components/DrawingTools.vue'

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
const colorTolerance = ref(30)
const isDrawing = ref(false)

const lines = ref<DrawingItem[]>([])
const stageRef = ref<any>(null)
const layerRef = ref<any>(null)
const lastPointerPosition = ref<{x: number, y: number} | null>(null)

// 히스토리 관리자 초기화
const drawingHistory = useHistory()

// 히스토리 상태를 추적하기 위한 ref
const historyState = ref({
  canUndo: false,
  canRedo: false
})

// 히스토리 상태 업데이트 함수
const updateHistoryState = () => {
  historyState.value = {
    canUndo: drawingHistory.canUndo,
    canRedo: drawingHistory.canRedo
  }
}

// computed 속성을 ref로 변경
const canUndo = computed(() => historyState.value.canUndo)
const canRedo = computed(() => historyState.value.canRedo)

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
  // 그리기 중이었다면 현재 선 최적화 및 히스토리 업데이트
  if (isDrawing.value) {
    isDrawing.value = false
    lastPointerPosition.value = null
    
    const lastLine = lines.value[lines.value.length - 1]
    if (lastLine?.type === 'line' && lastLine.points.length > 4) {
      const optimizedPoints = simplifyLine(lastLine.points)
      lines.value = [
        ...lines.value.slice(0, -1),
        { ...lastLine, points: optimizedPoints } as LineItem
      ]
    }
    updateHistory()
  }
  
  selectedTool.value = tool
}

const updateHistory = () => {
  drawingHistory.push([...lines.value])
  updateHistoryState()
}

const handleMouseDown = async (e: any) => {
  isDrawing.value = true
  const stage = e.target.getStage()
  const pos = stage.getPointerPosition()
  
  if (selectedTool.value === 'magicwand') {
    const resultImage = await floodFill(
      stage, 
      pos, 
      colorTolerance.value, 
      strokeColor.value
    )
    if (resultImage) {
      lines.value = [...lines.value, {
        id: Date.now(),
        type: 'magicwand',
        image: resultImage,
        color: strokeColor.value
      } as MagicWandItem]
      updateHistory()
    }
    isDrawing.value = false
    return
  }

  lastPointerPosition.value = pos
  
  // 새로운 선 추가
  const newLine: LineItem = {
    id: Date.now(),
    points: [pos.x, pos.y],
    color: selectedTool.value === 'eraser' ? '#ffffff' : strokeColor.value,
    width: selectedTool.value === 'eraser' ? 20 : strokeWidth.value,
    type: 'line'
  }
  
  lines.value = [...lines.value, newLine]
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
  if (lastLine.type !== 'line') return

  const newPoints = [...lastLine.points, currentPosition.x, currentPosition.y]
  
  // 새 배열을 생성하여 상태 업데이트
  lines.value = [
    ...lines.value.slice(0, -1),
    { ...lastLine, points: newPoints } as LineItem
  ]
  
  lastPointerPosition.value = currentPosition
}

const handleMouseUp = () => {
  if (!isDrawing.value) return
  
  isDrawing.value = false
  lastPointerPosition.value = null
  
  // 마지막 선 최적화
  const lastLine = lines.value[lines.value.length - 1]
  if (lastLine?.type === 'line' && lastLine.points.length > 4) {
    const optimizedPoints = simplifyLine(lastLine.points)
    lines.value = [
      ...lines.value.slice(0, -1),
      { ...lastLine, points: optimizedPoints } as LineItem
    ]
  }
  
  updateHistory()
}

const undo = () => {
  const previousState = drawingHistory.undo()
  lines.value = [...previousState]
  updateHistoryState()
}

const redo = () => {
  const nextState = drawingHistory.redo()
  lines.value = [...nextState]
  updateHistoryState()
}

const clearCanvas = () => {
  lines.value = []
  drawingHistory.clear()
  updateHistoryState()
}

const updateBackgroundImageConfig = (img: HTMLImageElement) => {
  const containerWidth = stageConfig.width
  const containerHeight = stageConfig.height

  const imageRatio = img.width / img.height
  const containerRatio = containerWidth / containerHeight

  let width = 0
  let height = 0
  let x = 0
  let y = 0

  // 이미지 비율에 따라 크기 조정
  if (imageRatio > containerRatio) {
    // 이미지가 더 넓은 경우
    width = containerWidth
    height = containerWidth / imageRatio
    y = (containerHeight - height) / 2
  } else {
    // 이미지가 더 높은 경우
    height = containerHeight
    width = containerHeight * imageRatio
    x = (containerWidth - width) / 2
  }

  backgroundImageConfig.value = {
    image: img,
    width,
    height,
    x,
    y
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
  // 히스토리 상태 초기화
  updateHistoryState()

  const updateSize = () => {
    if (!stageRef.value?.$el) return
    
    // drawing-container를 찾음
    const container = stageRef.value.$el.closest('.drawing-container')
    if (!container) return
    
    // DrawingTools의 높이를 구함
    const toolsElement = document.querySelector('.tools')
    const toolsHeight = toolsElement ? toolsElement.getBoundingClientRect().height : 0
    
    // drawing-container의 실제 사용 가능한 크기 계산
    const containerRect = container.getBoundingClientRect()
    stageConfig.width = containerRect.width
    stageConfig.height = containerRect.height - toolsHeight - 20 // 20은 margin-bottom 값

    // 배경 이미지가 있다면 크기 업데이트
    if (backgroundImage.value) {
      updateBackgroundImageConfig(backgroundImage.value)
    }
  }
  
  updateSize()
  window.addEventListener('resize', updateSize)

  // 컴포넌트 언마운트 시 이벤트 리스너 제거
  return () => {
    window.removeEventListener('resize', updateSize)
  }
})
</script>

<style scoped>
.drawing-board {
  width: 100%;
  height: 100%;  /* 100vh에서 100%로 변경 */
  background: white;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;  /* 오버플로우 방지 */
}

/* DrawingTools 영역 */
.drawing-board > :deep(.tools) {
  flex: 0 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* v-stage 영역 */
v-stage {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

/* Konva 스테이지 컨테이너 */
v-stage :deep(.konvajs-content) {
  width: 100% !important;
  height: 100% !important;
  box-sizing: border-box;
}
</style> 