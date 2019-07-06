import {MonthTypes} from "@/lib/enums";

export interface SidebarItem {
  name: string;
  icon?: string;
}

export interface MonthDay {
  day: number,
  month: MonthTypes,
  isCurrentDate: boolean
}

export interface SelectOption {
  value: string | number,
  name: string
}
