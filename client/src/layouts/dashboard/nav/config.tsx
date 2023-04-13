// component
import { IconButton } from '../../../components/IconButtons';

// ----------------------------------------------------------------------

const icon = (icon: string | undefined) => <IconButton title={''} icon={icon}></IconButton>;

const navConfig = [
  {
    title: 'setting',
    path: '/setting',
    icon: icon('mdi:cog'),
    child: [
      { title: 'mail', path: '/setting/mail' },
      {
        title: 'customization',
        path: '/setting/customization',
      },
    ],
  },
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('mdi:view-dashboard'),
    child: [
      { title: 'app', path: '/dashboard/app' },
      {
        title: 'user',
        path: '/dashboard/user',
      },
      {
        title: 'product',
        path: '/dashboard/products',
        icon: icon('mdi:gift-outline'),
        child: [
          { title: 'product', path: '/dashboard/products' },
          {
            title: 'blog',
            path: '/dashboard/products/blog',
          },
        ],
      },
    ],
  },
  {
    title: 'master',
    path: '/master',
    icon: icon('mdi:mastodon'),
    child: [
      { title: 'company', path: '/master/company' },
      {
        title: 'branch',
        path: '/master/branch',
      },
      {
        title: 'user',
        path: '/master/user',
        icon: icon('mdi:account-multiple-plus-outline'),
        child: [
          { title: 'users', path: '/master/users' },
          {
            title: 'department',
            path: '/master/user/department',
          },
          {
            title: 'designation',
            path: '/master/user/designation',
          },
          {
            title: 'role',
            path: '/master/user/role',
          },
          {
            title: 'page',
            path: '/master/user/page',
          },
          {
            title: 'page role',
            path: '/master/user/page_role',
          },
        ],
      },
    ],
  },
  {
    title: 'sales',
    path: '/sales',
    icon: icon('mdi:apple-keyboard-command'),
  },
];

export default navConfig;
