
import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'Bản tin tuần', path: '/reports' },
  { label: 'Danh sách lớp', path: '/classes' },
  { label: 'Hoạt động', path: '/activities' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;