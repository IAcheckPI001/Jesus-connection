import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';
import styles from './FabMenu.module.scss';

export type FabAction = 'import-excel' | 'tao-phieu-diem-danh' | 'xuat-danh-sach';

type FabMenuProps = {
  onAction: (action: FabAction) => void;
  // TODO: Connect visible and ThieuNhiRow.canEdit to real permission checks.
  visible?: boolean;
};

const menuItems: { action: FabAction; label: string }[] = [
  { action: 'import-excel', label: 'Import file Excel' },
  { action: 'tao-phieu-diem-danh', label: 'Tạo phiếu điểm danh' },
  { action: 'xuat-danh-sach', label: 'Xuất file danh sách' },
];

function FabMenu({ onAction, visible = true }: FabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) itemRefs.current[activeIndex]?.focus();
  }, [activeIndex, isOpen]);

  if (!visible) return null;

  const closeMenu = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const selectAction = (action: FabAction) => {
    onAction(action);
    closeMenu();
  };

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((current) => (current + direction + menuItems.length) % menuItems.length);
    }
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {isOpen && (
        <div className={styles.menu} id="dashboard-fab-menu" role="menu" onKeyDown={handleMenuKeyDown}>
          {menuItems.map(({ action, label }, index) => (
            <button
              className={styles.menuItem}
              key={action}
              type="button"
              role="menuitem"
              tabIndex={index === activeIndex ? 0 : -1}
              ref={(element) => { itemRefs.current[index] = element; }}
              onFocus={() => setActiveIndex(index)}
              onClick={() => selectAction(action)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <button
        className={styles.trigger}
        type="button"
        ref={triggerRef}
        aria-label={isOpen ? 'Đóng menu' : 'Thêm'}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="dashboard-fab-menu"
        onClick={() => {
          if (isOpen) closeMenu();
          else {
            setActiveIndex(0);
            setIsOpen(true);
          }
        }}
      >
        {isOpen ? <X aria-hidden="true" /> : <Plus aria-hidden="true" />}
      </button>
    </div>
  );
}

export default FabMenu;
