import React, { useMemo } from 'react';
import {
  Box,
  Divider,
  Drawer,
  Stack,
  Typography,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import Button, { BackButton, SubmitButton } from '../Buttons';
import Form from '../Form';
import { CloseIconButton, DeleteIconButton, EditIconButton, FilterIconButton } from '../IconButtons';
import { FC, useEffect, useState } from 'react';
import { FilterInput } from './FilterComponet';
import {
  useAddMasterFilterMutation,
  useDeleteMasterFilterMutation,
  useGetMasterFiltersQuery,
} from '../../store/Master/masterFilterApi';
import InputField from '../InputField';
import { getQuery } from '../../store';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: index == 2 ? 0 : 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const MasterFilter: FC<any> = ({ fields, formState, onChange, setFilterState, onFilterChange }) => {
  const [open, setOpen] = useState(false);
  const [isDiscard, setIsDiscard] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // ========== handle save form state
  const [state, setState] = useState({ name: null, description: '', page: 101, filter: null });
  const onAddChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
    setIsDiscard(true);
  };
  // ========= Master Filter ============//

  const handleMasterFilterChange = (state: any) => {
    let filter = {};
    for (const logical in state) {
      filter[logical] = [];
      for (const name in state[logical]) {
        for (const comparison in state[logical][name]) {
          const val = state[logical][name][comparison];
          if (String(val).length) {
            if (comparison === 'regex') {
              filter[logical]?.push({ [name]: { ...(state[logical][name] ?? {}), options: 'i' } });
            } else if (['in', 'nin'].includes(comparison)) {
              filter[logical]?.push({ [name]: { [comparison]: [state[logical][name][comparison]] } });
            } else {
              filter[logical]?.push({ [name]: state[logical][name] });
            }
          } else {
            const logicHave = Object.entries(state[logical])?.filter(([key, value]) => key !== name);
            console.log('master-filter-value', logicHave, name);

            if (logicHave?.length === 0) {
              delete filter[logical];
            }
          }
        }
      }
      if (filter[logical]?.length == 0) {
        delete filter[logical];
      }
    }

    if (onFilterChange) onFilterChange(filter);
    console.log('master-filter', filter);
  };

  useEffect(() => {
    if (formState) {
      handleMasterFilterChange(formState);
    }
  }, [formState]);
  console.log('master-form', formState);

  // ======= hanlde get Master saved filter ============ //
  // handle get all roles
  const query = useMemo(() => {
    return getQuery({});
  }, []);
  const { data: masterFilters, isLoading } = useGetMasterFiltersQuery(query, { skip: activeTab == '1' });
  console.log('masterFilters', masterFilters);
  // ======= hanlde Add/Update Master filter ============ //
  const [addFilter, setAddFilter] = useState(false);
  const [add, addState] = useAddMasterFilterMutation();

  // ======= hanlde delete Master filter ============ //
  const [del, delState] = useDeleteMasterFilterMutation();
  return (
    <>
      <FilterIconButton onClick={() => setOpen(true)} />
      <Drawer
        anchor="right"
        open={open}
        onClose={() => {
          setOpen(() => false);
          setIsDiscard(() => false);
        }}
        PaperProps={{
          sx: { borderRadius: '10px 0 0px 10px', width: '380px' },
        }}
      >
        <Stack
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, pt: 2, pb: 1, position: 'sticky', top: 0, zIndex: 3, bgcolor: 'background.paper' }}
        >
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Advance Filter
          </Typography>
          <CloseIconButton
            onClick={() => {
              setOpen(() => false);
              setIsDiscard(() => false);
            }}
          />
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(e, newVal) => {
              setActiveTab(newVal);
            }}
            aria-label="lab API tabs example"
          >
            <Tab label="Direct Filter" value="1" />
            <Tab label="Saved Filter" value="2" />
          </Tabs>
        </Box>
        <TabPanel value={activeTab} index={'1'}>
          <Form
            id={'master-filter-form'}
            isDiscard={isDiscard}
            onFormSubmit={() => {
              add({ ...state, filter: formState });
            }}
            cardContentProps={{ style: { paddingBottom: 0 } }}
            actionState={addState}
          >
            {(checkError: any) => (
              <>
                {addFilter ? (
                  <>
                    <InputField
                      name="name"
                      label="Filter Name"
                      checkError={checkError}
                      required
                      value={state?.name}
                      onChange={onAddChange}
                    />
                    <InputField
                      name="description"
                      label="Description"
                      checkError={checkError}
                      value={state?.description}
                      onChange={onAddChange}
                    />
                  </>
                ) : (
                  fields?.map((field) => (
                    <FilterInput
                      {...field}
                      value={formState}
                      onChange={(...rest) => {
                        onChange(...rest);
                      }}
                      checkError={checkError}
                    />
                  ))
                )}

                <Divider sx={{ borderStyle: 'dashed' }} />
                <Box
                  sx={{
                    pt: 2,
                    width: '100%',
                    textAlign: 'right',
                    position: 'sticky',
                    bottom: 10,
                    zIndex: 3,
                    bgcolor: 'background.paper',
                  }}
                >
                  {addFilter ? (
                    <Stack>
                      <BackButton onClick={() => setAddFilter(false)} />
                      <SubmitButton
                        fullWidth
                        loading={addState?.isLoading}
                        success={addState?.isSuccess}
                        failed={addState?.isError}
                      />
                    </Stack>
                  ) : (
                    <Button
                      fullWidth
                      onClick={() => {
                        if (Object.entries(formState ?? {}).length <= 0)
                          return alert('Please add some filter before save');
                        setAddFilter(true);
                      }}
                    >
                      Save Filter
                    </Button>
                  )}
                </Box>
              </>
            )}
          </Form>
        </TabPanel>
        <TabPanel value={activeTab} index={'2'}>
          <List>
            {masterFilters?.data?.map((list, index) => (
              <div key={index}>
                {index > 0 && <Divider sx={{ borderStyle: 'dashed' }} />}
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Stack spacing={0}>
                      <EditIconButton
                        onClick={() => {
                          setFilterState(() => ({ ...(list?.filter ?? {}) }));
                          setState(() => ({ ...list }));
                          setAddFilter(false);
                          setActiveTab('1');
                        }}
                      />
                      <DeleteIconButton
                        isDelete={true}
                        actionState={delState}
                        onConfirm={() => del({ id: list?._id })}
                      />
                    </Stack>
                  }
                >
                  <ListItemButton
                    onClick={() => {
                      setFilterState(() => ({ ...(list?.filter ?? {}) }));
                      setOpen(() => false);
                      setIsDiscard(() => false);
                    }}
                  >
                    <ListItemText primary={list.name} secondary={list?.description} />
                  </ListItemButton>
                </ListItem>
              </div>
            ))}
          </List>
        </TabPanel>
      </Drawer>
    </>
  );
};
export default MasterFilter;
