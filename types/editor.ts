export interface Element {
  id: string
  type: "text" | "image" | "shape" | "table" | "icon" | "chart" | "barcode"
  x: number
  y: number
  width: number
  height: number
  content: string
  style?: Record<string, any>
}

export interface Page {
  id: string
  elements: Element[]
}

export interface CanvasSize {
  width: number
  height: number
  unit: "mm" | "px" | "in"
}

export interface ChartData {
  type: "bar" | "line" | "pie" | "doughnut" | "radar" | "polarArea"
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }[]
  options?: Record<string, any>
}

