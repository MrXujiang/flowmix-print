"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import EditorHeader from "./editor-header"
import EditorToolbar from "./editor-toolbar"
import ElementLibrary from "./element-library"
import Canvas from "./canvas"
import PropertyPanel from "./property-panel"
import PageControls from "./page-controls"
import EditorFooter from "./editor-footer"

export default function PrintEditor() {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <EditorHeader />

        <EditorToolbar />

        <div className="flex flex-1 overflow-hidden">
          {/* 左侧元素库 */}
          <div className={`border-r bg-card transition-all ${leftSidebarCollapsed ? "w-0" : "w-64"}`}>
            {!leftSidebarCollapsed && <ElementLibrary />}
          </div>

          {/* 中间画布区域 */}
          <div className="flex-1 overflow-hidden bg-muted/30 flex flex-col">
            <div className="flex-1 overflow-auto relative">
              <Canvas />
            </div>
            <PageControls />
          </div>

          {/* 右侧属性面板 */}
          <div className={`border-l bg-card transition-all ${rightSidebarCollapsed ? "w-0" : "w-72"}`}>
            {!rightSidebarCollapsed && <PropertyPanel />}
          </div>
        </div>

        <EditorFooter />
      </div>
    </DndProvider>
  )
}

