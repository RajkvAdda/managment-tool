import { FC, useEffect, useMemo, useState } from 'react';
import { MenuItem } from '@mui/material';
import { AddButton } from '../../../components/Buttons';
import TabAction from '../../../components/TabAction';
import Table, { ColumnI } from '../../../components/Table';
import InputField from '../../../components/InputField';
import { getQuery } from '../../../store';
import { useAddPageMutation, useDeletePageMutation, useGetPagesQuery } from '../../../store/Master/pageApi';
import SideForm from '../../../components/SideForm';
import Label from '../../../components/label/Label';
import SelectField from '../../../components/SelectField';
import { ModuleEnum } from '../../../utils/Enum';

interface PageProps {}

const columns: ColumnI = [
  { name: 'id', label: 'Page Id', format: (id) => <Label>{id}</Label> },
  { name: 'name', label: 'Page Name' },
  { name: 'moduleName', label: 'Module Name', format: (id) => <Label>{id}</Label> },
];

const initialState = {
  name: '',
  module: 0,
};

const Page: FC<PageProps> = ({}) => {
  // ==============================
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    sort: 'module',
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
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setIsDiscard(true);
  };
  // handle get all pages
  const query = useMemo(() => {
    return getQuery(filter);
  }, [filter]);
  const { data: pages, isLoading } = useGetPagesQuery(query);

  // =========Add/Update ============//
  const [post, postState] = useAddPageMutation();

  // =========delete Handled ============//
  const [del, deleteState] = useDeletePageMutation();

  // =========select all handled ============//
  // const [selectList, setSelectList] = useState([]);
  // const [selectAll, setSelectAll] = useState(false);
  // const selectAllPages = useGetPagesQuery(`select=_id`, { skip: !selectAll });
  // useEffect(() => {
  //   if (selectAllPages?.data?.data?.length > 0 && selectAll) {
  //     setSelectList(() => selectAllPages?.data?.data?.map((li) => li?._id));
  //   } else {
  //     setSelectList([]);
  //   }
  // }, [selectAllPages?.data, selectAll]);

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
        onEditClick={(row) => handleFormToggle(row)}
        // ======= DELETE ====== //
        onDeleteClick={(row) => del(row?._id)}
        deleteState={deleteState}
        // ======= SELECT ====== //
        // selectList={selectList}
        // onSelectAll={(e) => setSelectAll(e.target.checked)}
        // setSelectList={setSelectList}
        // ======= SORT ====== //
        sorting={filter?.sort}
        // ======= Pagination ====== //
        paginationProps={{ count: pages?.totalRecord, rowsPerPage: filter?.limit, page: filter.page }}
        // ======= ROW/COLUMNS ====== //
        columns={columns}
        rows={pages?.data ?? []}
      />

      <SideForm
        id="Page_form"
        open={openForm}
        title="Page Form"
        isDiscard={isDiscard}
        onClose={() => handleFormToggle()}
        actionState={postState}
        onFormSubmit={() => {
          post(formState);
        }}
      >
        {(checkError) => (
          <>
            <InputField
              name="name"
              label="Page Name"
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
          </>
        )}
      </SideForm>
    </>
  );
};

export default Page;
