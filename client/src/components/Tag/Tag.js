import "./Tag.css";

export default function Tag({color, children}) {

    return <div className="tag" style={{
        backgroundColor: color
    }}>{children}</div>
}