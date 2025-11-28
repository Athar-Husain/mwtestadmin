// assets
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import FormatColorTextOutlinedIcon from '@mui/icons-material/FormatColorTextOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

const icons = {
  NavigationOutlinedIcon,
  AccountTreeOutlinedIcon,
  AppsOutlinedIcon,
  ContactSupportOutlinedIcon,
  BlockOutlinedIcon,
  ChromeReaderModeOutlinedIcon,
  SecurityOutlinedIcon,
  HelpOutlineOutlinedIcon,
  DashboardOutlinedIcon,
  PeopleAltOutlinedIcon,
  PersonAddAlt1OutlinedIcon,
  SupervisorAccountOutlinedIcon,
  GroupOutlinedIcon,
  ReportProblemOutlinedIcon,
  BusinessCenterOutlinedIcon,
  TaskOutlinedIcon,
  AssignmentTurnedInOutlinedIcon,
  WifiOutlinedIcon,
  PaymentOutlinedIcon,
  ReceiptLongOutlinedIcon,
  MonetizationOnOutlinedIcon,
  HourglassEmptyOutlinedIcon,
  HistoryOutlinedIcon,
  ReplayOutlinedIcon,
  CategoryOutlinedIcon,
  StarBorderOutlinedIcon,
  DoneAllOutlinedIcon,
  NewReleasesOutlinedIcon,
  RedeemOutlinedIcon,
  LoginOutlinedIcon,
  AppRegistrationOutlinedIcon,
  FormatColorTextOutlinedIcon,
  InsightsOutlinedIcon
};

// ==============================|| MENU ITEMS ||============================== //
export default {
  items: [
    {
      id: 'navigation',
      title: 'MW FiberNet',
      caption: 'Dashboard & Profile',
      type: 'group',
      icon: icons.NavigationOutlinedIcon,
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons.DashboardOutlinedIcon,
          url: '/dashboard/default'
        },
        // {
        //   id: 'profile',
        //   title: 'User Profile',
        //   type: 'item',
        //   icon: icons.SupervisorAccountOutlinedIcon,
        //   url: '/profile'
        // }
      ]
    },
    {
      id: 'pages',
      title: 'Pages & Management',
      type: 'group',
      icon: icons.NavigationOutlinedIcon,
      children: [
        // Sample Page & Regions
        {
          id: 'Area-management',
          title: 'Network Area',
          type: 'collapse',
          icon: icons.WifiOutlinedIcon,
          children: [
            {
              id: 'network-view2',
              title: 'View Network',
              type: 'item',
              icon: icons.ChromeReaderModeOutlinedIcon,
              url: '/areas'
            }
          ]
        },


        // Team Management
        {
          id: 'team-management',
          title: 'Team Management',
          type: 'collapse',
          icon: icons.GroupOutlinedIcon,
          children: [
            {
              id: 'all-teams',
              title: 'All Teams',
              type: 'item',
              icon: icons.PeopleAltOutlinedIcon,
              url: '/team/all'
            },
            {
              id: 'add-team',
              title: 'Add Team',
              type: 'item',
              icon: icons.PersonAddAlt1OutlinedIcon,
              url: '/team/create'
            },
            {
              id: 'suspended-teams',
              title: 'Suspended Teams',
              type: 'item',
              icon: icons.BlockOutlinedIcon,
              url: '/team/suspended'
            },
            {
              id: 'team-roles',
              title: 'Roles',
              type: 'item',
              icon: icons.SupervisorAccountOutlinedIcon,
              url: '/team/roles'
            }
          ]
        },

        // Packages
        {
          id: 'Plans-management',
          title: 'Plans Management',
          type: 'collapse',
          icon: icons.ChromeReaderModeOutlinedIcon,
          children: [
            {
              id: 'all-Plans',
              title: 'All Plans',
              type: 'item',
              icon: icons.ChromeReaderModeOutlinedIcon,
              url: '/plans'
            },
            {
              id: 'create-Plan',
              title: 'Create Plan',
              type: 'item',
              icon: icons.AppRegistrationOutlinedIcon,
              url: '/plan/create'
            },

            {
              id: 'create-Plans',
              title: 'Create Plans',
              type: 'item',
              icon: icons.AppRegistrationOutlinedIcon,
              url: '/packages/create'
            },
            {
              id: 'active-Plans',
              title: 'Active Plans',
              type: 'item',
              icon: icons.DoneAllOutlinedIcon,
              url: '/packages/active'
            }, {
              id: 'featured-Plans',
              title: 'Featured Plans',
              type: 'item',
              icon: icons.StarBorderOutlinedIcon,
              url: '/packages/featured'
            },
            {
              id: 'Plans-categories',
              title: 'Plans Categories',
              type: 'item',
              icon: icons.CategoryOutlinedIcon,
              url: '/packages/categories'
            }
          ]
        },

        // Customer Management
        {
          id: 'customer-management',
          title: 'Customer Management',
          type: 'collapse',
          icon: icons.PeopleAltOutlinedIcon,
          children: [
            {
              id: 'all-customers',
              title: 'All Customers',
              type: 'item',
              icon: icons.PeopleAltOutlinedIcon,
              url: '/customers/all'
            },
            {
              id: 'create-customer1',
              title: 'Add Customer',
              type: 'item',
              icon: icons.PersonAddAlt1OutlinedIcon,
              url: '/customer/add'
            },
            // {
            //   id: 'create-customer',
            //   title: 'Add Customer',
            //   type: 'item',
            //   icon: icons.PersonAddAlt1OutlinedIcon,
            //   url: '/customers/create'
            // },
            {
              id: 'add-connection',
              title: 'Add Connection',
              type: 'item',
              icon: icons.AppRegistrationOutlinedIcon,
              url: '/customers/add'
            },
            {
              id: 'suspended-customers',
              title: 'Suspended',
              type: 'item',
              icon: icons.BlockOutlinedIcon,
              url: '/customers/suspended'
            }
          ]
        },

        {
          id: 'sample-page',
          title: 'Sample Page',
          type: 'item',
          url: '/sample-page',
          icon: icons.ChromeReaderModeOutlinedIcon
        },



        // {
        //   id: 'region-actions',
        //   title: 'Region Actions',
        //   type: 'collapse',
        //   icon: icons.CategoryOutlinedIcon,
        //   children: [
        //     {
        //       id: 'region-create',
        //       title: 'Create Region',
        //       type: 'item',
        //       url: '/regions/:id/create',
        //       icon: icons.AppRegistrationOutlinedIcon
        //     },
        //     {
        //       id: 'region-view',
        //       title: 'View Region',
        //       type: 'item',
        //       url: '/regions/:id/view',
        //       icon: icons.ChromeReaderModeOutlinedIcon
        //     },
        //     {
        //       id: 'region-edit',
        //       title: 'Edit Region',
        //       type: 'item',
        //       url: '/regions/:id/edit',
        //       icon: icons.AppRegistrationOutlinedIcon
        //     }
        //   ]
        // },
        // Projects
        {
          id: 'Project',
          title: 'Projects',
          type: 'collapse',
          icon: icons.BusinessCenterOutlinedIcon,
          children: [
            {
              id: 'test',
              title: 'Test Projects Board',
              type: 'item',
              icon: icons.DoneAllOutlinedIcon,
              url: '/projects/test'
            },
            {
              id: 'allprojects',
              title: 'All Projects',
              type: 'item',
              icon: icons.DoneAllOutlinedIcon,
              url: '/projects/allprojects'
            },
            {
              id: 'create-project',
              title: 'Create Project',
              type: 'item',
              icon: icons.AppRegistrationOutlinedIcon,
              url: '/projects/create-project'
            }
          ]
        },
        // Kanban Boards
        {
          id: 'kanban-boards',
          title: 'Kanban Boards',
          type: 'collapse',
          icon: icons.AppsOutlinedIcon,
          children: [
            {
              id: 'kanban',
              title: 'Board 1',
              type: 'item',
              icon: icons.AppsOutlinedIcon,
              url: '/kanban'
            },
            {
              id: 'kanban2',
              title: 'Board 2',
              type: 'item',
              icon: icons.AppsOutlinedIcon,
              url: '/kanban2'
            }
          ]
        },
        // Tasks
        {
          id: 'tasks',
          title: 'Tasks',
          type: 'collapse',
          icon: icons.TaskOutlinedIcon,
          children: [
            {
              id: 'alltasks',
              title: 'All Tasks',
              type: 'item',
              icon: icons.AssignmentTurnedInOutlinedIcon,
              url: '/tasks/allTasks'
            }
          ]
        },
        // Complaints
        // {
        //   id: 'complaints',
        //   title: 'Complaints',
        //   type: 'collapse',
        //   icon: icons.ReportProblemOutlinedIcon,
        //   children: [
        //     {
        //       id: 'allcomplaints',
        //       title: 'All Complaints',
        //       type: 'item',
        //       icon: icons.ReportProblemOutlinedIcon,
        //       url: '/complaints/all'
        //     },
        //     {
        //       id: 'open-complaints',
        //       title: 'Open',
        //       type: 'item',
        //       icon: icons.HourglassEmptyOutlinedIcon,
        //       url: '/complaints/open'
        //     },
        //     {
        //       id: 'tickets',
        //       title: 'Tickets',
        //       type: 'item',
        //       icon: icons.HourglassEmptyOutlinedIcon,
        //       url: '/tickets'
        //     },
        //     {
        //       id: 'resolved',
        //       title: 'Resolved',
        //       type: 'item',
        //       icon: icons.DoneAllOutlinedIcon,
        //       url: '/complaints/resolved'
        //     },
        //     {
        //       id: 'issues',
        //       title: 'Complaints Issues',
        //       type: 'item',
        //       icon: icons.NewReleasesOutlinedIcon,
        //       url: '/complaints/issues'
        //     }
        //   ]
        // },
        {
          id: 'tickets-management',
          title: 'Tickets & Complaints',
          type: 'collapse',
          icon: icons.ReportProblemOutlinedIcon,
          children: [
            {
              id: 'allcomplaints',
              title: 'All Tickets',
              type: 'item',
              icon: icons.ReportProblemOutlinedIcon,
              url: '/tickets'
            },
            {
              id: 'open-complaints',
              title: 'Open',
              type: 'item',
              icon: icons.HourglassEmptyOutlinedIcon,
              url: '/complaints/open'
            },
            {
              id: 'tickets',
              title: 'Tickets',
              type: 'item',
              icon: icons.HourglassEmptyOutlinedIcon,
              url: '/tickets'
            },
            {
              id: 'tickets-board',
              title: 'Tickets Board',
              type: 'item',
              icon: icons.HourglassEmptyOutlinedIcon,
              url: '/tickets-board'
            },
            {
              id: 'resolved',
              title: 'Resolved',
              type: 'item',
              icon: icons.DoneAllOutlinedIcon,
              url: '/complaints/resolved'
            },
            {
              id: 'issues',
              title: 'Complaints Issues',
              type: 'item',
              icon: icons.NewReleasesOutlinedIcon,
              url: '/complaints/issues'
            }
          ]
        },

        // Admin Management
        {
          id: 'admin-management',
          title: 'Administration Management',
          type: 'collapse',
          icon: icons.SupervisorAccountOutlinedIcon,
          children: [
            {
              id: 'all-admins',
              title: 'All Admins',
              type: 'item',
              icon: icons.PeopleAltOutlinedIcon,
              url: '/admin/all'
            },
            {
              id: 'add-admin',
              title: 'Add Admin',
              type: 'item',
              icon: icons.PersonAddAlt1OutlinedIcon,
              url: '/admin/create'
            },
            {
              id: 'suspended-admins',
              title: 'Suspended Admins',
              type: 'item',
              icon: icons.BlockOutlinedIcon,
              url: '/admin/suspended'
            },
            {
              id: 'admin-roles',
              title: 'Admin Roles',
              type: 'item',
              icon: icons.SupervisorAccountOutlinedIcon,
              url: '/admin/roles'
            }
          ]
        },
        // Network
        // {
        //   id: 'network-management',
        //   title: 'Manage Network',
        //   type: 'collapse',
        //   icon: icons.WifiOutlinedIcon,
        //   children: [
        //     {
        //       id: 'network-view',
        //       title: 'View Network',
        //       type: 'item',
        //       icon: icons.ChromeReaderModeOutlinedIcon,
        //       url: '/network/all'
        //     }
        //   ]
        // },
        // Setup Box
        // {
        //   id: 'setupbox-management',
        //   title: 'Setup Box',
        //   type: 'collapse',
        //   icon: icons.WifiOutlinedIcon,
        //   children: [
        //     {
        //       id: 'all-setupbox',
        //       title: 'View All Setup Boxes',
        //       type: 'item',
        //       icon: icons.ChromeReaderModeOutlinedIcon,
        //       url: '/setupbox/all'
        //     },
        //     {
        //       id: 'add-setupbox',
        //       title: 'Add Setup Box',
        //       type: 'item',
        //       icon: icons.AppRegistrationOutlinedIcon,
        //       url: '/setupbox/create'
        //     },
        //     {
        //       id: 'suspended-setupbox',
        //       title: 'Suspended Setup Boxes',
        //       type: 'item',
        //       icon: icons.BlockOutlinedIcon,
        //       url: '/setupbox/suspended'
        //     }
        //   ]
        // },

        // Payment Management
        {
          id: 'payment-management',
          title: 'Manage Payment',
          type: 'collapse',
          icon: icons.PaymentOutlinedIcon,
          children: [
            {
              id: 'payment-overview',
              title: 'Payments Overview',
              type: 'item',
              icon: icons.PaymentOutlinedIcon,
              url: '/payments/overview'
            },
            {
              id: 'all-payments',
              title: 'All Payments',
              type: 'item',
              icon: icons.PaymentOutlinedIcon,
              url: '/payments/all'
            },
            {
              id: 'invoices',
              title: 'Invoices',
              type: 'item',
              icon: icons.ReceiptLongOutlinedIcon,
              url: '/payments/invoices'
            },
            {
              id: 'transactions',
              title: 'Transactions',
              type: 'item',
              icon: icons.MonetizationOnOutlinedIcon,
              url: '/payments/transactions'
            },
            {
              id: 'pending-payments',
              title: 'Pending Payments',
              type: 'item',
              icon: icons.HourglassEmptyOutlinedIcon,
              url: '/payments/pending'
            },
            {
              id: 'payment-history',
              title: 'Payment History',
              type: 'item',
              icon: icons.HistoryOutlinedIcon,
              url: '/payments/history'
            },
            {
              id: 'refunds',
              title: 'Refunds',
              type: 'item',
              icon: icons.ReplayOutlinedIcon,
              url: '/payments/refunds'
            }
          ]
        },
        // Referral Management
        {
          id: 'referral-management',
          title: 'Referral Management',
          type: 'collapse',
          icon: icons.RedeemOutlinedIcon,
          children: [
            {
              id: 'referrals-overview',
              title: 'Overview & Stats',
              type: 'item',
              icon: icons.InsightsOutlinedIcon,
              url: '/referrals/overview'
            },
            {
              id: 'referrals-users',
              title: 'Referred Users',
              type: 'item',
              icon: icons.GroupOutlinedIcon,
              url: '/referrals/users'
            },
            {
              id: 'referral-rewards',
              title: 'Rewards Issued',
              type: 'item',
              icon: icons.RedeemOutlinedIcon,
              url: '/referrals/rewards'
            }
          ]
        },
        // Authentication
        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: icons.SecurityOutlinedIcon,
          children: [
            {
              id: 'login',
              title: 'Login',
              type: 'item',
              icon: icons.LoginOutlinedIcon,
              url: '/application/login',
              target: true
            },
            {
              id: 'register',
              title: 'Register',
              type: 'item',
              icon: icons.AppRegistrationOutlinedIcon,
              url: '/application/register',
              target: true
            }
          ]
        }
      ]
    },
    {
      id: 'utils',
      title: 'Utils',
      type: 'group',
      icon: icons.AccountTreeOutlinedIcon,
      children: [
        {
          id: 'util-icons',
          title: 'Icons',
          type: 'item',
          icon: icons.AppsOutlinedIcon,
          external: true
        },
        {
          id: 'util-typography',
          title: 'Typography',
          type: 'item',
          icon: icons.FormatColorTextOutlinedIcon,
          url: '/utils/util-typography'
        }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      type: 'group',
      icon: icons.ContactSupportOutlinedIcon,
      children: [
        {
          id: 'disabled-menu',
          title: 'Disabled Menu',
          type: 'item',
          url: '#',
          icon: icons.BlockOutlinedIcon,
          disabled: true
        },
        {
          id: 'documentation',
          title: 'Documentation',
          type: 'item',
          icon: icons.HelpOutlineOutlinedIcon,
          chip: {
            label: 'Help?',
            color: 'primary'
          },
          external: true
        }
      ]
    }
  ]
};
