import type { CardProps } from "./CardProps";

const Card: React.FC<CardProps> = (props) => {
    return (
        <div className="card">
            {props.bookCover && <img src={props.bookCover} alt={props.name || "book Cover"} />}
            {props.name && <h2>{props.name}</h2>}
            {props.author && <p>{props.author}</p>}
            {props.period && <p>{props.period}</p>}
            {props.department && <p>{props.department}</p>}
        </div>
    );
}

export default Card;