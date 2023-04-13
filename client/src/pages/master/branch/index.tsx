import { FC, useMemo, useState } from 'react';
import { FormControlLabel, MenuItem, Switch } from '@mui/material';
import { AddButton } from '../../../components/Buttons';
import TabAction from '../../../components/TabAction';
import Table, { ColumnI } from '../../../components/Table';
import InputField, { AddressField } from '../../../components/InputField';
import { getQuery } from '../../../store';
import { useAddBranchMutation, useDeleteBranchMutation, useGetBranchesQuery } from '../../../store/Master/branchApi';
import SideForm from '../../../components/SideForm';
import Label from '../../../components/label/Label';
import SelectField from '../../../components/SelectField';
import { ModuleEnum } from '../../../utils/Enum';

interface PageProps {}

const columns: ColumnI = [
  { name: 'name', label: 'Branch Name' },
  { name: 'stateCode', label: 'State' },
  { name: 'responsiblePerson', label: 'Responsible Person' },
  {
    name: 'isActive',
    label: 'Status',
    format: (val) => <Label color={val ? 'success' : 'error'}>{val ? 'Active' : 'In Active'}</Label>,
  },
];

const initialState = {
  name: '',
  stateCode: null,
  responsiblePerson: '',
  isActive: true,
  address: '',
};

const Branch: FC<PageProps> = ({}) => {
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
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setIsDiscard(true);
  };
  // handle get all branches
  const query = useMemo(() => {
    return getQuery(filter);
  }, [filter]);
  const { data: branches, isLoading } = useGetBranchesQuery(query);

  // =========Add/Update ============//
  const [post, postState] = useAddBranchMutation();

  // =========delete Handled ============//
  const [del, deleteState] = useDeleteBranchMutation();

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
        // ======= SORT ====== //
        sorting={filter?.sort}
        // ======= Pagination ====== //
        paginationProps={{ count: branches?.totalRecord, rowsPerPage: filter?.limit, page: filter.page }}
        // ======= ROW/COLUMNS ====== //
        columns={columns}
        rows={branches?.data ?? []}
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
              label="Branch Name"
              checkError={checkError}
              required
              value={formState?.name}
              onChange={onChange}
            />
            <InputField
              name="responsiblePerson"
              label="Responsible Person Name"
              checkError={checkError}
              required
              value={formState?.responsiblePerson}
              onChange={onChange}
            />
            <AddressField
              name="address"
              label="Address"
              required
              checkError={checkError}
              value={formState?.address}
              onChange={(e, location) => {
                onChange(e);
                onChange({
                  target: {
                    name: 'stateCode',
                    value: location?.state ?? null,
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
              sx={{ mb: 3 }}
            />
          </>
        )}
      </SideForm>
    </>
  );
};

export default Branch;
