import './filterPanel.scss';
import { useEffect } from 'react';
import { IoClose } from "react-icons/io5";

export default function FilterPanel({ filterState, setFilterState, onClose, onApply }) {
    useEffect(() => {
        document.querySelector('html').style.overflowY = 'hidden';
        return () => document.querySelector('html').style.overflowY = 'auto';
    }, []);

    function toggleSelection(list, value, key) {
        const newList = list.includes(value)
            ? list.filter(item => item !== value)
            : [...list, value];

        setFilterState(prev => ({
            ...prev,
            [key]: newList
        }));
    };

    function getInitialFilterSelection(filterState) {
        return {
            ...filterState,
            strategies: [],
            tags: [],
            direction: 'all',
            showOnlyWins: false,
            showOnlyLosses: false,
            showOnlyBreakEven: false,
            ratioMin: '',
            ratioMax: '',
            profitMin: '',
            profitMax: '',
            dateFrom: '',
            dateTo: '',
        };
    };


    return (
        <div className='filter-blur'>
            <div className="filter-panel">
                <div className="header">
                    <h2>
                        Filter
                    </h2>
                    <button onClick={onClose} aria-label="Schließen"><IoClose style={{ color: "white" }} /></button>
                </div>

                <div className="section">
                    <label>Strategien</label>
                    <div className="tags">
                        {filterState.allStrategies.map(strat => (
                            <span
                                key={strat}
                                className={`tag ${filterState.strategies.includes(strat) ? 'selected' : ''}`}
                                onClick={() => toggleSelection(filterState.strategies, strat, 'strategies')}
                            >
                                {strat}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="section">
                    <label>Fehler-Tags</label>
                    <div className="tags">
                        {filterState.allTags.map(tag => (
                            <span
                                key={tag}
                                className={`tag ${filterState.tags.includes(tag) ? 'selected' : ''}`}
                                onClick={() => toggleSelection(filterState.tags, tag, 'tags')}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="section">
                    <label>Richtung</label>
                    <select
                        value={filterState.direction}
                        onChange={e => setFilterState(prev => ({ ...prev, direction: e.target.value }))}
                    >
                        <option value="all">Alle</option>
                        <option value="Long">Long</option>
                        <option value="Short">Short</option>
                    </select>
                </div>

                <div className="section checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={filterState.showOnlyWins}
                            onChange={() => setFilterState(p => ({
                                ...p,
                                showOnlyWins: !p.showOnlyWins,
                                showOnlyLosses: false,
                                showOnlyBreakEven: false,
                            }))}
                        /> Nur Gewinner
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={filterState.showOnlyLosses}
                            onChange={() => setFilterState(p => ({
                                ...p,
                                showOnlyLosses: !p.showOnlyLosses,
                                showOnlyWins: false,
                                showOnlyBreakEven: false,
                            }))}
                        /> Nur Verlierer
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={filterState.showOnlyBreakEven}
                            onChange={() => setFilterState(p => ({
                                ...p,
                                showOnlyBreakEven: !p.showOnlyBreakEven,
                                showOnlyWins: false,
                                showOnlyLosses: false,
                            }))}
                        /> Nur Break-Even
                    </label>

                </div>

                <div className="section">
                    <label>RRR (von - bis)</label>
                    <div className="range-row">
                        <input
                            type="number"
                            placeholder="min"
                            value={filterState.ratioMin}
                            onChange={e => setFilterState(p => ({ ...p, ratioMin: e.target.value }))}
                        />
                        <span>–</span>
                        <input
                            type="number"
                            placeholder="max"
                            value={filterState.ratioMax}
                            onChange={e => setFilterState(p => ({ ...p, ratioMax: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="section">
                    <label>Profit / Verlust (€)</label>
                    <div className="range-row">
                        <input
                            type="number"
                            placeholder="min €"
                            value={filterState.profitMin}
                            onChange={e => setFilterState(p => ({ ...p, profitMin: e.target.value }))}
                        />
                        <span>–</span>
                        <input
                            type="number"
                            placeholder="max €"
                            value={filterState.profitMax}
                            onChange={e => setFilterState(p => ({ ...p, profitMax: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="section">
                    <label>Zeitraum</label>
                    <div className="date-range">
                        <input
                            type="date"
                            value={filterState.dateFrom}
                            onChange={e => setFilterState(p => ({ ...p, dateFrom: e.target.value }))}
                        />
                        <span>–</span>
                        <input
                            type="date"
                            value={filterState.dateTo}
                            onChange={e => setFilterState(p => ({ ...p, dateTo: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="bottom">
                    <button onClick={() => setFilterState(prev => getInitialFilterSelection(prev))}>Clear</button>
                    {onApply
                        ? <button onClick={onApply}>Filtern</button>
                        : <button onClick={onClose}>Fertig</button>
                    }
                </div>
            </div>
        </div>
    );
}
