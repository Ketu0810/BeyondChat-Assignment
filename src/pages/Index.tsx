import { useState, useEffect } from 'react';
import ChatThread from '@/components/ChatThread';
import CopilotPanel from '@/components/CopilotPanel';
import InboxSidebar from '@/components/InboxSidebar';
import MentionsPanel from '@/components/MentionsPanel';
import { useChatStore } from '@/store/chatStore';
import { PanelRightOpen, Menu, X } from 'lucide-react';

const MOBILE_WIDTH = 768;
const SIDEBAR_WIDTH = 320;
const SIDEBAR_COLLAPSED_WIDTH = 64;
const MENTIONS_WIDTH = 320;
const COPILOT_WIDTH = 380;

const IndexPage = () => {
  const [isMentionsOpen, setIsMentionsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { expandedPanel, setExpandedPanel } = useChatStore();

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_WIDTH;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarCollapsed(true);
        setExpandedPanel(null);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setExpandedPanel]);

  // Grid column widths
  const sidebarWidth = isSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  const gridColumns = isMobile
    ? '1fr'
    : `${sidebarWidth}px ${isMentionsOpen ? MENTIONS_WIDTH + 'px' : '0px'} 1fr ${expandedPanel === 'copilot' ? COPILOT_WIDTH + 'px' : '48px'}`;

  return (
    <div className="h-screen bg-gray-50 select-none relative">
      {/* Mobile overlays */}
      {isMobile && !isSidebarCollapsed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarCollapsed(true)} />
      )}
      {isMobile && expandedPanel === 'copilot' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setExpandedPanel(null)} />
      )}
      {isMobile && isMentionsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMentionsOpen(false)} />
      )}

      {/* Mobile: Sidebar open button (top left) */}
      {isMobile && isSidebarCollapsed && (
        <button
          onClick={() => setIsSidebarCollapsed(false)}
          className="fixed top-4 left-4 z-50 p-2 bg-transparent hover:bg-gray-100 transition-colors md:hidden"
          title="Open Sidebar"
        >
          <Menu size={22} className="text-gray-700" />
        </button>
      )}
      {/* Mobile: Copilot open button (top right) */}
      {isMobile && expandedPanel !== 'copilot' && (
        <button
          onClick={() => setExpandedPanel('copilot')}
          className="fixed top-4 right-4 z-50 p-2 bg-transparent hover:bg-gray-100 transition-colors md:hidden"
          title="Open Copilot"
        >
          <PanelRightOpen size={22} className="text-gray-700" />
        </button>
      )}

      <div
        className="h-screen"
        style={{
          display: 'grid',
          gridTemplateColumns: gridColumns,
          gridTemplateRows: '1fr',
          width: '100vw',
          height: '100vh',
        }}
      >
        {/* Sidebar */}
        <div
          className={`h-full border-r border-gray-200 bg-white flex-shrink-0 transition-all duration-300 ${isMobile ? `fixed left-0 top-0 z-50 transform ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}` : ''}`}
          style={{
            width: isMobile ? SIDEBAR_WIDTH : '100%',
            position: isMobile ? 'fixed' : 'relative',
            height: '100%',
          }}
        >
          <InboxSidebar
            style={{ width: '100%', height: '100%' }}
            onMentionsToggle={setIsMentionsOpen}
            onCollapse={setIsSidebarCollapsed}
            isMentionsOpen={isMentionsOpen}
            isCollapsed={isSidebarCollapsed}
            isMobile={isMobile}
          />
          {isMobile && !isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Close Sidebar"
            >
              <X size={20} className="text-gray-600" />
            </button>
          )}
        </div>
        {/* Mentions Panel */}
        <div
          className={`h-full border-r border-gray-200 bg-white flex-shrink-0 transition-all duration-300 ${isMobile ? `fixed left-0 top-0 z-50 transform ${!isMentionsOpen ? '-translate-x-full' : 'translate-x-0'}` : ''}`}
          style={{
            width: isMobile ? MENTIONS_WIDTH : '100%',
            position: isMobile ? 'fixed' : 'relative',
            height: '100%',
          }}
        >
          <MentionsPanel
            isOpen={isMentionsOpen}
            onClose={() => setIsMentionsOpen(false)}
          />
          {isMobile && isMentionsOpen && (
            <button
              onClick={() => setIsMentionsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Close Mentions"
            >
              <X size={20} className="text-gray-600" />
            </button>
          )}
        </div>
        {/* Chat thread (center) */}
        <div className="h-full border-r border-gray-200 bg-gray-50 flex-shrink-0 min-w-0 pt-14 md:pt-0">
          <ChatThread />
        </div>
        {/* Copilot/Details panel (right) */}
        {expandedPanel === 'copilot' ? (
          <div
            className={`h-full bg-white flex-shrink-0 transition-all duration-300 ${isMobile ? `fixed right-0 top-0 z-50 transform translate-x-0` : ''}`}
            style={{
              width: isMobile ? '100%' : '100%',
              position: isMobile ? 'fixed' : 'relative',
              height: '100%',
            }}
          >
            <CopilotPanel style={{ width: '100%', height: '100%' }} />
            {isMobile && (
              <button
                onClick={() => setExpandedPanel(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Close Copilot"
              >
                <X size={20} className="text-gray-600" />
              </button>
            )}
          </div>
        ) : (
          !isMobile && (
            <div className="h-full bg-white border-l border-gray-200 flex items-start pt-4 pl-1">
              <button
                onClick={() => setExpandedPanel('copilot')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Expand Copilot"
              >
                <PanelRightOpen size={20} className="text-gray-600" />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default IndexPage;
