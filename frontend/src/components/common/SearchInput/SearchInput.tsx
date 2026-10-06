import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchInput.module.scss';

export type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  variant?: 'filled' | 'outlined';
  id?: string;
  className?: string;
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    value,
    onChange,
    ariaLabel,
    placeholder = 'Tìm kiếm',
    variant = 'filled',
    id,
    className,
  },
  forwardedRef,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement, []);

  const clearValue = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`${styles.searchInput} ${styles[variant]} ${className ?? ''}`}>
      <Search className={styles.searchIcon} aria-hidden="true" />
      <input
        ref={inputRef}
        id={id}
        className={styles.input}
        type="search"
        value={value}
        aria-label={ariaLabel}
        placeholder={placeholder}
        onChange={(event) => onChange(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && value) {
            event.preventDefault();
            onChange('');
          }
        }}
      />
      {value && (
        <button
          className={styles.clearButton}
          type="button"
          aria-label="Xóa nội dung tìm kiếm"
          onMouseDown={(event) => event.preventDefault()}
          onClick={clearValue}
        >
          <X aria-hidden="true" />
        </button>
      )}
    </div>
  );
});

export default SearchInput;
