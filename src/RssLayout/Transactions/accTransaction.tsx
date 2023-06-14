import React, { useCallback, useEffect, useState } from 'react';
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
import { useFormik } from 'formik';
import { IAccTransactionFilterProps, IAccTransactionProps } from '../../services/accTransactionService';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Label from '../../components/bootstrap/forms/Label';
import dayjs from 'dayjs';
import Textarea from '../../components/bootstrap/forms/Textarea';
import { get, IBankAccountDetailProps } from '../../services/bankAccountService';
import { creatUpdate, getList } from '../../services/accTransactionService';
import NumberFormatter from '../../common/RssData/formster';
import '../../styles/style.css';
import { jzSwal } from '../../common/RssData/helper';
import Spinner from '../../components/bootstrap/Spinner';
import { DateRangePicker } from '../../components/rss/daterange';
import TransPrint, { showPrint } from '../Prints/transPrint';
//import DateRangePicker from 'rsuite/DateRangePicker';

const AccTrasaction = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const accTransTypes = AppEnums.AccTransTypes;
    const selectedType = useSelector((state: RootState) => state.transType.Type);
    const selectedBank = store.getState().banks.selectedBank;
    const selectedAccount = store.getState().bankAccounts.selectedAccount;

    const [state, setState] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [modalTitle, setmodalTitle] = useState('');
    const [currentAccountDetail, setcurrentAccountDetail] = useState<IBankAccountDetailProps>({} as IBankAccountDetailProps);
    const [accTansactions, setAccTansactions] = useState<IAccTransactionProps[]>([]);
    const [startDate, setStartDate] = useState<Date>(new Date);
    const [endDate, setEndDate] = useState<Date>(new Date);
    const [selectedRange, setSelectedRange] = useState<Range[]>([]);

    //#region Print
    const [printTransaction, setPrintTransaction] = useState<IAccTransactionProps | null>(null);
    const [isReadyToPrint, setIsReadyToPrint] = useState(false);

    useEffect(() => {
        if (isReadyToPrint) {
            showPrint();
            setIsReadyToPrint(false);
        }
    }, [isReadyToPrint]);

    const printThis = (data: IAccTransactionProps) => {
        console.log(isReadyToPrint);
        setPrintTransaction(data);
        setIsReadyToPrint(true);
    };
    //#endregion

    //#region Edit
    const handleEdit = (t: IAccTransactionProps, title?: string) => {
        formik.values.amount = t.amount;
        formik.values.tid = t.tid;
        formik.values.netAmount = t.netAmount;
        formik.values.number = t.number;
        formik.values.comm = t.comm;
        formik.values.profit = t.profit;
        formik.values.notes = t.notes;
        formik.values.id = t.id;
        //formik.values.creationTime = t.creationTime;
        handleOpenModal(t.cashType, t.transType, title);
    }
    //#endregion 

    const fetchData = useCallback(async () => {
        const acc = await get(selectedAccount.id);
        setcurrentAccountDetail(acc);
    }, [selectedAccount.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmitForm = async (values: IAccTransactionProps) => {
        setIsSaving(true);
        var r = await creatUpdate(values);
        if (r.success) {
            jzSwal.success('Data Saved Successfully');
            fetchData();
            setState(false);
            formik.resetForm();
        }
        setIsSaving(false);
    };

    const handleSearchForm = async () => {
        const trans = await getList({
            accountID: selectedAccount.id,
            number: formikSearch.values.text,
            tid: formikSearch.values.text,
        } as IAccTransactionFilterProps);
        console.log(trans);
        setAccTansactions(trans);
    };

    const handleOpenModal = async (cashType: number | string, accTransType: number | string, title?: string) => {
        formik.values.cashType = cashType.toString();
        formik.values.transType = accTransType.toString();
        formik.values.accountID = selectedAccount.id;
        setmodalTitle(title || '');
        setState(true);
    };

    const handleCloseModal = () => {
        setState(false);
        setIsSaving(false);
        formik.resetForm();
    }
    const handleSaveChanges = () => {
        formik.submitForm();
    }

    const formik = useFormik({
        initialValues: {} as IAccTransactionProps,
        validate: (values) => {
            const errors: Partial<IAccTransactionProps> = {};
            //if (!values.amount) {
            //    errors.amount = 5;
            //}
            return errors;
        },
        onSubmit: (values) => {
            values.amount = parseFloat((values.amount || 0).toString());
            values.comm = parseFloat((values.comm || 0).toString());
            switch (values.transType) {
                case accTransTypes.CashIn.toString():
                    values.netAmount = values.amount - ((values.comm * AppConst.Calculations.CashInOut) / 100);
                    break;
                case accTransTypes.CashOut.toString():
                    values.netAmount = values.amount + ((values.comm * AppConst.Calculations.CashInOut) / 100);
                    break;

                case accTransTypes.TillIDReceive.toString():
                    const perc1 = ((values.amount * AppConst.Calculations.TillSendReceive) / 100);
                    values.netAmount = values.amount - perc1;
                    values.profit = perc1;
                    break;

                case accTransTypes.TillIDSend.toString():
                    values.netAmount = values.amount;
                    break;

                case accTransTypes.Load.toString():
                case accTransTypes.LoadDuplicateSim.toString():
                case accTransTypes.LoadPurchase.toString():
                    values.netAmount = values.amount - values.comm;
                    break;
            }


            handleSubmitForm(values);
        },
    });

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
                            { title: selectedType.name, to: '/selectBank' },
                            { title: selectedBank.name, to: '/bank-accounts' },
                            { title: selectedAccount.title, to: '/bank-accounts' },
                        ]}
                    />
                </SubHeaderLeft>
            </SubHeader>
            <Page>
                <>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="d-flex justify-content-between bg-primary rounded-3 p-5 mb-2">
                                <div className="fs-6 fw-bold text-white">
                                    <span className="d-block fs-2  mb-3">{selectedAccount.title}</span>
                                    <span className="d-block  mb-2">Last Cash-In</span>
                                    <span className="d-block mb-2">Last Cash-Out</span>
                                </div>
                                <div className="fs-6 fw-bold text-white text-end">
                                    <span className="d-block fs-2 mb-3" data-kt-pos-element="grant-total">Rs. {NumberFormatter(currentAccountDetail.balance, 2, 2)}</span>
                                    <span className="d-block  mb-2" data-kt-pos-element="total">Rs. {NumberFormatter(currentAccountDetail.lastCashIn, 2, 2)}</span>
                                    <span className="d-block mb-2" data-kt-pos-element="discount">Rs. {NumberFormatter(currentAccountDetail.lastCashOut, 2, 2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex flex-column h-100 justify-content-evenly min-h-125px px-19 w-100">
                                {selectedType.id == 1 ?
                                    (
                                        <>
                                            <button className='btn btn-danger btn-lg' onClick={() => handleOpenModal(AppEnums.CashTypes.CashIn, accTransTypes.CashIn, 'Cash In')} >Cash In </button>
                                            <button className='btn btn-success btn-lg' onClick={() => handleOpenModal(AppEnums.CashTypes.CashOut, accTransTypes.CashOut, 'Cash Out')} >Cash Out </button>
                                        </>
                                    ) :
                                    selectedType.id == 2 ?
                                        (
                                            <>
                                                <button className='btn btn-danger btn-lg' onClick={() => handleOpenModal(AppEnums.CashTypes.CashIn, accTransTypes.TillIDSend, 'Till ID Send')} >Till ID Send  </button>
                                                <button className='btn btn-success btn-lg' onClick={() => handleOpenModal(AppEnums.CashTypes.CashOut, accTransTypes.TillIDReceive, 'Till ID Receive ')} >Till ID Receive </button>
                                            </>
                                        ) : selectedType.id == 4 ?
                                            (
                                                <>
                                                    <button className='btn btn-danger btn-lg' onClick={() => handleOpenModal(AppEnums.CashTypes.CashIn, accTransTypes.Load, 'Load')} >Load </button>
                                                    <button className='btn btn-danger btn-lg' onClick={() => handleOpenModal(AppEnums.CashTypes.CashIn, accTransTypes.LoadDuplicateSim, 'Load Duplicate SIM')} >Load Duplicate SIM </button>
                                                    <button className='btn btn-success btn-lg' onClick={() => handleOpenModal(AppEnums.CashTypes.CashOut, accTransTypes.LoadPurchase, 'Load Purchase')} >Load Purchase </button>
                                                </>
                                            ) : ('')
                                }
                            </div>
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
                                <div className="col-md-2 pt-6 text-end">
                                    <button id="btn-Search" onClick={() => handleSearchForm()} className="btn btn-success"> Show Transactions </button>
                                </div>
                            </div>
                        </div>
                    </div >
                    {accTansactions.map((t, i) => (
                        <div className='row' key={i}>
                            {t.cashType == AppEnums.CashTypes.CashOut.toString() && (<div className="col"></div>)}
                            <div className={t.cashType == AppEnums.CashTypes.CashOut.toString() ? 'borderleft col' : 'borderright col'}  >
                                <div className="d-flex align-items-center mb-3">
                                    <span className={(t.cashType == AppEnums.CashTypes.CashOut.toString() ? 'bg-success' : 'bg-danger') + " bullet d-flex align-items-center min-h-70px mh-100 me-4"} ></span>
                                    <div className="flex-grow-1 me-5">
                                        <div className="text-gray-700 fw-semibold fs-2">{t.tid}</div>
                                        <div className="text-gray-800 fw-semibold fs-6">
                                            Amount : Rs  {NumberFormatter(t.netAmount, 2, 2)}
                                            <span className="text-info fw-semibold fs-7"> AT </span>
                                            {dayjs(t.creationTime).format(AppConst.Formats.dateTime)}
                                        </div>
                                        <div className="text-gray-800 fw-semibold fs-6"> Profit : Rs {NumberFormatter(t.profit)} </div>
                                        <div className="text-gray-400 fw-semibold fs-7">
                                            <a href="#" className="text-primary opacity-75-hover fw-semibold">{t.number}</a>
                                        </div>
                                    </div>
                                    <a onClick={() => printThis(t)} className="btn btn-sm btn-light-success">Print</a>
                                    <a onClick={() => handleEdit(t)} className="btn btn-sm btn-light-info">Edit</a>
                                </div>
                            </div>
                            {t.cashType == AppEnums.CashTypes.CashIn.toString() && (<div className="col"></div>)}
                        </div >
                    ))}
                    <Modal
                        isOpen={state}
                        setIsOpen={handleCloseModal}
                        titleId='exampleModalLabel'
                        isCentered={true}
                        size={'lg'}
                        fullScreen='md'
                        isStaticBackdrop={true}
                        isAnimation={true}>
                        <ModalHeader setIsOpen={handleCloseModal}>
                            <ModalTitle id='exampleModalLabel'>{modalTitle} Transaction</ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            <div className="container">

                                <div className='row'>
                                    {formik.values.transType != accTransTypes.LoadPurchase.toString() && (
                                        <div className='col-6 mb-4'>
                                            <FormGroup>
                                                <Label htmlFor='name'>Number</Label>
                                                <Input
                                                    id='number'
                                                    placeholder='Number'
                                                    aria-label='Number'
                                                    autoComplete='Number'
                                                    ariaDescribedby='addon1'
                                                    onChange={formik.handleChange}
                                                    value={formik.values.number}
                                                    isValid={formik.isValid}
                                                    isTouched={formik.touched.number}
                                                    invalidFeedback={formik.errors.number}
                                                />
                                            </FormGroup>
                                        </div>
                                    )}
                                    <div className='col-6 mb-4'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Amount</Label>
                                            <Input
                                                id='amount'
                                                placeholder='Amount'
                                                aria-label='Amount'
                                                autoComplete='Amount'
                                                required={true}
                                                ariaDescribedby='addon1'
                                                onChange={formik.handleChange}
                                                value={formik.values.amount}
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.amount}
                                                invalidFeedback={formik.errors.amount}
                                            />
                                        </FormGroup>
                                    </div>

                                    {formik.values.transType != accTransTypes.LoadPurchase.toString() ? (
                                        <>
                                            {(formik.values.transType == accTransTypes.LoadDuplicateSim.toString() ||
                                                formik.values.transType == accTransTypes.Load.toString()) ? (

                                                <div className='col-6 mb-4'>
                                                    <FormGroup>
                                                        <Label htmlFor='name'>Ref No</Label>
                                                        <Input
                                                            id='tid'
                                                            placeholder='Enter Last 5 didgits only'
                                                            aria-label='TID'
                                                            autoComplete='TID'
                                                            ariaDescribedby='addon1'
                                                            onChange={formik.handleChange}
                                                            value={formik.values.tid}
                                                            isValid={formik.isValid}
                                                            isTouched={formik.touched.tid}
                                                            invalidFeedback={formik.errors.tid}
                                                        />
                                                    </FormGroup>
                                                </div>
                                            ) : (
                                                <div className='col-6 mb-4'>
                                                    <FormGroup>
                                                        <Label htmlFor='name'>TID</Label>
                                                        <Input
                                                            id='tid'
                                                            placeholder='TID'
                                                            aria-label='TID'
                                                            autoComplete='TID'
                                                            ariaDescribedby='addon1'
                                                            onChange={formik.handleChange}
                                                            value={formik.values.tid}
                                                            isValid={formik.isValid}
                                                            isTouched={formik.touched.tid}
                                                            invalidFeedback={formik.errors.tid}
                                                        />
                                                    </FormGroup>
                                                </div>
                                            )
                                            }
                                        </>
                                    ) : (

                                        <div className='col-6 mb-4'>
                                            <FormGroup>
                                                <Label htmlFor='name'>Profit</Label>
                                                <Input
                                                    id='profit'
                                                    placeholder=' Profit'
                                                    aria-label=' Profit'
                                                    readOnly={false}
                                                    ariaDescribedby='addon1'
                                                    onChange={formik.handleChange}
                                                    value={formik.values.profit}
                                                    isValid={formik.isValid}
                                                    isTouched={formik.touched.profit}
                                                    invalidFeedback={formik.errors.profit}
                                                />
                                            </FormGroup>
                                        </div>
                                    )}
                                    <div className='col-6 mb-4'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Datetime</Label>
                                            <Input
                                                className='bg-l10-primary'
                                                id='datetime'
                                                placeholder='Datetime'
                                                aria-label='Datetime'
                                                autoComplete='Datetime'
                                                readOnly={true}
                                                ariaDescribedby='addon1'
                                                onChange={formik.handleChange}
                                                value={dayjs(formik.values.creationTime).format(AppConst.Formats.dateTime)}
                                                isValid={formik.isValid}
                                            />
                                        </FormGroup>
                                    </div>
                                    {(formik.values.transType == accTransTypes.CashIn.toString() ||
                                        formik.values.transType == accTransTypes.CashOut.toString()) && (
                                            <>
                                                <div className='col-6 mb-4'>
                                                    <FormGroup>
                                                        <Label htmlFor='name'>Commission</Label>
                                                        <Input
                                                            id='comm'
                                                            placeholder='Commission'
                                                            aria-label='Commission'
                                                            readOnly={false}
                                                            ariaDescribedby='addon1'
                                                            onChange={formik.handleChange}
                                                            value={formik.values.comm}
                                                            isValid={formik.isValid}
                                                            isTouched={formik.touched.comm}
                                                            invalidFeedback={formik.errors.comm}
                                                        />
                                                    </FormGroup>
                                                </div>
                                                <div className='col-6 mb-4'>
                                                    <FormGroup>
                                                        <Label htmlFor='name'>Other Profit</Label>
                                                        <Input
                                                            id='profit'
                                                            placeholder='Other Profit'
                                                            aria-label='Other Profit'
                                                            readOnly={false}
                                                            ariaDescribedby='addon1'
                                                            onChange={formik.handleChange}
                                                            value={formik.values.profit}
                                                            isValid={formik.isValid}
                                                            isTouched={formik.touched.profit}
                                                            invalidFeedback={formik.errors.profit}
                                                        />
                                                    </FormGroup>
                                                </div>
                                            </>
                                        )}

                                    {(formik.values.transType == accTransTypes.TillIDReceive.toString() ||
                                        formik.values.transType == accTransTypes.TillIDSend.toString()) && (
                                            <>
                                                <div className='col-6 mb-4'>
                                                    <FormGroup>
                                                        <Label htmlFor='name'>Fees</Label>
                                                        <Input
                                                            id='profit'
                                                            className={formik.values.transType == accTransTypes.TillIDReceive.toString() ? 'bg-l10-primary' : ''}
                                                            placeholder='Fees'
                                                            aria-label='Fees'
                                                            readOnly={formik.values.transType == accTransTypes.TillIDReceive.toString()}
                                                            ariaDescribedby='addon1'
                                                            onChange={formik.handleChange}
                                                            value={formik.values.transType == accTransTypes.TillIDReceive.toString() ? (((formik.values.amount * AppConst.Calculations.TillSendReceive) / 100)) : formik.values.profit}
                                                            isValid={formik.isValid}
                                                            isTouched={formik.touched.profit}
                                                            invalidFeedback={formik.errors.profit}
                                                        />
                                                    </FormGroup>
                                                </div>
                                            </>
                                        )}
                                    {(formik.values.transType == accTransTypes.TillIDReceive.toString()) && (
                                        <>
                                            <div className='col-6 mb-4'>
                                                <FormGroup>
                                                    <Label htmlFor='name'>Paid Amount</Label>
                                                    <Input
                                                        className='bg-l10-primary'
                                                        readOnly={true}
                                                        onChange={() => { }}
                                                        value={formik.values.amount - (((formik.values.amount * AppConst.Calculations.TillSendReceive) / 100) * 2)}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </>
                                    )}
                                    {formik.values.transType == accTransTypes.Load.toString() && (
                                        <>
                                            <div className='col-6 mb-4'>
                                                <FormGroup>
                                                    <Label htmlFor='name'>Profit/Fees</Label>
                                                    <Input
                                                        id='profit'
                                                        placeholder='Fees'
                                                        aria-label='Fees'
                                                        readOnly={false}
                                                        ariaDescribedby='addon1'
                                                        onChange={formik.handleChange}
                                                        value={formik.values.profit}
                                                        isValid={formik.isValid}
                                                        isTouched={formik.touched.profit}
                                                        invalidFeedback={formik.errors.profit}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className='col-6 mb-4'>
                                                <FormGroup>
                                                    <Label htmlFor='name'>Commission</Label>
                                                    <Input
                                                        id='comm'
                                                        placeholder='Commission'
                                                        aria-label='Commission'
                                                        readOnly={false}
                                                        ariaDescribedby='addon1'
                                                        onChange={formik.handleChange}
                                                        value={formik.values.comm}
                                                        isValid={formik.isValid}
                                                        isTouched={formik.touched.comm}
                                                        invalidFeedback={formik.errors.comm}
                                                    />
                                                </FormGroup>
                                            </div>
                                        </>
                                    )}
                                    <div className='col-12 mb-4'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Notes</Label>
                                            <Textarea
                                                id='notes'
                                                placeholder='Notes'
                                                aria-label='Notes'
                                                readOnly={false}
                                                ariaDescribedby='addon1'
                                                onChange={formik.handleChange}
                                                value={formik.values.notes}
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.notes}
                                                invalidFeedback={formik.errors.notes}
                                            />
                                        </FormGroup>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color='info'
                                isOutline
                                className='border-0'
                                onClick={() => handleCloseModal()}>
                                Close
                            </Button>
                            <Button onClick={() => handleSaveChanges()} color='info' icon='Save'>
                                {isSaving && (
                                    <Spinner isSmall inButton isGrow />
                                )}
                                {formik.values.id > 0 ? ' Update' : ' Save'}
                            </Button>
                        </ModalFooter>
                    </Modal>
                    {isReadyToPrint && printTransaction && (<TransPrint data={printTransaction} />)}
                </>
            </Page >
        </PageWrapper >
    );
};

export default AccTrasaction;
