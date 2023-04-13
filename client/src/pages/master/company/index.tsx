import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import InputField, { AddressField, EmailField, MobileField } from '../../../components/InputField';
import DateField from '../../../components/Date';
import Form from '../../../components/Form';
import { useGetCompanyQuery, useUpdateCompanyMutation } from '../../../store/Master/companyApi';
import DragDropFile from '../../../components/DragDropFile';
import SelectField from '../../../components/SelectField';
import { ModuleEnum } from '../../../utils/Enum';
import { MenuItem } from '@mui/material';

const Company = () => {
  const { data, isLoading } = useGetCompanyQuery();

  // ======from state ==========//
  const [formState, setFormState] = useState({});
  const [isDiscard, setIsDiscard] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setIsDiscard(() => true);
  };
  useEffect(() => {
    if (data?.data) {
      setFormState(() => ({ ...data?.data }));
      setIsDiscard(() => false);
    }
  }, [data?.data]);

  const [update, updateState] = useUpdateCompanyMutation();
  console.log('formState', formState);

  return (
    <>
      <Form
        loading={isLoading}
        action={['submit']}
        actionState={updateState}
        isDiscard={isDiscard}
        onFormSubmit={() => {
          update({ id: formState?._id, body: formState });
        }}
      >
        {(checkError) => (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader title="General" />
                  <CardContent>
                    <InputField
                      required
                      checkError={checkError}
                      label="Company Name"
                      name="name"
                      value={formState?.name}
                      onChange={onChange}
                    />
                    <InputField
                      checkError={checkError}
                      required
                      label="Responsible Person Name"
                      name="responsiblePerson"
                      value={formState?.responsiblePerson}
                      onChange={onChange}
                    />
                    <DateField
                      checkError={checkError}
                      required
                      label="Established Date"
                      name="dateOfEstablished"
                      value={formState?.dateOfEstablished}
                      onChange={(newDate) => {
                        onChange({
                          target: {
                            name: 'dateOfEstablished',
                            value: newDate,
                          },
                        });
                      }}
                    />
                    <InputField
                      checkError={checkError}
                      label="CIN No."
                      name="cinNumber"
                      value={formState?.cinNumber}
                      onChange={onChange}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader title="Address" />
                  <CardContent>
                    <AddressField
                      checkError={checkError}
                      label="Address"
                      name="address"
                      required
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
                    <InputField
                      checkError={checkError}
                      label="Website"
                      name="website"
                      noCap
                      value={formState?.website}
                      onChange={onChange}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader title="Contact" />
                  <CardContent>
                    <MobileField
                      name="mobile"
                      label="Mobile"
                      checkError={checkError}
                      value={formState?.mobile}
                      onChange={onChange}
                    />
                    <EmailField
                      name="email"
                      label="Email"
                      checkError={checkError}
                      value={formState?.email}
                      onChange={onChange}
                    />

                    <DragDropFile
                      checkError={checkError}
                      value={formState?.avatar ?? null}
                      format={['jpeg', 'png', 'jpg']}
                      onChange={(value) => {
                        onChange({
                          target: {
                            name: 'avatar',
                            value: value,
                          },
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Form>
    </>
  );
};
export default Company;
