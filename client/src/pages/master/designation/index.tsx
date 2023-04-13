import { FC, useEffect, useMemo, useState } from 'react';
import { AddButton } from '../../../components/Buttons';
import TabAction from '../../../components/TabAction';
import Table, { ColumnI } from '../../../components/Table';
import InputField from '../../../components/InputField';
import { getQuery } from '../../../store';
import {
  useAddDesignationMutation,
  useDeleteDesignationMutation,
  useGetDesignationsQuery,
} from '../../../store/Master/DesignationApi';
import SideForm from '../../../components/SideForm';
import Page401 from '../../error/Page401';

interface DesignationProps {}

const columns: ColumnI = [
  { name: 'name', label: 'Designation Name' },
  { name: 'description', label: 'Description' },
];

const initialState = {
  name: '',
  description: '',
};

const Designation: FC<DesignationProps> = ({}) => {
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
  // handle get all Designations
  const query = useMemo(() => {
    return getQuery(filter);
  }, [filter]);
  const { data: Designations, isLoading, isSuccess, isError, error, ...rest } = useGetDesignationsQuery(query);

  // =========Add/Update ============//
  const [post, postState] = useAddDesignationMutation();

  // =========delete Handled ============//
  const [del, deleteState] = useDeleteDesignationMutation();

  // =========select handled ============//
  const [selectList, setSelectList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const selectAllDesignations = useGetDesignationsQuery(`select=_id`, { skip: !selectAll });
  useEffect(() => {
    if (selectAllDesignations?.data?.data?.length > 0 && selectAll) {
      setSelectList(() => selectAllDesignations?.data?.data?.map((li: { _id: any }) => li?._id));
    } else {
      setSelectList([]);
    }
  }, [selectAllDesignations?.data, selectAll]);

  // =======================
  console.log('Designations', rest, Designations);
  if (isError && [401, 403].includes(error.status)) {
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
        paginationProps={{ count: Designations?.totalRecord, rowsPerPage: filter?.limit, page: filter.page }}
        // ======= ROW/COLUMNS ====== //
        columns={columns}
        rows={Designations?.data ?? []}
      />

      <SideForm
        id="Designation_form"
        open={openForm}
        title="Designation Form"
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
              label="Designation Name"
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

export default Designation;
