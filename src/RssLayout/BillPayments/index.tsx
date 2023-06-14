import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import { demoPagesMenu } from '../../menu';
import { useNavigate } from 'react-router-dom';
import { RootState, store } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { AppConst, AppEnums, BASE_URL } from '../../common/RssData/constants';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../components/bootstrap/Modal';
import Button from '../../components/bootstrap/Button';
import { FieldArray, Form, Formik, FormikProps, useFormik, useFormikContext } from 'formik';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Label from '../../components/bootstrap/forms/Label';
import dayjs from 'dayjs';
import Textarea from '../../components/bootstrap/forms/Textarea';
import { creatUpdate, get, getList, IBillPaymentDetailProps, IBillPaymentFilterProps, IBillPaymentProps, initialDetailValues } from '../../services/billPaymentService';
import NumberFormatter from '../../common/RssData/formster';
import '../../styles/style.css';
import { jzSwal } from '../../common/RssData/helper';
import Spinner from '../../components/bootstrap/Spinner';
import { DateRangePicker } from '../../components/rss/daterange';
import Icon from '../../components/icon/Icon';
import BillPaymentPrint from '../Prints/billPrint';
import { showPrint } from '../Prints/transPrint';
import { billTypes } from '../../common/RssData/TransTypes';
import Select from '../../components/bootstrap/forms/Select';
import { useTranslation } from 'react-i18next';
//import DateRangePicker from 'rsuite/DateRangePicker';

const BillPayment = () => {
    const { t } = useTranslation(['translation', 'menu']);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const accTransTypes = AppEnums.AccTransTypes;
    const selectedType = useSelector((state: RootState) => state.transType.Type);
    const selectedBank = store.getState().banks.selectedBank;
    const selectedAccount = store.getState().bankAccounts.selectedAccount;

    const [state, setState] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [billPayments, setbillPayments] = useState<IBillPaymentDetailProps[]>([]);
    const [startDate, setStartDate] = useState<Date>(new Date);
    const [endDate, setEndDate] = useState<Date>(new Date);
    const [selectedRange, setSelectedRange] = useState<Range[]>([]);



    //#region Print
    const [printBillPayment, setprintBillPayment] = useState<IBillPaymentProps | null>(null);
    const [isReadyToPrint, setIsReadyToPrint] = useState(false);

    useEffect(() => {
        if (isReadyToPrint) {
            showPrint();
            setIsReadyToPrint(false);
        }
    }, [isReadyToPrint]);

    const printThis = async (id: number) => {
        var data = await get(id);
        setprintBillPayment(data);
        setIsReadyToPrint(true);
    };
    //#endregion

    const initValues = {
        detail: [initialDetailValues],
        cashReceived: 0,
        notes: '',
        id: 0,
        creationTime: new Date(),
        cashReturn: 0,
    } as IBillPaymentProps;
    //#region Edit

    const [formikValues, setFormikValues] = useState(initValues);

    const handleEdit = async (id: number) => {
        var data = await get(id);
        setFormikValues({
            ...formikValues,
            accountID: data.accountID,
            cashReceived: data.cashReceived,
            id: data.id,
            detail: data.detail,
            notes: data.notes,
            creationTime: data.creationTime
        });
        handleOpenModal();
    }
    //#endregion 


    const handleSubmitForm = async (formik: FormikProps<IBillPaymentProps>) => {
        setIsSaving(true);
        formik.values.cashReturn = (formik.values.cashReceived) - (formik.values.detail.reduce((total, i) => total + i.billAmount + i.fees, 0));
        var r = await creatUpdate(formik.values);
        if (r.success) {
            jzSwal.success('Data Saved Successfully')
            setState(false);
            formik.resetForm();
        }
        setIsSaving(false);
    };

    const handleSearchForm = async () => {
        const trans = await getList({
            accountID: 0,
            refNo: ''
        } as IBillPaymentFilterProps);
        setbillPayments(trans);
    };

    const handleOpenModal = async () => {
        setState(true);
    };

    const handleCloseModal = () => {
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
                            <div className='display-4 fw-bold py-3'>{t('menu:BillPayments') as ReactNode}</div>
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
                                    <label className="form-label">Search By (Ref,Number)</label>
                                    <Input className="form-control form-control-solid"
                                        value={formikSearch.values.text}
                                        onChange={formikSearch.handleChange}
                                        id="text"
                                        placeholder="Search ...." />
                                </div>
                                <div className="col-md-2 pt-4 text-end">
                                    <button id="btn-Search" onClick={() => handleSearchForm()} className="btn btn-success">  {t('menu:ShowBills') as ReactNode} </button>
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
                                        <th> Bill Type </th>
                                        <th> Ref No. </th>
                                        <th> Datetime</th>
                                        <th> Bill Amount</th>
                                        <th> Fees</th>
                                        <th> Bill Last Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {billPayments.map((tr, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{tr.billType}</td>
                                            <td>{tr.refNo}</td>
                                            <td>{dayjs(tr.creationTime).format(AppConst.Formats.dateTime)}</td>
                                            <td>{NumberFormatter(tr.billAmount)}</td>
                                            <td>{NumberFormatter(tr.fees)}</td>
                                            <td>{dayjs(tr.billLastDate).format(AppConst.Formats.date)}</td>
                                            <td>
                                                <a onClick={() => printThis(tr.billPaymentID)} className="btn btn-sm btn-light-success">Print</a>
                                                <a onClick={() => handleEdit(tr.billPaymentID)} className="btn btn-sm btn-light-info">Edit</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td><b>Total</b></td>
                                        <td><b>{NumberFormatter(billPayments.reduce((total, i) => total + i.billAmount, 0))}</b></td>
                                        <td><b>{NumberFormatter(billPayments.reduce((total, i) => total + i.fees, 0))}</b></td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <Formik
                        initialValues={formikValues}
                        enableReinitialize={true}
                        onSubmit={(values) => { }}
                        validate={(values) => {
                            const errors: Partial<IBillPaymentProps> = {};
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
                                        <ModalTitle id='exampleModalLabel'>Bill Payment</ModalTitle>
                                    </ModalHeader>
                                    <ModalBody>
                                        <Form className="formContainer">
                                            <div className="container">
                                                <div className='row'>
                                                    <FieldArray name="detail"
                                                        render={(arrayHelpers) => (
                                                            <div className="row">
                                                                <table className="table jz-table-bordered">
                                                                    <thead className="bg-primary text-light fw-bolder">
                                                                        <tr>
                                                                            <th></th>
                                                                            <th>Bill Type</th>
                                                                            <th>Ref No.</th>
                                                                            <th>Bill Last Date</th>
                                                                            <th>Total Payable</th>
                                                                            <th>Fees</th>
                                                                            <th></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="detailBody">
                                                                        {values.detail.map((d, i) => (
                                                                            <tr key={i}>
                                                                                <td>{i + 1}</td>
                                                                                <td>
                                                                                    <Select
                                                                                        id={`detail.${i}.billType`} placeholder='-- Select --' list={billTypes} ariaLabel='' className="form-control" value={d.billType} onChange={formiki.handleChange} />
                                                                                    <input
                                                                                        id={`detail.${i}.otherBillType`} type="text" className="form-control" style={{ display: 'none' }} placeholder="Explain Other ..." value={d.otherBillType} onChange={formiki.handleChange} />
                                                                                </td>
                                                                                <td> <input id={`detail.${i}.refNo`} type="text" className="form-control" value={d.refNo} onChange={formiki.handleChange} /> </td>
                                                                                <td> <input id={`detail.${i}.billLastDate`} type="date" className="form-control" value={dayjs(d.billLastDate).format(AppConst.Formats.dateForm)} onChange={formiki.handleChange} /> </td>
                                                                                <td> <input id={`detail.${i}.billAmount`} type="number" className="form-control" value={d.billAmount} onChange={formiki.handleChange} /> </td>
                                                                                <td> <input id={`detail.${i}.fees`} type="number" className="form-control" value={d.fees} onChange={formiki.handleChange} /> </td>
                                                                                <td> <button type="button" onClick={() => arrayHelpers.remove(i)} className="btn btn-danger">X</button> </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr className="fw-bolder">
                                                                            <td></td>
                                                                            <th></th>
                                                                            <th></th>
                                                                            <th>Total</th>
                                                                            <th>{formiki.values.detail.reduce((total, i) => total + i.billAmount, 0)}</th>
                                                                            <th>{formiki.values.detail.reduce((total, i) => total + i.fees, 0)}</th>
                                                                            <td>
                                                                                <button type="button" onClick={() => arrayHelpers.push(initialDetailValues)} className="btn btn-primary"> + </button>
                                                                            </td>
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>)}
                                                    />

                                                    <div className="row">
                                                        <div className="col-md-4 my-2">
                                                            <div className="form-group">
                                                                <label className="form-label">Datetime</label>
                                                                <input readOnly value={dayjs(formiki.values.creationTime).format(AppConst.Formats.dateTime)} type="text" className="bg-l10-primary form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 my-2">
                                                            <div className="form-group">
                                                                <label className="form-label">
                                                                    Cash Received <b className="text-danger">*</b>
                                                                </label>
                                                                <input type="number" className="form-control" onChange={formiki.handleChange} id="cashReceived" name="cashReceived" value={formiki.values.cashReceived} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 my-2">
                                                            <div className="form-group">
                                                                <label className="form-label">Cash Returned</label>
                                                                <input readOnly type="number" className="bg-l10-primary form-control" onChange={formiki.handleChange} id="CashReturn" name="CashReturn" value={(formiki.values.cashReceived) - (formiki.values.detail.reduce((total, i) => total + i.billAmount + i.fees, 0))} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 my-2">
                                                            <div className="form-group">
                                                                <label className="form-label">Notes</label>
                                                                <textarea className="form-control" id="Notes" onChange={formiki.handleChange} value={formiki.values.notes} name="Notes"></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
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
                    {isReadyToPrint && printBillPayment && (<BillPaymentPrint data={printBillPayment} />)}
                </>
            </Page >
        </PageWrapper >
    );
};

export default BillPayment;
