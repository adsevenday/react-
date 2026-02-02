import type { LogoProps } from './LogoProps';

const Logo: React.FC<LogoProps> = (props) => {
  return <img src={props.imageSrc} alt={props.alt || 'Logo'} />;
}

export default Logo;