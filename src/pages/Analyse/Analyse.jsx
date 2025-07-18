import './Analyse.scss';
import { CapitalChart } from "../../components/dashboard/CapitalChart/CapitalChart";
import { WinrateChart } from "../../components/analytics/WinrateChart";
import { DrawdownChart } from "../../components/analytics/DrawdownChart";
import { TradesByHourChart } from "../../components/analytics/TradesByHourChart";
import { StrategyPerformanceChart } from "../../components/analytics/StrategyPerformanceChart";
import { StrategyFrequencyChart } from "../../components/analytics/StrategyFrequencyChart";
import { TagFrequencyChart } from "../../components/analytics/TagFrequencyChart";
import { DirectionAnalysisChart } from "../../components/analytics/DirectionAnalysisChart";
import { SymbolPerformanceChart } from "../../components/analytics/SymbolPerformanceChart";
import { ResultByWeekdayChart } from "../../components/analytics/ResultByWeekdayChart";
import { AvgProfitLossChart } from "../../components/analytics/AvgProfitLossChart";
import { PerformanceByHourChart } from "../../components/analytics/PerformanceByHourChart";
import { LazyChartWrapper } from '../../components/lazyChartWrapper';
import { FilterPanelWrapper } from "../../components/filterPanelWrapper";

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { FaFilter } from "react-icons/fa";
import { useAuth } from "@clerk/clerk-react"

export default function Analyse() {
  const { userId } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, []);


  const trades = useQuery(api.trades.getUserTrades, {
    userId: userId,
  });

  const [filterState, setFilterState] = useState({
    allStrategies: [],
    allTags: [],
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
  });

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [tempFilterState, setTempFilterState] = useState(null);

  useEffect(() => {
    if (!trades) return;

    const strategiesSet = new Set();
    const tagsSet = new Set();

    trades.forEach(t => {
      if (t.strategy) strategiesSet.add(t.strategy);
      if (Array.isArray(t.errorTags)) {
        t.errorTags.forEach(tag => tagsSet.add(tag));
      }
    });

    setFilterState(prev => ({
      ...prev,
      allStrategies: Array.from(strategiesSet).sort(),
      allTags: Array.from(tagsSet).sort(),
    }));
  }, [trades]);

  const filteredTrades = useMemo(() => {
    if (!trades) return [];

    return trades.filter(t => {
      const profit = typeof t.profit === 'number'
        ? t.profit
        : parseFloat(String(t.profit).replace(",", ".")) || 0;

      if (filterState.strategies.length && !filterState.strategies.includes(t.strategy)) return false;
      if (filterState.tags.length && (!Array.isArray(t.errorTags) || !t.errorTags.some(tag => filterState.tags.includes(tag)))) return false;
      if (filterState.direction !== 'all' && t.direction?.toLowerCase() !== filterState.direction.toLowerCase()) return false;
      if (filterState.showOnlyWins && profit <= 0) return false;
      if (filterState.showOnlyLosses && profit >= 0) return false;
      if (filterState.showOnlyBreakEven && profit !== 0) return false;
      if (filterState.ratioMin && t.ratio !== null && t.ratio < parseFloat(filterState.ratioMin)) return false;
      if (filterState.ratioMax && t.ratio !== null && t.ratio > parseFloat(filterState.ratioMax)) return false;
      if (filterState.profitMin && profit < parseFloat(filterState.profitMin)) return false;
      if (filterState.profitMax && profit > parseFloat(filterState.profitMax)) return false;
      if (filterState.dateFrom && new Date(t.date) < new Date(filterState.dateFrom)) return false;
      if (filterState.dateTo && new Date(t.date) > new Date(filterState.dateTo)) return false;

      return true;
    });
  }, [trades, filterState]);

  const parsedTrades = useMemo(() => {
    return filteredTrades.map(t => ({
      id: t.id ?? null,
      name: t.name ?? 'unbekannt',
      date: t.date ?? null,
      profit: typeof t.profit === 'number' ? t.profit : parseFloat(String(t.profit).replace(",", ".")) || 0,
      rrr: t.ratio ?? null,
      type: (t.direction ?? "").toLowerCase(),
      strategy: t.strategy ?? "unbekannt",
      entryPrice: t.entryPrice ?? null,
      exitPrice: t.exitPrice ?? null,
      positionSize: t.size ?? null,
      comment: t.comment ?? "",
      duration: t.duration ?? null,
      errorTags: Array.isArray(t.errorTags) ? t.errorTags : [],
    }));
  }, [filteredTrades]);

  const isFilterActive = useMemo(() => {
    return (
      filterState.strategies.length > 0 ||
      filterState.tags.length > 0 ||
      filterState.direction !== 'all' ||
      filterState.showOnlyWins ||
      filterState.showOnlyLosses ||
      filterState.showOnlyBreakEven ||
      filterState.ratioMin !== '' ||
      filterState.ratioMax !== '' ||
      filterState.profitMin !== '' ||
      filterState.profitMax !== '' ||
      filterState.dateFrom !== '' ||
      filterState.dateTo !== ''
    );
  }, [filterState]);

  if (!trades) return <div className='loader'>Lade Daten...</div>;
  if (!mounted) return null;

  if (!mounted) return <div className="panel-loading-placeholder" />;

  return (
    <div className='pageContent'>
      <header>
        <h1>Analyse</h1>
        <div className="btns">
          <button
            className={`filter ${isFilterActive ? 'active' : ''}`}
            onClick={() => {
              setTempFilterState(filterState);
              setShowFilterPanel(true);
            }}
          >
            <FaFilter /> Filter
          </button>
        </div>
      </header>

      {showFilterPanel && tempFilterState && (
        <FilterPanelWrapper
          filterState={tempFilterState}
          setFilterState={setTempFilterState}
          onApply={() => {
            setFilterState(tempFilterState);
            setShowFilterPanel(false);
          }}
          onClose={() => setShowFilterPanel(false)}
        />
      )}

      <div className="mainContent">
        {/* Row 1 */}
        <div className="row_1">
          <div className="capital-Analyse panels">
            <CapitalChart data={parsedTrades} />
          </div>
          <aside>
            <div className="winrate-Analyse panels">
              <WinrateChart trades={parsedTrades} />
            </div>
            <div className="drawdown-Analyse panels">
              <DrawdownChart trades={parsedTrades} />
            </div>
          </aside>
        </div>

        {/* Row 2 */}
        <div className="row_2">
          <div className="heatmapProfit-Time-Anaylse panels full-width">
            <LazyChartWrapper height={300}>
              <PerformanceByHourChart trades={parsedTrades} />
            </LazyChartWrapper>
          </div>
          <div className="resultByWeekday panels">
            <LazyChartWrapper height={300}>
              <ResultByWeekdayChart trades={parsedTrades} />
            </LazyChartWrapper>
          </div>
          <div className="performance-by-hour panels">
            <LazyChartWrapper height={300}>
              <TradesByHourChart trades={parsedTrades} />
            </LazyChartWrapper>
          </div>
        </div>

        {/* Row 3 */}
        <div className="row_3">
          <div className="strategy-performance panels">
            <LazyChartWrapper height={300}>
              <StrategyPerformanceChart trades={parsedTrades} />
            </LazyChartWrapper>
          </div>
          <div className="strategy-frequency panels">
            <LazyChartWrapper height={300}>
              <StrategyFrequencyChart trades={parsedTrades} />
            </LazyChartWrapper>
          </div>
          <div className="direction-analysis panels">
            <LazyChartWrapper height={300}>
              <TagFrequencyChart trades={parsedTrades} />
            </LazyChartWrapper>
          </div>
        </div>

        {/* Row 4 */}
        <div className="row_4">
          <div className="tag-frequency panels">
            <LazyChartWrapper height={300}>
              <DirectionAnalysisChart trades={parsedTrades} />
            </LazyChartWrapper>
          </div>
          <div className="profit-histogram panels">
            <LazyChartWrapper height={300}>
              <AvgProfitLossChart trades={parsedTrades} />
            </LazyChartWrapper>
          </div>
          <div className="avg-profit-loss panels">
            <LazyChartWrapper height={300}>
              <SymbolPerformanceChart trades={parsedTrades} />
            </LazyChartWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
