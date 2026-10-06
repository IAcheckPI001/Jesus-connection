import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SearchInput from '../../common/SearchInput/SearchInput';
import type { LopOption } from '../../../types/thieuNhi';
import { normalizeSearchText } from '../../../utils/thieuNhi';
import styles from './ClassPicker.module.scss';

type ClassPickerProps = {
  options: LopOption[];
  selectedId: string | null;
  onChange: (id: string) => void;
  isLoading?: boolean;
};

const INITIAL_VISIBLE_COUNT = 5;

function ClassPicker({ options, selectedId, onChange, isLoading = false }: ClassPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const panelId = `class-picker-${useId()}`;
  const selected = options.find((option) => option.id === selectedId);
  const isSearching = normalizeSearchText(search).length > 0;
  const matchingOptions = isSearching
    ? options.filter((option) => normalizeSearchText(option.ten).includes(normalizeSearchText(search)))
    : options;
  const visibleOptions = isSearching || showAll ? matchingOptions : matchingOptions.slice(0, INITIAL_VISIBLE_COUNT);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setSearch('');
    setShowAll(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    searchInputRef.current?.focus();
    const pointer = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) closePanel();
    };
    const keyboard = (event: KeyboardEvent) => { if (event.key === 'Escape') closePanel(); };
    document.addEventListener('pointerdown', pointer);
    document.addEventListener('keydown', keyboard);
    return () => {
      document.removeEventListener('pointerdown', pointer);
      document.removeEventListener('keydown', keyboard);
    };
  }, [isOpen, closePanel]);

  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current || !wrapperRef.current) return undefined;
    const align = () => {
      if (!panelRef.current || !wrapperRef.current) return;
      const bounds = wrapperRef.current.getBoundingClientRect();
      const width = panelRef.current.getBoundingClientRect().width;
      panelRef.current.classList.toggle(styles.panelAlignRight, bounds.left + width > window.innerWidth - 16);
    };
    align();
    window.addEventListener('resize', align);
    return () => window.removeEventListener('resize', align);
  }, [isOpen, options.length, search, showAll]);

  const title = isLoading ? '' : selected?.ten ?? 'Chọn lớp';
  return (
    <div className={styles.pickerWrapper} ref={wrapperRef}>
      <h2 className={styles.heading}>
        {options.length <= 1 ? (
          <span className={styles.staticTitle}>{isLoading ? <span className={styles.titleSkeleton} aria-label="Đang tải lớp" /> : title}</span>
        ) : (
          <button ref={triggerRef} className={styles.trigger} type="button" aria-haspopup="dialog" aria-expanded={isOpen} aria-controls={panelId} disabled={isLoading} onClick={() => setIsOpen((open) => !open)}>
            {isLoading ? <span className={styles.titleSkeleton} aria-label="Đang tải lớp" /> : <span className={styles.triggerLabel}>{title}</span>}
            {!isLoading && (isOpen ? <ChevronUp className={styles.chevron} aria-hidden="true" /> : <ChevronDown className={styles.chevron} aria-hidden="true" />)}
          </button>
        )}
      </h2>
      {isOpen && options.length > 1 && (
        <div className={styles.panel} id={panelId} ref={panelRef} role="dialog" aria-label="Chọn một lớp">
          <span className={styles.panelTitle}>Chọn một lớp</span>
          <SearchInput ref={searchInputRef} value={search} onChange={setSearch} ariaLabel="Tìm kiếm lớp" placeholder="Tìm kiếm lớp" variant="outlined" />
          {isSearching && matchingOptions.length === 0 ? <div className={styles.emptyState} role="status">Không tìm thấy lớp</div> : <>
            <ul className={styles.optionsList}>
              {visibleOptions.map((option) => <li key={option.id}>
                <label className={styles.checkRow}>
                  <input className={styles.checkbox} type="radio" name="selected-class" checked={selectedId === option.id} onChange={() => { onChange(option.id); closePanel(); }} aria-label={option.ten} />
                  <span className={styles.checkLabel}>{option.ten}</span>
                </label>
              </li>)}
            </ul>
            {!isSearching && options.length > INITIAL_VISIBLE_COUNT && <button className={styles.expandButton} type="button" onClick={() => setShowAll((open) => !open)}>{showAll ? 'Thu gọn' : 'Xem thêm'}</button>}
          </>}
        </div>
      )}
    </div>
  );
}

export default ClassPicker;
