'use client';

import React from 'react';
import { useApp } from './context/AppContext';
import { AppShell } from './components/AppShell';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AIChatAssistant } from './components/AIChatAssistant';
import { BookingHoldModal } from './components/BookingHoldModal';
import { ActivityTicker } from './components/ActivityTicker';
import { MobileDock } from './components/MobileDock';
import { PrintableInvoiceModal } from './components/PrintableInvoiceModal';

// Screens
import { LoginScreen } from './screens/Auth/LoginScreen';
import { SuperAdminDashboard } from './screens/Executive/SuperAdminDashboard';
import { GlobalAdminConfig } from './screens/Executive/GlobalAdminConfig';
import { ReportsDashboard } from './screens/Executive/ReportsDashboard';
import { EnterpriseOperations } from './screens/Executive/EnterpriseOperations';
import { BranchAdminDashboard } from './screens/Branch/BranchAdminDashboard';
import { WorkspaceAllocationBoard } from './screens/Branch/WorkspaceAllocationBoard';
import { ManageWorkspace } from './screens/Branch/ManageWorkspace';
import { StaffDirectory } from './screens/Branch/StaffDirectory';
import { OnboardingWizard } from './screens/Onboarding/OnboardingWizard';
import { MeetingRoomGallery } from './screens/MeetingRooms/MeetingRoomGallery';
import { CentreRoomCalendar } from './screens/MeetingRooms/CentreRoomCalendar';
import { VisitorPreRegistration } from './screens/Visitors/VisitorPreRegistration';
import { SecurityGatePass } from './screens/Visitors/SecurityGatePass';
import { VisitorHistory } from './screens/Visitors/VisitorHistory';
import { RaiseTicket } from './screens/Tickets/RaiseTicket';
import { TicketManagementDashboard } from './screens/Tickets/TicketManagementDashboard';
import { TicketDetail } from './screens/Tickets/TicketDetail';
import { InvoiceManagement } from './screens/Finance/InvoiceManagement';
import { InvoiceDetail } from './screens/Finance/InvoiceDetail';
import { ClientBillingDashboard } from './screens/Finance/ClientBillingDashboard';
import { VendorManagement } from './screens/Operations/VendorManagement';
import { InventoryTracking } from './screens/Operations/InventoryTracking';
import { AssetRegister } from './screens/Operations/AssetRegister';
import { LogExpense } from './screens/Expenses/LogExpense';
import { ExpenseApprovalDashboard } from './screens/Expenses/ExpenseApprovalDashboard';
import { BranchExpenseAnalytics } from './screens/Expenses/BranchExpenseAnalytics';
import { EmployeeAccessForm } from './screens/AccessRequests/EmployeeAccessForm';
import { AccessApprovalDashboard } from './screens/AccessRequests/AccessApprovalDashboard';
import { AIInsightsDashboard } from './screens/AIInsights/AIInsightsDashboard';
import { NotificationPreferences } from './screens/Settings/NotificationPreferences';

export const App = () => {
  const { currentScreen, previewInvoice, setPreviewInvoice, isDarkMode } = useApp();

  // Standalone Login Screen
  if (currentScreen === 'login') {
    return <LoginScreen />;
  }

  // Render Screen in App Shell
  const renderScreen = () => {
    switch (currentScreen) {
      case 'executive_dashboard':
        return <SuperAdminDashboard />;
      case 'admin_config':
        return <GlobalAdminConfig />;
      case 'reports':
        return <ReportsDashboard />;
      case 'enterprise_ops':
        return <EnterpriseOperations />;
      case 'dashboard':
        return <BranchAdminDashboard />;
      case 'workspace_allocation':
        return <WorkspaceAllocationBoard />;
      case 'manage_workspace':
        return <ManageWorkspace />;
      case 'staff_directory':
        return <StaffDirectory />;
      case 'onboarding_wizard':
        return <OnboardingWizard />;
      case 'book_room':
        return <MeetingRoomGallery />;
      case 'centre_calendar':
        return <CentreRoomCalendar />;
      case 'visitor_pre_reg':
        return <VisitorPreRegistration />;
      case 'gate_pass':
        return <SecurityGatePass />;
      case 'visitor_history':
        return <VisitorHistory />;
      case 'raise_ticket':
        return <RaiseTicket />;
      case 'tickets':
        return <TicketManagementDashboard />;
      case 'ticket_detail':
        return <TicketDetail />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'invoice_review':
        return <InvoiceDetail />;
      case 'client_billing':
        return <ClientBillingDashboard />;
      case 'vendors':
        return <VendorManagement />;
      case 'inventory':
        return <InventoryTracking />;
      case 'assets':
        return <AssetRegister />;
      case 'log_expense':
        return <LogExpense />;
      case 'expense_approvals':
        return <ExpenseApprovalDashboard />;
      case 'branch_expenses_analytics':
        return <BranchExpenseAnalytics />;
      case 'employee_access':
        return <EmployeeAccessForm />;
      case 'access_approvals':
        return <AccessApprovalDashboard />;
      case 'ai_insights':
        return <AIInsightsDashboard />;
      case 'notification_preferences':
        return <NotificationPreferences />;
      default:
        return <BranchAdminDashboard />;
    }
  };

  return (
    <div className={`h-screen w-screen overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      <AppShell>
        <div key={currentScreen} className="animate-fade-in-up">
          {renderScreen()}
        </div>
        <NotificationDrawer />
        <AIChatAssistant />
        <BookingHoldModal />
        <MobileDock />
        <PrintableInvoiceModal
          invoice={previewInvoice}
          onClose={() => setPreviewInvoice(null)}
        />
      </AppShell>
    </div>
  );
};
export default App;
