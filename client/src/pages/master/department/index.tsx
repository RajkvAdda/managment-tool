import { FC, useEffect, useMemo, useState } from 'react';
import { AddButton } from '../../../components/Buttons';
import TabAction from '../../../components/TabAction';
import Table, { ColumnI } from '../../../components/Table';
import InputField from '../../../components/InputField';
import { getQuery } from '../../../store';
import {
  useAddDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
} from '../../../store/Master/departmentApi';
import SideForm from '../../../components/SideForm';
import Page401 from '../../error/Page401';
import Label from '../../../components/label/Label';
import SelectField from '../../../components/SelectField';
import { MenuItem } from '@mui/material';
import { ModuleEnum } from '../../../utils/Enum';

interface DepartmentProps {}

const columns: ColumnI | any = [
  { name: 'name', label: 'Department Name' },
  { name: 'moduleName', label: 'Module Name', format: (id: any) => <Label>{id}</Label> },
  { name: 'description', label: 'Description' },
];

const initialState = {
  name: '',
  description: '',
  module: null,
};

const Department: FC<DepartmentProps> = ({}) => {
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
  const handleFormToggle = (state: any = initialState) => {
    setFormState(() => ({ ...state }));
    setOpenForm(!openForm);
    setIsDiscard(false);
  };
  const onChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setIsDiscard(true);
  };
  // handle get all Departments
  const query = useMemo(() => {
    return getQuery(filter);
  }, [filter]);
  const { data: Departments, isLoading, isSuccess, isError, error, ...rest } = useGetDepartmentsQuery(query);

  // =========Add/Update ============//
  const [post, postState] = useAddDepartmentMutation();

  // =========delete Handled ============//
  const [del, deleteState] = useDeleteDepartmentMutation();

  // =========select handled ============//
  const [selectList, setSelectList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const selectAllDepartments = useGetDepartmentsQuery(`select=_id`, { skip: !selectAll });
  useEffect(() => {
    if (selectAllDepartments?.data?.data?.length > 0 && selectAll) {
      setSelectList(() => selectAllDepartments?.data?.data?.map((li: { _id: any }) => li?._id));
    } else {
      setSelectList([]);
    }
  }, [selectAllDepartments?.data, selectAll]);

  // =======================
  console.log('Departments', rest, Departments);
  if (isError && [401, 403].includes(error?.status)) {
    return <Page401 />;
  }
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
        paginationProps={{ count: Departments?.totalRecord, rowsPerPage: filter?.limit, page: filter.page }}
        // ======= ROW/COLUMNS ====== //
        columns={columns}
        rows={Departments?.data ?? []}
        masterFilter={undefined}
        caption={undefined}
        action={undefined}
      />

      <SideForm
        id="Department_form"
        open={openForm}
        title="Department Form"
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
              label="Department Name"
              checkError={checkError}
              required
              value={formState?.name}
              onChange={onChange}
            />
            <SelectField
              required
              name="module"
              label="Module"
              checkError={checkError}
              value={formState?.module}
              onChange={onChange}
            >
              {Object.entries(ModuleEnum).map(([label, value]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </SelectField>

            <InputField
              name="description"
              label="Description"
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

export default Department;
