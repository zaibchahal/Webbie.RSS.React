import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import { demoPagesMenu } from '../../menu';
import { useNavigate } from 'react-router-dom';
import { RootState, store } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { AppConst, AppEnums, BASE_URL, PURCHASE_URLS } from '../../common/RssData/constants';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../components/bootstrap/Modal';
import Button from '../../components/bootstrap/Button';
import { FieldArray, Form, Formik, FormikProps, useFormik } from 'formik';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Label from '../../components/bootstrap/forms/Label';
import dayjs from 'dayjs';
import Textarea from '../../components/bootstrap/forms/Textarea';
import { creatUpdate, get, getList as getListPurchase, IPurchaseDetailProps, IPurchaseFilterProps, IPurchaseProps } from '../../services/POS/purchaseService';
import NumberFormatter, { convertLocal, getLocal } from '../../common/RssData/formster';
import '../../styles/style.css';
import { jzSwal } from '../../common/RssData/helper';
import Spinner from '../../components/bootstrap/Spinner';
import { DateRangePicker } from '../../components/rss/daterange';
import Icon from '../../components/icon/Icon';
import { billTypes } from '../../common/RssData/TransTypes';
import Select from '../../components/bootstrap/forms/Select';
import { useTranslation } from 'react-i18next';
import { IFileProp, uploadFile } from '../../services/filehelperService';
import { getList, IProductFilterProps, IProductListProps } from '../../services/POS/productService';
import Swal from 'sweetalert2';
import { Delete } from '../../services/baseService';
//import DateRangePicker from 'rsuite/DateRangePicker';

const Purchase = () => {
    const { t } = useTranslation(['translation', 'menu']);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedType = useSelector((state: RootState) => state.transType.Type);

    const [state, setState] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [Purchases, setPurchases] = useState<IPurchaseProps[]>([]);
    const [startDate, setStartDate] = useState<Date>(new Date);
    const [endDate, setEndDate] = useState<Date>(new Date);
    const [selectedRange, setSelectedRange] = useState<Range[]>([]);

    const initValues = {
        date: new Date(),
        notes: '',
        refNo: '',
    } as IPurchaseProps;
    //#region Edit

    const [formikValues, setFormikValues] = useState(initValues);

    const handleEdit = async (id: number) => {
        var data = await get(id);
        setFormikValues({
            ...formikValues,
            id: data.id,
            detail: data.detail,
            notes: data.notes,
            date: convertLocal(data.date),
            refNo: data.refNo,
        });
        console.log(data);
        handleOpenModal();
    }
    //#endregion




    const [products, setProducts] = useState<IProductListProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            let b = await getList({} as IProductFilterProps);
            setProducts(b || []);
        };
        fetchData();
    }, []);

    const handleAddNewRow = async (e: any, formik: FormikProps<IPurchaseProps>) => {
        if (e.key === 'Enter') {
            if (!formik.values.detail) formik.values.detail = [];
            const currentDetails = [...formik.values.detail];
            const p = products.find((x) => x.barcode == e.target.value)
            if (!p) {
                jzSwal.error("Product Not Found");
                return;
            }
            const exists = currentDetails.find((x) => x.productId == p?.id)
            if (exists) {
                jzSwal.error("Product Already Added");
                return;
            }
            currentDetails.push({
                productId: p.id,
                productName: p.name,
                costPrice: p.costPrice
            } as IPurchaseDetailProps);
            formik.setValues({
                ...formik.values,
                detail: currentDetails,
            });
            e.target.value = '';
        }
    }
    const handleRemoveRow = (i: number, formik: FormikProps<IPurchaseProps>) => {
        const updatedRows = formik.values.detail.filter((_, index) => index !== i);
        formik.setValues({ ...formik.values, detail: updatedRows });
    };


    const handleSubmitForm = async (formik: FormikProps<IPurchaseProps>) => {
        setIsSaving(true);
        if (!formik.values.date) formik.values.date = new Date();
        console.log(formik.values);

        var r = await creatUpdate(formik.values);
        if (r.success) {
            jzSwal.success('Data Saved Successfully')
            handleCloseModal();
            formik.resetForm();
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: number) => {
        var f = await Delete(PURCHASE_URLS.Delete + '?id=' + id);
        if (f) setPurchases((b) => b.filter((x) => x.id !== id));
    };

    const handleSearchForm = async () => {
        const trans = await getListPurchase({
            refNo: ''
        } as IPurchaseFilterProps);
        setPurchases(trans);
    };

    const handleOpenModal = async () => {
        setState(true);
    };

    const handleCloseModal = () => {
        setFormikValues({} as IPurchaseProps);
        setState(false);
        setIsSaving(false);
    }

    const formikSearch = useFormik({
        initialValues: { text: '', startDate: new Date() },
        validate: (values) => {
        },
        onSubmit: (values) => {
            handleSearchForm();
        },
    });

    return (
        <PageWrapper title={demoPagesMenu.projectManagement.subMenu.list.text}>
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            { title: selectedType.name, to: '/selectBank' }
                        ]}
                    />
                </SubHeaderLeft>
            </SubHeader>
            <Page>
                <>
                    <div className='row'>
                        <div className='col-8 mb-4'>
                            <div className='display-4 fw-bold py-3'>{t('menu:Purchase') as ReactNode}</div>
                        </div>
                        <div className='col-4 text-end py-4'>
                            <button className='btn btn-primary ' onClick={() => handleOpenModal()} > <Icon size='2x' icon='Add' ></Icon>  {t('menu:CreateNew') as ReactNode} </button>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="bg-l10-info border-bottom-1 my-5 p-3">
                            <div className="row">
                                <div className="col-md-6">
                                    <DateRangePicker />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Ref No.</label>
                                    <Input className="form-control form-control-solid"
                                        value={formikSearch.values.text}
                                        onChange={formikSearch.handleChange}
                                        id="text"
                                        placeholder="Search ...." />
                                </div>
                                <div className="col-md-2 pt-4 text-end">
                                    <button id="btn-Search" onClick={() => handleSearchForm()} className="btn btn-success">  {t('menu:Show') as ReactNode} </button>
                                </div>
                            </div>
                        </div>
                    </div >
                    <div>
                        <div>
                            <table id="DTable" className="table table-responsive myTable table-bordered">
                                <thead>
                                    <tr>
                                        <th>Sr.</th>
                                        <th> Datetime</th>
                                        <th> Ref No. </th>
                                        <th> Notes</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Purchases.map((tr, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{getLocal(tr.date).format(AppConst.Formats.dateTime)}</td>
                                            <td>{tr.refNo}</td>
                                            <td>{tr.notes}</td>
                                            <td>
                                                <a onClick={() => handleEdit(tr.id)} className="btn btn-sm btn-light-info">Edit</a> |
                                                <a onClick={() => handleDelete(tr.id)} className="btn btn-sm btn-light-danger" >Delete </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Formik
                        initialValues={formikValues}
                        enableReinitialize={true}
                        onSubmit={(values) => { }}
                        validate={(values) => {
                            const errors: Partial<IPurchaseProps> = {};
                            //if (!values.amount) {
                            //    errors.amount = 5;
                            //}
                            return errors;
                        }}
                    >
                        {(formiki) => {
                            const { values } = formiki;
                            return (
                                <Modal
                                    isOpen={state}
                                    setIsOpen={handleCloseModal}
                                    titleId='exampleModalLabel'
                                    isCentered={true}
                                    size={'xl'}
                                    fullScreen='md'
                                    isStaticBackdrop={true}
                                    isAnimation={true}>
                                    <ModalHeader setIsOpen={handleCloseModal}>
                                        <ModalTitle id='exampleModalLabel'>Purchase Entry</ModalTitle>
                                    </ModalHeader>
                                    <ModalBody>
                                        <Form className="formContainer">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-md-4 my-2">
                                                        <div className="form-group">
                                                            <label className="form-label">Datetime</label>
                                                            <input value={dayjs(formiki.values.date).format(AppConst.Formats.datetimeForm)} onChange={(e) => formiki.setFieldValue('date', new Date(e.target.value))} id="date"
                                                                type="datetime-local" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 my-2">
                                                        <div className="form-group">
                                                            <label className="form-label">
                                                                Ref. No <b className="text-danger">*</b>
                                                            </label>
                                                            <input type="text" className="form-control" onChange={(e) => formiki.setFieldValue('refNo', e.target.value)} id="refNo" name="refNo" value={formiki.values.refNo} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 my-2">
                                                        <div className="form-group">
                                                            <label className="form-label">Notes</label>
                                                            <textarea className="form-control" id="notes" placeholder="Enter ....." onChange={(e) => formiki.setFieldValue('notes', e.target.value)} value={formiki.values.notes} name="notes"></textarea>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 p-3 mb-2 bg-l10-brand-two">
                                                        <div className="form-group">
                                                            <label className="form-label">Scan Or Type Product Code and Press Enter to add New Product</label>
                                                            <input type="text" placeholder="Product Code" className="form-control" onKeyUp={(e) => handleAddNewRow(e, formiki)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <FieldArray name="detail"
                                                    render={(arrayHelpers) => (
                                                        <div className="row">
                                                            <table className="table table-bordered">
                                                                <thead className="bg-primary text-light fw-bolder">
                                                                    <tr>
                                                                        <th>Sr.</th>
                                                                        <th>Product</th>
                                                                        <th>Cost Price</th>
                                                                        <th>Qty</th>
                                                                        <th>Amount</th>
                                                                        <th></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody id="detailBody">
                                                                    {values.detail?.map((d, i) => (
                                                                        <tr key={i}>
                                                                            <td>{i + 1}</td>
                                                                            <td>{d?.productName}</td>
                                                                            <td> <input id={`detail.${i}.costPrice`} type="text" className="form-control" value={d?.costPrice} onChange={formiki.handleChange} /> </td>
                                                                            <td> <input id={`detail.${i}.qty`} type="number" className="form-control" value={d?.qty} onChange={formiki.handleChange} /> </td>
                                                                            <td> {(d?.costPrice || 0) * (d.qty || 0)} </td>
                                                                            <td> <button type="button" onClick={() => handleRemoveRow(i, formiki)} className="btn btn-danger">X</button> </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                                <tfoot>
                                                                    <tr className="fw-bolder">
                                                                        <td></td>
                                                                        <td></td>
                                                                        <th>Total</th>
                                                                        <th>{formiki.values.detail?.reduce((total, i) => total + (i.qty || 0), 0)}</th>
                                                                        <th>{formiki.values.detail?.reduce((total, i) => total + ((i.qty || 0) * (i.costPrice || 0)), 0)}</th>
                                                                        <th></th>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>)}
                                                />

                                            </div>

                                        </Form>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color='info'
                                            isOutline
                                            className='border-0'
                                            onClick={() => { formiki.resetForm(); handleCloseModal() }}>
                                            Close
                                        </Button>
                                        <Button color='info' icon='Save' onClick={() => { handleSubmitForm(formiki); }} >
                                            {isSaving && (
                                                <Spinner isSmall inButton isGrow />
                                            )}
                                            {formiki.values.id > 0 ? ' Update' : ' Save'}
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                            );
                        }}
                    </Formik>
                </>
            </Page >
        </PageWrapper >
    );
};

export default Purchase;
