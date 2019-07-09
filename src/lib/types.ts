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

export interface EventBlockStyles {
  height: string,
  display: string,
  top: string
}

export interface ScheduleEvent {
  name: string,
  desc: string,
  startTime: string,
  endTime: string,
  type: string,
  styles: EventBlockStyles
}

export interface State {
  activeDate: Date,
  currentEvent: ScheduleEvent | null,
  events: ScheduleEvent[]
}
