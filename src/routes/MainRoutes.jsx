import React from 'react';
import Loadable from '../component/Loadable';
import { lazy } from 'react';
import PrivateRoute from './PrivateRoute';

// Views - Loadable Imports
const DashboardDefault = Loadable(lazy(() => import('../views/Dashboard/Default')));
const Profile = Loadable(lazy(() => import('../views/Profile/index')));
const RegionList = Loadable(lazy(() => import('../views/Regions/RegioList')));
const RegionForm = Loadable(lazy(() => import('../views/Regions/RegionForm')));
const AllTeam = Loadable(lazy(() => import('../views/TeamManagement/All')));
const AddTeam = Loadable(lazy(() => import('../views/TeamManagement/AddTeam')));
const TeamRoles = Loadable(lazy(() => import('../views/TeamManagement/TeamRoles')));
const TeamDetails = Loadable(lazy(() => import('../views/TeamManagement/TeamDetails')));
const AllCustomers = Loadable(lazy(() => import('../views/Customers/All')));
const AddCustomer2 = Loadable(lazy(() => import('../views/Customers/Add')));
const SuspendedCustomer = Loadable(lazy(() => import('../views/Customers/Suspended')));
const AddCustomer = Loadable(lazy(() => import('../views/AddCustomer/Index')));
const ConnectionForm = Loadable(lazy(() => import('../views/Customers/ConnectionForm')));
const AllPlans = Loadable(lazy(() => import('../views/Packages/AllPlans')));
const CreatePlan = Loadable(lazy(() => import('../views/Packages/CreatePlan')));
const EditPlan = Loadable(lazy(() => import('../views/Packages/EditPlan')));
const PlanCategory = Loadable(lazy(() => import('../views/Packages/PlanCategory')));
const AllPayments = Loadable(lazy(() => import('../views/Payment/All')));
const PaymentsOverview = Loadable(lazy(() => import('../views/Payment/PaymentOverview')));
const Invoices = Loadable(lazy(() => import('../views/Payment/Invoice')));
const Transactions = Loadable(lazy(() => import('../views/Payment/Transactions')));
const PendingPayments = Loadable(lazy(() => import('../views/Payment/PendingPayments')));
const PaymentsHistory = Loadable(lazy(() => import('../views/Payment/PaymentHistory')));
const Refunds = Loadable(lazy(() => import('../views/Payment/Refunds')));
// const TicketsList = Loadable(lazy(() => import('../views/TicketBoard/TicketsList')));

const TicketsList = Loadable(lazy(() => import('../views/TicketBoard/TicketsList')));
const TicketBoard = Loadable(lazy(() => import('../views/TicketBoard/Index')));
const TicketDetails = Loadable(lazy(() => import('../views/TicketDetail/Index')));

const ReferScreen = Loadable(lazy(() => import('../views/Referral/ReferScreen')));
const ReferralTrackingScreen = Loadable(lazy(() => import('../views/Referral/ReferralTrackingScreen')));
const RewardManagement = Loadable(lazy(() => import('../views/Referral/Rewards')));
const MakePaymentScreen = Loadable(lazy(() => import('../views/Payment/MakePaymentScreen')));
const PaymentHistoryScreen = Loadable(lazy(() => import('../views/Payment/PaymentHistoryScreen')));
const UtilsTypography = Loadable(lazy(() => import('../views/Utils/Typography')));
const SamplePage = Loadable(lazy(() => import('../views/SamplePage')));
const KanbanBoard2 = Loadable(lazy(() => import('../views/ProjectBoard/Index')));
const MainLayout = Loadable(lazy(() => import('../layout/MainLayout')));

const MainRoutes = [
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { path: '/', element: <DashboardDefault /> },
          { path: '/dashboard/default', element: <DashboardDefault /> },
          { path: '/Home', element: <DashboardDefault /> },
          { path: '/profile', element: <Profile /> },

          // Area / Network
          { path: '/areas', element: <RegionList /> },
          { path: '/areas/:id/view', element: <RegionForm mode="view" /> },
          { path: '/areas/:id/edit', element: <RegionForm mode="edit" /> },
          { path: '/areas/:id/create', element: <RegionForm mode="create" /> },

          // Team Management
          { path: '/team/all', element: <AllTeam /> },
          { path: '/team/:id', element: <TeamDetails /> },
          { path: '/team/create', element: <AddTeam /> },
          { path: '/team/roles', element: <TeamRoles /> },

          // Customer Management
          { path: '/customers/all', element: <AllCustomers /> },
          { path: '/customers/add', element: <ConnectionForm /> },
          { path: '/customers/create', element: <AddCustomer2 /> },
          { path: '/customers/suspended', element: <SuspendedCustomer /> },
          { path: '/customer/add', element: <AddCustomer /> },

          // Plan Management
          { path: '/plans', element: <AllPlans /> },
          { path: '/plan/create', element: <CreatePlan /> },
          { path: '/plan/edit/:id', element: <EditPlan /> },
          { path: '/plan/categories', element: <PlanCategory /> },

          // Payment Management
          { path: '/payments/all', element: <AllPayments /> },
          { path: '/payments/overview', element: <PaymentsOverview /> },
          { path: '/payments/invoices', element: <Invoices /> },
          { path: '/payments/transactions', element: <Transactions /> },
          { path: '/payments/pending', element: <PendingPayments /> },
          { path: '/payments/history', element: <PaymentsHistory /> },
          { path: '/payments/refunds', element: <Refunds /> },

          // Customer Payments
          { path: '/payment/makePayment', element: <MakePaymentScreen /> },
          { path: '/payment/paymenthistory', element: <PaymentHistoryScreen /> },

          // Tickets
          { path: '/tickets-list', element: <TicketsList /> },
          { path: '/tickets-board', element: <TicketBoard /> },
          { path: '/ticket/:ticketId', element: <TicketDetails /> },

          // Referrals
          { path: '/referral/referafriend', element: <ReferScreen /> },
          { path: '/referral/trackReferral', element: <ReferralTrackingScreen /> },
          { path: '/referrals/rewards', element: <RewardManagement /> },

          // UI Pages
          { path: '/utils/util-typography', element: <UtilsTypography /> },
          { path: '/sample-page', element: <SamplePage /> },

          // Kanban
          { path: '/kanban', element: <KanbanBoard2 /> }
        ]
      }
    ]
  }
];

export default MainRoutes;
