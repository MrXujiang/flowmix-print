"use client"

import { useState } from "react"
import { useDrag } from "react-dnd"
import {
  Accordion,
  AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Search,
  BarChart2,
  LineChart,
  PieChart,
  Type,
  Heading,
  AlignLeft,
  ImageIcon,
  Square,
  Circle,
  Triangle,
  Minus,
  Table,
  Star,
  Heart,
  CheckCircle,
  Info,
} from "lucide-react"
import { Card } from "@/components/ui/card"

export default function ElementLibrary() {
  const [searchTerm, setSearchTerm] = useState("")

  // 过滤元素
  const filterElements = (elements: any[], term: string) => {
    if (!term) return elements
    return elements.filter((element) => element.name.toLowerCase().includes(term.toLowerCase()))
  }

  // 文本元素
  const textElements = [
    {
      type: "text",
      name: "文本",
      icon: <Type className="h-6 w-6" />,
      defaultWidth: 200,
      defaultHeight: 50,
      defaultContent: "双击编辑文本",
      defaultStyle: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#000000",
        textAlign: "left",
        lineHeight: 1.5,
        letterSpacing: 0,
      },
    },
    {
      type: "text",
      name: "标题",
      icon: <Heading className="h-6 w-6" />,
      defaultWidth: 300,
      defaultHeight: 60,
      defaultContent: "双击编辑标题",
      defaultStyle: {
        fontSize: 24,
        fontWeight: "bold",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#000000",
        textAlign: "center",
        lineHeight: 1.5,
        letterSpacing: 0,
      },
    },
    {
      type: "text",
      name: "副标题",
      icon: <Heading className="h-5 w-5" />,
      defaultWidth: 250,
      defaultHeight: 50,
      defaultContent: "双击编辑副标题",
      defaultStyle: {
        fontSize: 18,
        fontWeight: "bold",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#000000",
        textAlign: "center",
        lineHeight: 1.5,
        letterSpacing: 0,
      },
    },
    {
      type: "text",
      name: "段落",
      icon: <AlignLeft className="h-6 w-6" />,
      defaultWidth: 300,
      defaultHeight: 100,
      defaultContent: "双击编辑段落文本。这是一个示例段落，您可以在这里添加您的内容。",
      defaultStyle: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#000000",
        textAlign: "left",
        lineHeight: 1.5,
        letterSpacing: 0,
      },
    },
  ]

  // 图片元素
  const imageElements = [
    {
      type: "image",
      name: "图片",
      icon: <ImageIcon className="h-6 w-6" />,
      defaultWidth: 200,
      defaultHeight: 150,
      defaultContent: "",
      defaultStyle: {
        objectFit: "contain",
        opacity: 1,
        borderRadius: 0,
      },
    },
  ]

  // 形状元素
  const shapeElements = [
    {
      type: "shape",
      name: "矩形",
      icon: <Square className="h-6 w-6" />,
      defaultWidth: 150,
      defaultHeight: 100,
      defaultContent: "rectangle",
      defaultStyle: {
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 1,
        opacity: 1,
        borderRadius: 0,
      },
    },
    {
      type: "shape",
      name: "圆形",
      icon: <Circle className="h-6 w-6" />,
      defaultWidth: 100,
      defaultHeight: 100,
      defaultContent: "circle",
      defaultStyle: {
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 1,
        opacity: 1,
      },
    },
    {
      type: "shape",
      name: "三角形",
      icon: <Triangle className="h-6 w-6" />,
      defaultWidth: 100,
      defaultHeight: 100,
      defaultContent: "triangle",
      defaultStyle: {
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 1,
        opacity: 1,
      },
    },
    {
      type: "shape",
      name: "线条",
      icon: <Minus className="h-6 w-6" />,
      defaultWidth: 150,
      defaultHeight: 2,
      defaultContent: "line",
      defaultStyle: {
        stroke: "#000000",
        strokeWidth: 2,
        opacity: 1,
      },
    },
  ]

  // 表格元素
  const tableElements = [
    {
      type: "table",
      name: "表格",
      icon: <Table className="h-6 w-6" />,
      defaultWidth: 300,
      defaultHeight: 200,
      defaultContent: JSON.stringify({
        columns: 3,
        rows: 3,
        data: [
          ["列 1", "列 2", "列 3"],
          ["数据 1", "数据 2", "数据 3"],
          ["数据 4", "数据 5", "数据 6"],
        ],
        style: {
          borderWidth: 1,
          borderColor: "#000000",
          headerBgColor: "#f0f0f0",
          cellPadding: 8,
          fontSize: 14,
          headerFontSize: 14,
          headerFontWeight: "bold",
          headerTextAlign: "center",
          cellTextAlign: "left",
        },
      }),
      defaultStyle: {},
    },
  ]

  // 图标元素
  const iconElements = [
    {
      type: "icon",
      name: "星形",
      icon: <Star className="h-6 w-6" />,
      defaultWidth: 50,
      defaultHeight: 50,
      defaultContent: "star",
      defaultStyle: {
        fill: "#000000",
        opacity: 1,
        rotation: 0,
      },
    },
    {
      type: "icon",
      name: "心形",
      icon: <Heart className="h-6 w-6" />,
      defaultWidth: 50,
      defaultHeight: 50,
      defaultContent: "heart",
      defaultStyle: {
        fill: "#000000",
        opacity: 1,
        rotation: 0,
      },
    },
    {
      type: "icon",
      name: "对勾",
      icon: <CheckCircle className="h-6 w-6" />,
      defaultWidth: 50,
      defaultHeight: 50,
      defaultContent: "check",
      defaultStyle: {
        fill: "#000000",
        opacity: 1,
        rotation: 0,
      },
    },
    {
      type: "icon",
      name: "信息",
      icon: <Info className="h-6 w-6" />,
      defaultWidth: 50,
      defaultHeight: 50,
      defaultContent: "info",
      defaultStyle: {
        fill: "#000000",
        opacity: 1,
        rotation: 0,
      },
    },
  ]

  // 图表元素
  const chartElements = [
    {
      type: "chart",
      name: "柱状图",
      icon: <BarChart2 className="h-6 w-6" />,
      defaultWidth: 300,
      defaultHeight: 200,
      defaultContent: JSON.stringify({
        type: "bar",
        labels: ["一月", "二月", "三月", "四月", "五月", "六月"],
        datasets: [
          {
            label: "数据集",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      }),
      defaultStyle: {},
    },
    {
      type: "chart",
      name: "折线图",
      icon: <LineChart className="h-6 w-6" />,
      defaultWidth: 300,
      defaultHeight: 200,
      defaultContent: JSON.stringify({
        type: "line",
        labels: ["一月", "二月", "三月", "四月", "五月", "六月"],
        datasets: [
          {
            label: "数据集",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: false,
          },
        ],
      }),
      defaultStyle: {},
    },
    {
      type: "chart",
      name: "饼图",
      icon: <PieChart className="h-6 w-6" />,
      defaultWidth: 300,
      defaultHeight: 300,
      defaultContent: JSON.stringify({
        type: "pie",
        labels: ["红色", "蓝色", "黄色", "绿色", "紫色"],
        datasets: [
          {
            label: "数据集",
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }),
      defaultStyle: {},
    },
  ]

  // 渲染可拖拽元素
  const DraggableElement = ({ element }: { element: any }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "ELEMENT",
      item: element,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    })

    return (
      <Card
        ref={drag}
        className="p-3 flex flex-col items-center justify-center gap-1 cursor-move hover:bg-accent transition-colors"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <div className="text-primary">{element.icon}</div>
        <div className="text-xs">{element.name}</div>
      </Card>
    )
  }

  // 渲染元素分类
  const renderElementCategory = (title: string, elements: any[]) => {
    const filteredElements = filterElements(elements, searchTerm)
    if (filteredElements.length === 0) return null

    return (
      <AccordionItem value={title.toLowerCase()}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-2">
            {filteredElements.map((element, index) => (
              <DraggableElement key={`${element.type}-${index}`} element={element} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <h3 className="font-semibold mb-4">元素库</h3>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索元素..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 pt-0">
          <Accordion type="multiple" defaultValue={["文本", "图片", "形状", "表格", "图标", "图表"]}>
            {renderElementCategory("文本", textElements)}
            {renderElementCategory("图片", imageElements)}
            {renderElementCategory("形状", shapeElements)}
            {renderElementCategory("表格", tableElements)}
            {renderElementCategory("图标", iconElements)}
            {renderElementCategory("图表", chartElements)}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
}

