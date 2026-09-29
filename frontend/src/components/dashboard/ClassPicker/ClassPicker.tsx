import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SearchInput from '../../common/SearchInput/SearchInput';
import type { LopOption } from '../../../types/thieuNhi';
import { normalizeSearchText } from '../../../utils/thieuNhi';
import styles from './ClassPicker.module.scss';

type ClassPickerProps = {
  options: LopOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  isLoading?: boolean;
};

const INITIAL_VISIBLE_COUNT = 5;

function ClassPicker({ options, selectedIds, onChange, isLoading = false }: ClassPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const allCheckboxRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const panelId = `class-picker-${useId()}`;

  const selectedOptions = options.filter((option) => selectedIds.includes(option.id));
  const selectedCount = selectedOptions.length;
  const allSelected = options.length > 0 && selectedCount === options.length;
  const partiallySelected = selectedCount > 0 && !allSelected;
  const hasSelectedAfterInitialList = options
    .slice(INITIAL_VISIBLE_COUNT)
    .some((option) => selectedIds.includes(option.id));
  const normalizedSearch = normalizeSearchText(search);
  const isSearching = normalizedSearch.length > 0;
  const matchingOptions = isSearching
    ? options.filter((option) => normalizeSearchText(option.ten).includes(normalizedSearch))
    : options;
  const visibleOptions = isSearching || showAll
    ? matchingOptions
    : matchingOptions.slice(0, INITIAL_VISIBLE_COUNT);

  const title = options.length === 0
    ? 'Tất cả lớp'
    : selectedCount === options.length
      ? 'Tất cả lớp'
      : selectedCount === 1
        ? selectedOptions[0].ten
        : selectedCount > 1
          ? `${selectedCount} lớp`
          : 'Chọn lớp';

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setSearch('');
    setShowAll(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    searchInputRef.current?.focus();
    const handlePointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        closePanel();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePanel();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closePanel]);

  useEffect(() => {
    if (allCheckboxRef.current) {
      allCheckboxRef.current.indeterminate = partiallySelected;
    }
  }, [isOpen, partiallySelected]);

  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current || !wrapperRef.current) return undefined;

    const updateAlignment = () => {
      if (!panelRef.current || !wrapperRef.current) return;
      const triggerBounds = wrapperRef.current.getBoundingClientRect();
      const panelWidth = panelRef.current.getBoundingClientRect().width;
      const needsRightAlignment = triggerBounds.left + panelWidth > window.innerWidth - 16;
      panelRef.current.classList.toggle(styles.panelAlignRight, needsRightAlignment);
    };

    updateAlignment();
    window.addEventListener('resize', updateAlignment);
    return () => window.removeEventListener('resize', updateAlignment);
  }, [isOpen, options.length, isSearching, showAll]);

  const togglePanel = () => {
    if (isOpen) {
      closePanel();
      return;
    }

    setSearch('');
    setShowAll(hasSelectedAfterInitialList);
    setIsOpen(true);
  };

  const toggleClass = (id: string, checked: boolean) => {
    if (checked) {
      if (!selectedIds.includes(id)) onChange([...selectedIds, id]);
      return;
    }

    if (selectedCount <= 1) return;
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const handleSelectAll = () => {
    if (!allSelected) onChange(options.map((option) => option.id));
  };

  return (
    <div className={styles.pickerWrapper} ref={wrapperRef}>
      <h2 className={styles.heading}>
        {options.length <= 1 ? (
          <span className={styles.staticTitle}>
            {isLoading ? <span className={styles.titleSkeleton} aria-label="Đang tải lớp" /> : title}
          </span>
        ) : (
          <button
            ref={triggerRef}
            className={styles.trigger}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={panelId}
            disabled={isLoading}
            onClick={togglePanel}
          >
            {isLoading ? (
              <span className={styles.titleSkeleton} aria-label="Đang tải lớp" />
            ) : (
              <span className={styles.triggerLabel}>{title}</span>
            )}
            {!isLoading && (isOpen
              ? <ChevronUp className={styles.chevron} aria-hidden="true" />
              : <ChevronDown className={styles.chevron} aria-hidden="true" />)}
          </button>
        )}
      </h2>

      {isOpen && options.length > 1 && (
        <div
          className={styles.panel}
          id={panelId}
          ref={panelRef}
          role="dialog"
          aria-label="Chọn lớp"
        >
          <span className={styles.panelTitle}>Danh sách lớp</span>
          <SearchInput
            ref={searchInputRef}
            value={search}
            onChange={setSearch}
            ariaLabel="Tìm kiếm lớp"
            placeholder="Tìm kiếm lớp"
            variant="outlined"
          />

          {isSearching && matchingOptions.length === 0 ? (
            <div className={styles.emptyState} role="status" aria-live="polite">
              Không tìm thấy lớp
            </div>
          ) : (
            <>
              {!isSearching && (
                <label className={styles.checkRow}>
                  <input
                    ref={allCheckboxRef}
                    className={styles.checkbox}
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    aria-label="Tất cả"
                  />
                  <span className={styles.checkLabel}>Tất cả</span>
                </label>
              )}
              <ul className={styles.optionsList}>
                {visibleOptions.map((option) => (
                  <li key={option.id}>
                    <label className={styles.checkRow}>
                      <input
                        className={styles.checkbox}
                        type="checkbox"
                        checked={selectedIds.includes(option.id)}
                        onChange={(event) => toggleClass(option.id, event.currentTarget.checked)}
                        aria-label={option.ten}
                      />
                      <span className={styles.checkLabel}>{option.ten}</span>
                    </label>
                  </li>
                ))}
              </ul>
              {!isSearching && options.length > INITIAL_VISIBLE_COUNT && (
                <button
                  className={styles.expandButton}
                  type="button"
                  onClick={() => setShowAll((expanded) => !expanded)}
                >
                  {showAll ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ClassPicker;
