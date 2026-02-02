import type { LogoProps } from '../Logo/LogoProps';

export interface NavHeaderProps {
  logo: LogoProps;
  onSearch?: (query: string) => void;
}