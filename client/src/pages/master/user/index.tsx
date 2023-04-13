import { FC, useMemo, useState } from 'react';
import { AddButton } from '../../../components/Buttons';
import TabAction from '../../../components/TabAction';
import SelectField, { SelectQueryField } from '../../../components/SelectField';
import Table, { ColumnI } from '../../../components/Table';
import InputField, { EmailField, MobileField } from '../../../components/InputField';
import { getQuery } from '../../../store';
import SideForm from '../../../components/SideForm';
import { useAddUserMutation, useDeleteUserMutation, useGetUsersQuery } from '../../../store/Master/userApi';
import Label from '../../../components/label/Label';
import { UserTypeEnum } from '../../../utils/Enum';
import { useGetRoleByIdQuery, useGetRolesQuery } from '../../../store/Master/roleApi';
import { Avatar, FormControlLabel, MenuItem, Switch } from '@mui/material';
import { useGetBranchByIdQuery, useGetBranchesQuery } from '../../../store/Master/branchApi';
import DragDropFile from '../../../components/DragDropFile';
import Page401 from '../../error/Page401';
import { useGetDesignationByIdQuery, useGetDesignationsQuery } from '../../../store/Master/designationApi';
import { useGetDepartmentByIdQuery, useGetDepartmentsQuery } from '../../../store/Master/departmentApi';

interface UserProps {}

export const RoleById = ({ id, children }: any) => {
  if (!id) return '';
  const { data } = useGetRoleByIdQuery(id);
  return children(data?.data ?? {});
};

export const BranchById = ({ id, children }: any) => {
  if (!id || id?.length == 0) return '';
  const { data } = useGetBranchByIdQuery(id);
  return children(data?.data ?? '');
};

export const DesignationById = ({ id, children }: any) => {
  if (!id || id?.length == 0) return '';
  const { data } = useGetDesignationByIdQuery(id);
  return children(data?.data ?? '');
};

export const DepartmentById = ({ id, children }: any) => {
  if (!id || id?.length == 0) return '';
  const { data } = useGetDepartmentByIdQuery(id);
  return children(data?.data ?? '');
};

const columns: ColumnI = [
  {
    name: 'avatar',
    label: '',
    format: (val: string | undefined) => <Avatar src={val} alt="photoURL" />,
    style: { py: 1.5, px: 1 },
  },
  { name: 'name', label: 'User Name' },
  {
    name: 'userType',
    label: 'User Type',
    format: (val: string) => (
      <Label color={val === UserTypeEnum.USER ? 'warning' : val === UserTypeEnum.ADMIN ? 'secondary' : 'primary'}>
        {val}
      </Label>
    ),
  },
  { name: 'mobile', label: 'Mobile' },
  { name: 'email', label: 'Email' },
  {
    name: 'branch',
    label: 'Barnch',
    format: (id: any) => <BranchById id={id}>{(barnch: { name: any }) => barnch.name}</BranchById>,
  },
  {
    name: 'department',
    label: 'Department',
    format: (id: any) => <DepartmentById id={id}>{(barnch: { name: any }) => barnch.name}</DepartmentById>,
  },
  {
    name: 'designation',
    label: 'Designation',
    format: (id: any) => <DesignationById id={id}>{(barnch: { name: any }) => barnch.name}</DesignationById>,
  },
  {
    name: 'role',
    label: 'User Role',
    format: (id: any) => <RoleById id={id}>{(role: { name: any }) => role.name}</RoleById>,
  },

  {
    name: 'isActive',
    label: 'Status',
    format: (val: any) => <Label color={val ? 'success' : 'error'}>{val ? 'Active' : 'In Active'}</Label>,
  },
];

const initialState = {
  name: '',
  isActive: true,
  mobile: '',
  email: '',
  userType: UserTypeEnum.USER,
  role: null,
  branch: null,
  avatar: null,
  designation: null,
  department: null,
};

const User: FC<UserProps> = ({}) => {
  // ==============================
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    sort: 'name',
    search: {
      name: '',
    },
  });
  const [masterFilter, setMasterFilter] = useState({});

  // =========form state ============//
  const [isDiscard, setIsDiscard] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [formState, setFormState] = useState(initialState);
  const handleFormToggle = (state = initialState) => {
    setFormState(() => ({ ...state }));
    setOpenForm(!openForm);
    setIsDiscard(false);
  };
  const onChange = (e: { target: any }) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setIsDiscard(true);
  };

  // handle get all users
  const query = useMemo(() => {
    return getQuery(filter);
  }, [filter]);
  const { data: users, isLoading, isError, error } = useGetUsersQuery({ filter: query, masterFilter });

  // =========Add/Update ============//
  const [post, postState] = useAddUserMutation();

  // =========delete Handled ============//
  const [del, deleteState] = useDeleteUserMutation();

  // =======================
  // if (isError && [401, 403].includes(error.status)) {
  //   return <Page401 />;
  // }

  return (
    <>
      <TabAction>
        <AddButton onClick={() => handleFormToggle()} />
      </TabAction>
      <Table
        // ======= LOADING ====== //
        isLoading={isLoading}
        // ======= FILTER ====== //
        filter={filter}
        setFilter={setFilter}
        // ======= EDIT ====== //
        onEditClick={(row: any) => handleFormToggle(row)}
        // ======= DELETE ====== //
        onDeleteClick={(row: { _id: any }) => del(row?._id)}
        deleteState={deleteState}
        // // ======= SELECT ====== //
        // selectList={selectList}
        // onSelectAll={(e) => setSelectAll(e.target.checked)}
        // setSelectList={setSelectList}
        // ======= SORT ====== //
        sorting={filter?.sort}
        // ======= Pagination ====== //
        paginationProps={{ count: users?.totalRecord, rowsPerPage: filter?.limit, page: filter.page }}
        // ======= ROW/COLUMNS ====== //
        columns={columns}
        rows={users?.data ?? []}
        // ========= MAster Filter =========== ///
        masterFilter={{
          state: masterFilter,
          fields: [
            { name: 'name', label: 'User Name', type: 'text' },
            {
              name: 'userType',
              label: 'User Type',
              type: 'text',
              menus: Object.entries(UserTypeEnum).map(([label, value]) => ({ value, label })),
            },
            { name: 'mobile', label: 'Mobile', type: 'number' },
            { name: 'email', label: 'Email', type: 'text' },
            {
              name: 'branch',
              label: 'Barnch',
              type: 'text',
              menus: [],
              useQuery: useGetBranchesQuery,
            },
            {
              name: 'department',
              label: 'Department',
              type: 'text',
              menus: [],
              useQuery: useGetDepartmentsQuery,
            },
            {
              name: 'designation',
              label: 'Designation',
              type: 'text',
              menus: [],
              useQuery: useGetDesignationsQuery,
            },
            {
              name: 'role',
              label: 'User Role',
              type: 'text',
              menus: [],
              useQuery: useGetRolesQuery,
            },
            {
              name: 'isActive',
              label: 'Status',
              type: 'text',
              menus: Object.entries({
                Active: true,
                InActive: false,
              }).map(([label, value]) => ({ value, label })),
            },
          ],
          onFilterChange: (mf: any) => setMasterFilter(() => mf),
        }}
        // caption
        caption={
          <div>
            All created user default password is <span style={{ fontWeight: '600' }}>User@1234</span>
          </div>
        }
      />

      <SideForm
        id="user_form"
        open={openForm}
        title="User Form"
        isDiscard={isDiscard}
        onClose={() => handleFormToggle()}
        actionState={postState}
        onFormSubmit={() => {
          post(formState);
        }}
      >
        {(checkError: boolean | undefined) => (
          <>
            <InputField
              name="name"
              label="User Name"
              checkError={checkError}
              required
              value={formState?.name}
              onChange={onChange}
            />
            <MobileField
              name="mobile"
              label="Mobile"
              required
              checkError={checkError}
              value={formState?.mobile}
              onChange={onChange}
            />
            <EmailField
              name="email"
              label="Email"
              required
              checkError={checkError}
              value={formState?.email}
              onChange={onChange}
            />

            <SelectField
              name="userType"
              label="User Type"
              required
              disabled={formState?.userType === 'superadmin'}
              checkError={checkError}
              value={formState?.userType}
              onChange={onChange}
            >
              {Object.entries(UserTypeEnum).map(([label, value]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </SelectField>

            <SelectQueryField
              checkError={checkError}
              label="Branch"
              name="branch"
              disabled={formState?.userType === 'superadmin'}
              value={formState?.branch}
              onChange={(id) => {
                onChange({
                  target: {
                    name: 'branch',
                    value: id,
                  },
                });
              }}
              link={{ label: 'Add Branch', to: '/master/branch' }}
              useQuery={useGetBranchesQuery}
            />
            <SelectQueryField
              checkError={checkError}
              label="Department"
              name="department"
              disabled={formState?.userType === 'superadmin'}
              value={formState?.department}
              onChange={(id) => {
                onChange({
                  target: {
                    name: 'department',
                    value: id,
                  },
                });
              }}
              link={{ label: 'Add Department', to: '/master/user/department' }}
              useQuery={useGetDepartmentsQuery}
            />
            <SelectQueryField
              checkError={checkError}
              label="Designation"
              name="designation"
              disabled={formState?.userType === 'superadmin'}
              value={formState?.designation}
              onChange={(id) => {
                onChange({
                  target: {
                    name: 'designation',
                    value: id,
                  },
                });
              }}
              link={{ label: 'Add Designation', to: '/master/user/designation' }}
              useQuery={useGetDesignationsQuery}
            />
            <SelectQueryField
              label="Role"
              name="role"
              disabled={formState?.userType === UserTypeEnum.ADMIN || formState?.userType === 'superadmin'}
              checkError={checkError}
              value={formState?.role}
              onChange={(id) => {
                onChange({
                  target: {
                    name: 'role',
                    value: id,
                  },
                });
              }}
              link={{ label: 'Add Role', to: '/master/user/role' }}
              useQuery={useGetRolesQuery}
            />
            <DragDropFile
              style={{ minHeight: '15vh' }}
              checkError={checkError}
              value={formState?.avatar ?? null}
              format={['jpeg', 'png', 'jpg']}
              onChange={(value) => {
                console.log('value', value);
                onChange({
                  target: {
                    name: 'avatar',
                    value: value,
                  },
                });
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formState?.isActive}
                  onChange={(e) => {
                    const { checked } = e.target;
                    onChange({ target: { name: 'isActive', value: checked } });
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={formState?.isActive ? 'Active' : 'In-Active'}
            />
          </>
        )}
      </SideForm>
    </>
  );
};

export default User;
