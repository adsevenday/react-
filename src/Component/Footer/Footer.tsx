import type { FooterProps } from "./FooterProps";


const Footer: React.FC<FooterProps> = (props) => {
    return (<footer>
        {props.number && <a href={`tel:${props.number}`}>{props.number}</a>}
        {props.adress && <p>{props.adress}</p>}
        {props.logoInsta && <a href={props.logoInsta}>Instagram</a>}
        {props.LogoX && <a href={props.LogoX}>X</a>}
    </footer>);
}

export default Footer;