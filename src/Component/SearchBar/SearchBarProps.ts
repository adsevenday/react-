export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
  onChange?: (query: string) => void;
}
