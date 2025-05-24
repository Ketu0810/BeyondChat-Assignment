import React, { useState, CSSProperties } from 'react';
import { Inbox, AtSign, Pencil, Layers, Eye, BarChart, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface InboxSidebarProps {
  style?: CSSProperties;
  onMentionsToggle?: (open: boolean) => void;
  onCollapse?: (collapsed: boolean) => void;
  isMentionsOpen?: boolean;
  isCollapsed?: boolean;
  isMobile?: boolean;
}

const navItems = [
  { icon: <Inbox size={18} />, label: 'Your inbox', badge: 1 },
  { icon: <AtSign size={18} />, label: 'Mentions', badge: 12 },
  { icon: <Pencil size={18} />, label: 'Created by you', badge: 0 },
  { icon: <Layers size={18} />, label: 'All', badge: 2370 },
  { icon: <Eye size={18} />, label: 'Unassigned', badge: 0 },
  { icon: <BarChart size={18} />, label: 'Dashboard' },
  { icon: <Settings size={18} />, label: 'Settings' },
];

const InboxSidebar: React.FC<InboxSidebarProps> = ({ style, onMentionsToggle, onCollapse, isMentionsOpen, isCollapsed = false, isMobile = false }) => {
  const [active, setActive] = useState('Your inbox');

  const handleItemClick = (label: string) => {
    if (label === 'Mentions') {
      onMentionsToggle?.(!isMentionsOpen);
    } else {
      onMentionsToggle?.(false);
    }
    setActive(label);
  };

  const handleCollapse = () => {
    onCollapse?.(!isCollapsed);
  };

  return (
    <aside
      className={`h-full flex flex-col bg-white border-r border-border select-none font-sans text-[15px] transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} ${isMobile ? '' : 'relative'}`}
      style={style}
    >
      {/* Top: Section title and add button */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        {!isCollapsed && <span className="text-xl font-semibold">Inbox</span>}
        <div className="flex items-center gap-2">
          {!isCollapsed && !isMobile && (
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition">
              <span className="text-2xl font-light">+</span>
            </button>
          )}
          {!isMobile && (
            <button
              onClick={handleCollapse}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>
      </div>
      {/* Main nav */}
      <nav className="flex-1 px-2 pb-2 overflow-y-auto scrollbar-hide">
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={item.label}>
              <SidebarItem
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                active={active === item.label}
                onClick={() => handleItemClick(item.label)}
                isCollapsed={isCollapsed}
              />
            </li>
          ))}
        </ul>
      </nav>
      {/* Bottom bar */}
      <div className="flex items-center justify-center px-2 py-3 bg-white mt-auto">
        {!isCollapsed && (
          <div className="flex items-center gap-3 w-full bg-white rounded-xl shadow border border-gray-100 px-3 py-2 hover:shadow-md transition">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-8 h-8 rounded-full border border-border" />
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-900">Alex Johnson</span>
              <span className="text-xs text-gray-400">alex.johnson@email.com</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

const SidebarItem = ({
  icon,
  label,
  badge,
  active,
  onClick,
  isCollapsed
}: {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  active?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}) => (
  <button
    className={`flex items-center w-full px-2 py-2 rounded font-medium text-foreground hover:bg-muted transition relative ${active ? 'bg-muted font-semibold' : ''}`}
    onClick={onClick}
    tabIndex={0}
    aria-current={active ? 'page' : undefined}
    title={isCollapsed ? label : undefined}
  >
    <div className="w-8 h-8 flex items-center justify-center">
      {icon}
    </div>
    {!isCollapsed && (
      <>
        <span className="ml-3 flex-1 text-left text-base">{label}</span>
        {typeof badge === 'number' && badge > 0 && (
          <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-foreground min-w-[24px] text-center align-middle inline-block">{badge}</span>
        )}
      </>
    )}
  </button>
);

export default InboxSidebar;
