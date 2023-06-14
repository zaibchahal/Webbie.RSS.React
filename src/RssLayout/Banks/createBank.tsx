import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Card, { CardActions, CardBody, CardFooter, CardFooterLeft, CardFooterRight, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import { ITransTypeProp, TransTypes } from '../../common/RssData/TransTypes';
import { UpdateType } from '../../@features/Rss/transType.slice';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState, store } from '../../store';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Label from '../../components/bootstrap/forms/Label';
import Button from '../../components/bootstrap/Button';
import { creatUpdateBanks, IBankProps } from '../../services/bankService';
import Spinner from '../../components/bootstrap/Spinner';
import { IFileProp, uploadFile } from '../../services/filehelperService';
import { AppConst, BASE_URL } from '../../common/RssData/constants';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';

const CreateBank = () => {
    const { id } = useParams();
    let selectedType = store.getState().transType.Type;
    const cbank = useSelector((state: RootState) => state.banks.Banks)[selectedType.id.toString()].find((bank) => bank.id == (id || 0));

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const handleImageChange = async (e: any) => {
        setIsLoading(true);
        const file = e.target.files[0];
        const pic = await uploadFile({ file: file, prevFile: formik.values.pic, subFolder: AppConst.SubFolders.Banks } as IFileProp);
        formik.setFieldValue('pic', pic);
        setIsLoading(false);
    };
    const handleSubmitForm = async (values: IBankProps) => {
        setIsSaving(true);
        await creatUpdateBanks(values);
        console.log(selectedType.id.toString());
        navigate('/manage-Bank');
    };

    const formik = useFormik({
        initialValues: {
            id: id || 0,
            name: cbank?.name,
            pic: cbank?.pic,
            type: selectedType.id.toString()
        } as IBankProps,
        validate: (values) => {
            const errors: Partial<IBankProps> = {};
            if (!values.name) {
                errors.name = 'Name is required';
            }
            return errors;
        },
        onSubmit: (values) => {
            handleSubmitForm(values);
        },
    });


    return (
        <PageWrapper title='Create Bank'>
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            { title: selectedType.name, to: '/selectBank' },
                            { title: 'Manage Banks', to: '/page-layouts' },
                        ]}
                    />
                </SubHeaderLeft>
            </SubHeader>
            <Page>
                <div className='row'>
                    <div className='col-12 mb-4'>
                        <Card stretch tag='form' onSubmit={formik.handleSubmit}>
                            <CardHeader>
                                <CardLabel icon='DriveFileRename'>
                                    <CardTitle>Define Bank</CardTitle>
                                </CardLabel>
                                <CardActions> </CardActions>
                            </CardHeader>
                            <CardBody>
                                <div className='row g-4'>
                                    <div className='col-6'>
                                        <div className='row g-4'>
                                            <div className='col-12'>
                                                <Input id='pic' type='hidden' onChange={formik.handleChange} value={formik.values.pic} />
                                                <FormGroup>
                                                    <Label htmlFor='name'>Title</Label>
                                                    <Input
                                                        id='name'
                                                        placeholder='Title'
                                                        aria-label='Title'
                                                        autoComplete='Title'
                                                        ariaDescribedby='addon1'
                                                        onChange={formik.handleChange}
                                                        value={formik.values.name}
                                                        isValid={formik.isValid}
                                                        isTouched={formik.touched.name}
                                                        invalidFeedback={formik.errors.name}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className='col-12'>
                                                <FormGroup>
                                                    <Label htmlFor='name'>Image</Label>
                                                    <Input
                                                        id='name'
                                                        type='file'
                                                        accept='image/*'
                                                        ariaDescribedby='addon1'
                                                        onChange={handleImageChange}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className='col-12'>
                                                {isLoading ? (
                                                    <Spinner size='3rem' inButton isGrow />
                                                ) :
                                                    (<img src={BASE_URL + formik.values.pic} style={{ height: 200 }} className='img-thumbnail' ></img>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                            <CardFooter>
                                <CardFooterLeft>
                                    <Button
                                        type='reset'
                                        color='info'
                                        isOutline
                                        onClick={() => navigate('/manage-Bank')}>
                                        Back To Banks
                                    </Button>
                                </CardFooterLeft>
                                <CardFooterRight>
                                    <Button
                                        type='submit'
                                        color='info'
                                        onClick={() => { }}>
                                        {isSaving && (
                                            <Spinner isSmall inButton isGrow />
                                        )}
                                        {formik.values.id > 0 ? 'Update' : 'Save'}
                                    </Button>
                                </CardFooterRight>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </Page>
        </PageWrapper>
    );
};

export default CreateBank;

function useParam(): { id: any; } {
    throw new Error('Function not implemented.');
}
