import type { LogoProps } from './LogoProps';
import './logo.scss';

const Logo: React.FC<LogoProps> = (props) => {
  return <img src={props.imageSrc} alt={props.alt || 'Logo'} />;
}

export default Logo;