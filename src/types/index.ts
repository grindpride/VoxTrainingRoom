export interface SidebarItem {
  name: string;
  icon?: string;
}

export interface MonthDay {
  day: number,
  class: string,
  isCurrentDate: boolean
}
