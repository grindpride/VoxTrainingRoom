export interface SidebarItem {
  name: string;
  icon?: string;
}

export interface MonthDay {
  day: number,
  className: string,
  isCurrentDate: boolean
}

export interface SelectOption {
  value: string | number,
  name: string
}
