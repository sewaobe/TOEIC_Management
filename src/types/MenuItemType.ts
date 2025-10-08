export interface MenuItemType {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
  component?: React.ReactNode | (() => React.ReactNode);
  children?: MenuItemType[];
}
