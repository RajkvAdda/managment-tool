import { FC, useEffect, useMemo, useState } from 'react';
import { Checkbox } from '@mui/material';
import { SubmitButton } from '../../../components/Buttons';
import TabAction from '../../../components/TabAction';
import Table from '../../../components/Table';
import { useGetPagesQuery } from '../../../store/Master/pageApi';
import { SelectQueryField } from '../../../components/SelectField';
import { PermissionEnum } from '../../../utils/Enum';
import { useGetRolesQuery, useUpdateRoleMutation } from '../../../store/Master/roleApi';
import { getQuery } from '../../../store';
import Label from '../../../components/label/Label';

interface PageProps {}

const PageRole: FC<PageProps> = ({}) => {
  // ==============================
  const [filter, setFilter] = useState({
    sort: 'module',
    search: {
      name: '',
    },
  });

  // =========form state ============//
  const [roleId, setRoleId] = useState(0);
  const [isDiscard, setIsDiscard] = useState(false);
  let [formState, setFormState] = useState({});
  const onChange = (name, value, checked) => {
    if (checked) {
      formState = {
        ...formState,
        [name]: formState?.[name] ? [...formState?.[name], value] : value != 2 ? [2, value] : [value],
      };
    } else {
      formState = {
        ...formState,
        [name]: formState?.[name] ? formState?.[name]?.filter((li) => li != value) : [],
      };
    }
    setFormState(() => ({ ...formState }));
    setIsDiscard(true);
  };
  console.log('formState', formState);

  // handle get all pages
  const query = useMemo(() => {
    return getQuery(filter);
  }, [filter]);
  const { data: pages, isLoading } = useGetPagesQuery(query);

  // =========Add/Update ============//
  const [put, putState] = useUpdateRoleMutation();

  // ========== column
  const columns = useMemo(() => {
    return [
      { name: 'name', label: 'Page Name' },
      { name: 'moduleName', label: 'Module Name', format: (id) => <Label>{id}</Label> },
      {
        name: 'id',
        label: 'Read',
        style: { textAlign: 'right' },
        format: (id) => (
          <Checkbox
            color="primary"
            inputProps={{ 'aria-label': 'controlled' }}
            checked={formState?.[id] ? formState?.[id]?.includes(PermissionEnum.GET) : true}
            onChange={(e) => {
              const { checked } = e.target;
              onChange(id, PermissionEnum.GET, checked);
            }}
          />
        ),
      },
      {
        name: 'id',
        label: 'Create',
        style: { textAlign: 'right' },
        format: (id) => (
          <Checkbox
            color="secondary"
            inputProps={{ 'aria-label': 'controlled' }}
            checked={formState?.[id]?.includes(PermissionEnum.POST)}
            onChange={(e) => {
              const { checked } = e.target;
              onChange(id, PermissionEnum.POST, checked);
            }}
          />
        ),
      },
      {
        name: 'id',
        label: 'Update',
        style: { textAlign: 'right' },
        format: (id) => (
          <Checkbox
            color="warning"
            inputProps={{ 'aria-label': 'controlled' }}
            checked={formState?.[id]?.includes(PermissionEnum.PUT)}
            onChange={(e) => {
              const { checked } = e.target;
              onChange(id, PermissionEnum.PUT, checked);
            }}
          />
        ),
      },
      {
        name: 'id',
        label: 'Delete',
        style: { textAlign: 'right' },
        format: (id) => (
          <Checkbox
            color="error"
            inputProps={{ 'aria-label': 'controlled' }}
            checked={formState?.[id]?.includes(PermissionEnum.DELETE)}
            onChange={(e) => {
              const { checked } = e.target;
              onChange(id, PermissionEnum.DELETE, checked);
              console.log('idsf', id);
            }}
          />
        ),
      },
    ];
  }, [formState, roleId]);

  return (
    <>
      <TabAction>
        <SubmitButton
          actionState={putState}
          onClick={() => {
            if (!isDiscard) return alert('Did not find any changes!');
            if (roleId == 0) return alert('Select Role to update changes!');

            put({
              id: roleId,
              body: {
                permission: {
                  ...formState,
                },
              },
            });
          }}
        />
      </TabAction>
      <Table
        tableProps={{ size: 'small' }}
        // ======= LOADING ====== //
        isLoading={isLoading}
        // ======= FILTER ====== //
        filter={filter}
        setFilter={setFilter}
        action={
          <SelectQueryField
            size="small"
            sx={{ mb: 0 }}
            placeholder="Role"
            name="_id"
            value={roleId}
            onChange={(id, list) => {
              setRoleId(() => id);
              setFormState(() => ({ ...(list?.permission ?? {}) }));
              setIsDiscard(() => false);
              console.log('list', list);
            }}
            useQuery={useGetRolesQuery}
          />
        }
        // ======= SORT ====== //
        sorting={filter?.sort}
        // ====================
        columns={columns}
        rows={pages?.data ?? []}
      />
    </>
  );
};

export default PageRole;
