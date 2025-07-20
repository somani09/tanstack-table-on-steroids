import { TableStyleConfig } from "./types-and-interfaces";

export const TABLE_STYLE_PRESETS: TableStyleConfig[] = [
  {
    HEADER_CLASSES: {
      height: "h-16",
      background: "bg-soft-peach-300",
      accent: "text-soft-rose-400 fill-soft-rose-400 stroke-soft-rose-400",
      fontColor: "text-primary",
      fontSize: "text-lg",
      fontWeight: "font-medium",
    },
    FOOTER_CLASSES: {
      height: "h-12",
      background: "bg-soft-peach-300",
      fontColor: "text-secondary",
      fontSize: "text-base",
      fontWeight: "font-semibold",
    },
    ROW_CLASSES: {
      cellHeight: "h-12",
      backgroundType: "double",
      background: {
        single: "bg-soft-rose-200",
        double: ["bg-soft-rose-200", "bg-soft-cream-200"],
      },
      fontColor: "text-secondary",
      fontSize: "text-base",
    },
    BORDER_CLASSES: {
      size: "", // optional, e.g., 'border'
      color: "border-pastel-blue-100",
      backgroundColor: "bg-pastel-blue-100",
    },
    CHECKBOX_CLASSES: {
      borderColor: "border-pastel-blue-300",
      checkedBorderColor: "checked:border-soft-rose-500",
      hoverBorderColor: "hover:border-soft-rose-500",
      backgroundColor: "",
      checkedBackgroundColor: "checked:bg-soft-rose-400",
      checkedHoverBackgroundColor: "checked:hover:bg-soft-rose-400",
      size: "border-2",
    },
  },
];
