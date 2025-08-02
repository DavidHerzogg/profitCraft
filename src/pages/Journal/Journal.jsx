import './Journal.scss'
import FilterPanel from "../../components/filterPanel/filterPanel";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { BiSolidEdit } from "react-icons/bi";
import { FaFilter } from "react-icons/fa6";
import { useState, useEffect } from 'react'
import AddPanel from '../../components/addPanel/AddPanel';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ConfirmDeleteModal } from '../../components/ConfirmDeleteModal/ConfirmDeleteModal';
import { IoMdInformationCircle } from "react-icons/io";
import { TradeInfoPanel } from '../../components/tradeInfoPanel/TradeInfoPanel';
import { IoCheckmarkCircle } from "react-icons/io5";
import ChecklistPanel from '../../components/checklistPanel/checklistPanel';

import { useAuth } from "@clerk/clerk-react";

export default function Journal() {
  const [showChecklistPanel, setShowChecklistPanel] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [editTrade, setEditTrade] = useState(null);
  const [tradeToDelete, setTradeToDelete] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [filterState, setFilterState] = useState({
    allStrategies: [],
    allTags: [],
    strategies: [],
    tags: [],
    direction: "all",
    showOnlyWins: false,
    showOnlyLosses: false,
    showOnlyBreakEven: false,
    ratioMin: "",
    ratioMax: "",
    profitMin: "",
    profitMax: "",
    dateFrom: "",
    dateTo: ""
  });

  const { userId } = useAuth();

  const deleteTradeMutation = useMutation(api.trades.deleteTrade);
  const trades = useQuery(
    userId ? api.trades.getUserTrades : null,
    userId ? { userId } : null
  );

  useEffect(() => {
    if (trades && trades.length > 0) {
      const uniqueStrategies = [...new Set(trades.map(t => t.strategy))];
      const uniqueTags = [...new Set(trades.flatMap(t => t.errorTags || []))];
      setFilterState(prev => ({
        ...prev,
        allStrategies: uniqueStrategies,
        allTags: uniqueTags
      }));
    }
  }, [trades]);

  if (!userId) return <div>Bitte anmelden...</div>;
  if (trades === undefined) return <div className='loader'>Loading...</div>;

  const handleClosePanel = () => {
    setIsShown(false);
    setEditTrade(null);
    document.querySelector('html').style.overflowY = 'auto';
  }

  const openConfirm = (trade) => setTradeToDelete(trade);
  const closeConfirm = () => setTradeToDelete(null);

  const confirmDelete = async () => {
    await deleteTradeMutation({ _id: tradeToDelete._id })
    closeConfirm();
  };

  const openEditPanel = (trade) => {
    setEditTrade(trade);
    setIsShown(true);
  };

  const openAddPanel = () => {
    setEditTrade(null);
    setIsShown(true);
  };

  function applyFilters(trades, filters) {
    return trades.filter(trade => {
      const {
        strategies,
        tags,
        direction,
        showOnlyLosses,
        showOnlyWins,
        showOnlyBreakEven,
        ratioMin,
        ratioMax,
        profitMin,
        profitMax,
        dateFrom,
        dateTo,
      } = filters;

      if (strategies.length > 0 && !strategies.includes(trade.strategy)) return false;
      if (tags.length > 0 && !tags.every(tag => trade.errorTags?.includes(tag))) return false;
      if (direction !== "all" && trade.direction !== direction) return false;
      if (showOnlyWins && trade.profit <= 0) return false;
      if (showOnlyLosses && trade.profit >= 0) return false;
      if (showOnlyBreakEven && trade.profit !== 0) return false;

      if (ratioMin && trade.ratio < parseFloat(ratioMin)) return false;
      if (ratioMax && trade.ratio > parseFloat(ratioMax)) return false;
      if (profitMin && trade.profit < parseFloat(profitMin)) return false;
      if (profitMax && trade.profit > parseFloat(profitMax)) return false;

      const tradeDate = new Date(trade.date);
      if (dateFrom && tradeDate < new Date(dateFrom)) return false;
      if (dateTo && tradeDate > new Date(dateTo)) return false;

      return true;
    });
  };

  function areFiltersActive(state) {
    return (
      state.strategies.length > 0 ||
      state.tags.length > 0 ||
      state.direction !== 'all' ||
      state.showOnlyWins ||
      state.showOnlyLosses ||
      state.showOnlyBreakEven ||
      state.ratioMin !== '' ||
      state.ratioMax !== '' ||
      state.profitMin !== '' ||
      state.profitMax !== '' ||
      state.dateFrom !== '' ||
      state.dateTo !== ''
    );
  };

  const activeFilters = getActiveFilters(filterState);
  const isFilterActive = areFiltersActive(filterState);

  function getActiveFilters(state) {
    const filters = [];

    state.strategies.forEach(strat => {
      filters.push({ type: 'strategy', value: strat });
    });

    state.tags.forEach(tag => {
      filters.push({ type: 'tag', value: tag });
    });

    if (state.direction !== 'all') {
      filters.push({ type: 'direction', value: state.direction });
    }

    if (state.showOnlyWins) filters.push({ type: 'result', value: 'Gewinner' });
    if (state.showOnlyLosses) filters.push({ type: 'result', value: 'Verlierer' });
    if (state.showOnlyBreakEven) filters.push({ type: 'result', value: 'BreakEven' });

    if (state.ratioMin || state.ratioMax) {
      filters.push({ type: 'rrr', value: `${state.ratioMin || '–'} bis ${state.ratioMax || '–'}` });
    }

    if (state.profitMin || state.profitMax) {
      filters.push({ type: 'profit', value: `${state.profitMin || '–'} bis ${state.profitMax || '–'} €` });
    }

    if (state.dateFrom || state.dateTo) {
      filters.push({ type: 'date', value: `${state.dateFrom || '–'} bis ${state.dateTo || '–'}` });
    }

    return filters;
  }

  function removeFilter(filter) {
    setFilterState(prev => {
      switch (filter.type) {
        case 'strategy':
          return { ...prev, strategies: prev.strategies.filter(s => s !== filter.value) };
        case 'tag':
          return { ...prev, tags: prev.tags.filter(t => t !== filter.value) };
        case 'direction':
          return { ...prev, direction: 'all' };
        case 'result':
          return {
            ...prev,
            showOnlyWins: false,
            showOnlyLosses: false,
            showOnlyBreakEven: false,
          };
        case 'rrr':
          return { ...prev, ratioMin: '', ratioMax: '' };
        case 'profit':
          return { ...prev, profitMin: '', profitMax: '' };
        case 'date':
          return { ...prev, dateFrom: '', dateTo: '' };
        default:
          return prev;
      }
    });
  }

  return (
    <div className='pageContent'>
      <header>
        <h1>Journal</h1>
        <div className="btns">
          <button
            className={`filter ${isFilterActive ? 'active' : ''}`}
            onClick={() => setShowChecklistPanel(true)}
          >
            <IoCheckmarkCircle />
            Checkliste
          </button>
          <button
            className={`filter ${isFilterActive ? 'active' : ''}`}
            onClick={() => setShowFilterPanel(true)}
          >
            <FaFilter />
            Filter
          </button>
          <button onClick={openAddPanel}><IoMdAdd color='white' className='IoMdAdd' /></button>
        </div>
      </header>
      {activeFilters.length > 0 && (
        <div className="active-filter-tags">
          {activeFilters.map((filter, index) => (
            <span className="tag" key={index}>
              {filter.value}
              <button onClick={() => removeFilter(filter)}>×</button>
            </span>
          ))}
        </div>
      )}

      {isShown && (
        <AddPanel
          onClose={handleClosePanel}
          trade={editTrade}
        />
      )}

      <table className="journal-table">
        <thead>
          <tr>
            <th>Wert</th>
            <th>G/V</th>
            <th>RRR</th>
            <th>Fehler Tags</th>
            <th>Strategie</th>
            <th>Long/Short</th>
            <th>Datum</th>
            <th>Bearbeiten</th>
          </tr>
        </thead>
        <tbody>
          {trades.length === 0 ? <div className="loader">Keine Trades vorhanden.</div> : null}
          {applyFilters(trades, filterState)
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(trade => (
              <tr key={trade._id}>
                <td ><span className='tdName' onClick={() => setSelectedTrade(trade)} style={{ cursor: "pointer" }}>{trade.name} <IoMdInformationCircle className='IoMdInformationCircle' /></span></td>
                <td>{trade.profit >= 0 ? "+" + trade.profit : trade.profit}€</td>
                <td>{trade.ratio}</td>
                <td>
                  {trade.errorTags.map((tag, index) => (
                    <span className='banner tag' key={index}>#{tag}</span>
                  ))}
                </td>
                <td><span className='banner'>{trade.strategy}</span></td>
                <td><span className={`banner ${trade.direction !== 'Long' ? 'short' : 'long'}`}>{trade.direction}</span></td>
                <td>{new Date(trade.date).toLocaleString()}</td>
                <td className='edit'>
                  <BiSolidEdit className='BiSolidEdit' onClick={() => openEditPanel(trade)} />
                  <MdDelete className='MdDelete' onClick={() => openConfirm(trade)} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {tradeToDelete && (
        <ConfirmDeleteModal
          trade={tradeToDelete}
          onCancel={closeConfirm}
          onConfirm={confirmDelete}
        />
      )}

      {showFilterPanel && (
        <FilterPanel
          filterState={filterState}
          setFilterState={setFilterState}
          onClose={() => setShowFilterPanel(false)}
        />
      )}

      {/* Info Panel – für alle Trades sichtbar */}
      {selectedTrade && (
        <TradeInfoPanel trade={selectedTrade} onClose={() => setSelectedTrade(null)} />
      )}

      {showChecklistPanel && (
        <ChecklistPanel onClose={() => setShowChecklistPanel(false)} />
      )}
    </div>
  )
}
