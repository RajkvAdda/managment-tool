import { FC, useEffect, useMemo, useState } from 'react';
import { AddButton } from '../../../components/Buttons';
import TabAction from '../../../components/TabAction';
import Table, { ColumnI } from '../../../components/Table';
import InputField from '../../../components/InputField';
import { getQuery } from '../../../store';
import { useAddRoleMutation, useDeleteRoleMutation, useGetRolesQuery } from '../../../store/Master/roleApi';
import SideForm from '../../../components/SideForm';
import Page401 from '../../error/Page401';

interface RoleProps {}

const columns: ColumnI = [
  { name: 'name', label: 'Role Name' },
  { name: 'description', label: 'Description' },
];

const initialState = {
  name: '',
  description: '',
};

const Role: FC<RoleProps> = ({}) => {
  // ==============================
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    sort: 'name',
    search: {
      name: '',
    },
  });

  // =========form state ============//
  const [isDiscard, setIsDiscard] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [formState, setFormState] = useState(initialState);
  const handleFormToggle = (state = initialState) => {
    setFormState(() => ({ ...state }));
    setOpenForm(!openForm);
    setIsDiscard(false);
  };
  const onChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setIsDiscard(true);
  };
  // handle get all roles
  const query = useMemo(() => {
    return getQuery(filter);
  }, [filter]);
  const { data: roles, isLoading, isSuccess, isError, error, ...rest } = useGetRolesQuery(query);

  // =========Add/Update ============//
  const [post, postState] = useAddRoleMutation();

  // =========delete Handled ============//
  const [del, deleteState] = useDeleteRoleMutation();

  // =========select handled ============//
  const [selectList, setSelectList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const selectAllRoles = useGetRolesQuery(`select=_id`, { skip: !selectAll });
  useEffect(() => {
    if (selectAllRoles?.data?.data?.length > 0 && selectAll) {
      setSelectList(() => selectAllRoles?.data?.data?.map((li: { _id: any }) => li?._id));
    } else {
      setSelectList([]);
    }
  }, [selectAllRoles?.data, selectAll]);

  // =======================
  console.log('Roles', rest, roles);
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
        onEditClick={(row: { name: string; discription: string } | undefined) => handleFormToggle(row)}
        // ======= DELETE ====== //
        onDeleteClick={(row: { _id: any }, ids: any) => {
          if (row) del({ id: row?._id });
          if (ids) del({ id: null, ids });
        }}
        deleteState={deleteState}
        // ======= SELECT ====== //
        selectList={selectList}
        onSelectAll={(e: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) =>
          setSelectAll(e.target.checked)
        }
        setSelectList={setSelectList}
        // ======= SORT ====== //
        sorting={filter?.sort}
        // ======= Pagination ====== //
        paginationProps={{ count: roles?.totalRecord, rowsPerPage: filter?.limit, page: filter.page }}
        // ======= ROW/COLUMNS ====== //
        columns={columns}
        rows={roles?.data ?? []}
      />

      <SideForm
        id="role_form"
        open={openForm}
        title="Role Form"
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
              label="Role Name"
              checkError={checkError}
              required
              value={formState?.name}
              onChange={onChange}
            />
            <InputField
              name="description"
              label="Description"
              required
              checkError={checkError}
              value={formState?.description}
              onChange={onChange}
            />
          </>
        )}
      </SideForm>
    </>
  );
};

export default Role;
