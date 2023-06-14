import React, { ReactNode, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Card, { CardActions, CardBody, CardFooter, CardFooterLeft, CardFooterRight, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import { Currencies, ITransTypeProp, TransTypes } from '../../common/RssData/TransTypes';
import { UpdateType } from '../../@features/Rss/transType.slice';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState, store } from '../../store';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Label from '../../components/bootstrap/forms/Label';
import Button from '../../components/bootstrap/Button';
import { creatUpdate, IBankAccountProps } from '../../services/bankAccountService';
import Spinner from '../../components/bootstrap/Spinner';
import { IFileProp, uploadFile } from '../../services/filehelperService';
import { AppConst, BASE_URL } from '../../common/RssData/constants';
import Select from '../../components/bootstrap/forms/Select';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import { useTranslation } from 'react-i18next';

const CreateBankAccount = () => {
    const { t } = useTranslation(['translation', 'menu']);
    const { id } = useParams();
    const navigate = useNavigate();
    let selectedType = store.getState().transType.Type;
    let selectedBank = store.getState().banks.selectedBank;
    const cAccount = useSelector((state: RootState) => state.bankAccounts.BankAccounts)[selectedBank.id].find((account) => account.id == (id || 0));

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);


    const handleImageChange = async (e: any) => {
        setIsLoading(true);
        const file = e.target.files[0];
        const pic = await uploadFile({ file: file, prevFile: formik.values.pic, subFolder: AppConst.SubFolders.BankAccounts } as IFileProp);
        formik.setFieldValue('pic', pic);
        setIsLoading(false);
    };
    const handleSubmitForm = async (values: IBankAccountProps) => {
        setIsSaving(true);
        await creatUpdate(values);
        console.log(selectedType.id.toString());
        navigate('/bank-Accounts');
    };

    const formik = useFormik({
        initialValues: {
            title: cAccount?.title,
            bankID: selectedBank?.id,
            currency: cAccount?.currency,
            bankName: '',
            ownerID: cAccount?.ownerID,
            openingBalance: cAccount?.openingBalance || 0,
            id: id || 0,
            pic: cAccount?.pic,
        } as IBankAccountProps,
        validate: (values) => {
            const errors: Partial<IBankAccountProps> = {};
            if (!values.title) {
                errors.title = 'Title is required';
            }
            return errors;
        },
        onSubmit: (values) => {
            handleSubmitForm(values);
        },
    });


    return (
        <PageWrapper title='Create Bank Account'>
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            { title: selectedType.name, to: '/selectBank' },
                            { title: selectedBank.name, to: '/bank-accounts' },
                            { title: 'Manage Accounts', to: '/bank-accounts' },
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
                                    <CardTitle>Define Bank Account</CardTitle>
                                </CardLabel>
                                <CardActions> </CardActions>
                            </CardHeader>
                            <CardBody>
                                <div className='row g-4'>
                                    <div className='col-6'>
                                        <Input id='pic' type='hidden' onChange={formik.handleChange} value={formik.values.pic} />
                                        <FormGroup>
                                            <Label htmlFor='name'>Account Title</Label>
                                            <Input
                                                id='title'
                                                placeholder='Title'
                                                aria-label='Title'
                                                autoComplete='Title'
                                                ariaDescribedby='addon1'
                                                onChange={formik.handleChange}
                                                value={formik.values.title}
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.title}
                                                invalidFeedback={formik.errors.title}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className='col-6'>
                                        <Input id='pic' type='hidden' onChange={formik.handleChange} value={formik.values.pic} />
                                        <FormGroup>
                                            <Label htmlFor='name'>Opening Balance</Label>
                                            <Input
                                                id='openingBalance'
                                                placeholder='Opening Balance'
                                                aria-label='Opening Balance'
                                                ariaDescribedby='addon1'
                                                type='number'
                                                onChange={formik.handleChange}
                                                value={formik.values.openingBalance}
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.openingBalance}
                                                invalidFeedback={formik.errors.openingBalance}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className='col-6'>
                                        <Input id='pic' type='hidden' onChange={formik.handleChange} value={formik.values.pic} />
                                        <FormGroup>
                                            <Label htmlFor='name'>Currency</Label>
                                            <Select
                                                id='Currency'
                                                ariaLabel=''
                                                placeholder='Select Currency'
                                                list={Currencies}
                                                multiple={false}
                                                defaultValue={formik.values.currency}
                                                onChange={formik.handleChange} />
                                        </FormGroup>
                                    </div>
                                </div>
                            </CardBody>
                            <CardFooter>
                                <CardFooterLeft>
                                    <Button
                                        type='reset'
                                        color='info'
                                        isOutline
                                        onClick={() => navigate('/bank-accounts')}>
                                        {t('menu:BackToList') as ReactNode}
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
                                        {formik.values.id > 0 ? t('menu:Update') as ReactNode : t('menu:Save') as ReactNode}
                                    </Button>
                                </CardFooterRight>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </Page>
        </PageWrapper >
    );
};

export default CreateBankAccount;

function useParam(): { id: any; } {
    throw new Error('Function not implemented.');
}
