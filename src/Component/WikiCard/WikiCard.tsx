import type { WikiCardProps } from "./WikiCardProps";

const WikiCard: React.FC<WikiCardProps> = (props) => {
    return (
        <div className="wiki-card">
            {props.bookCover && <img src={props.bookCover} alt={props.description || "book Cover"} />}
            {props.description && <p>{props.description}</p>}
            {props.link && <a href={props.link}>Read more</a>}
        </div>
    );
}

export default WikiCard;