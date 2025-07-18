import ReactDOM from "react-dom";
import FilterPanel from "./filterPanel/filterPanel"

export function FilterPanelWrapper(props) {
    return ReactDOM.createPortal(
        <div className="filter-portal-wrapper">
            <FilterPanel {...props} />
        </div>,
        document.getElementById("modal-root") // Stelle sicher, dass es existiert
    );
}
