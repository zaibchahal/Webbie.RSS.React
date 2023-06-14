import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import { demoPagesMenu } from '../../menu';
import { useNavigate } from 'react-router-dom';
import { RootState, store } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { AppConst, AppEnums, BASE_URL, SALE_URLS } from '../../common/RssData/constants';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../components/bootstrap/Modal';
import Button from '../../components/bootstrap/Button';
import { FieldArray, Form, Formik, FormikProps, useFormik } from 'formik';
import dayjs from 'dayjs';
import { creatUpdate, get, getList as getListStocks, ISaleDetailProps, ISaleFilterProps, ISaleProps } from '../../services/POS/posService';
import NumberFormatter, { convertLocal, getLocal } from '../../common/RssData/formster';
import '../../styles/style.css';
import { jzSwal } from '../../common/RssData/helper';
import Spinner from '../../components/bootstrap/Spinner';
import Icon from '../../components/icon/Icon';
import { useTranslation } from 'react-i18next';
import { IFileProp, uploadFile } from '../../services/filehelperService';
import { getDetailList, IProductFilterProps, IProductProps } from '../../services/POS/productService';
import Swal from 'sweetalert2';
import { showPrint } from '../../RssLayout/Prints/transPrint';
import POSPrint from './posPrint';
//import DateRangePicker from 'rsuite/DateRangePicker';

const POS = () => {
    const { t } = useTranslation(['translation', 'menu']);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const editSaleID = useSelector((state: RootState) => state.Edit.SaleID);

    const [isSaving, setIsSaving] = useState(false);
    const [startDate, setStartDate] = useState<Date>(new Date);
    const [endDate, setEndDate] = useState<Date>(new Date);
    const [selectedRange, setSelectedRange] = useState<Range[]>([]);

    const initValues = {
        date: new Date(),
        notes: '',
        refNo: '',
    } as ISaleProps;



    //#region Print
    const [printBillPayment, setprintBillPayment] = useState<ISaleProps | null>(null);
    const [isReadyToPrint, setIsReadyToPrint] = useState(false);

    useEffect(() => {
        if (isReadyToPrint) {
            showPrint(true);
            setIsReadyToPrint(false);
        }
    }, [isReadyToPrint]);

    const printThis = async (formik: FormikProps<ISaleProps>) => {
        setprintBillPayment(formik.values);
        setIsReadyToPrint(true);
    };
    //#endregion

    //#region Edit

    const [formikValues, setFormikValues] = useState(initValues);

    const handleEdit = useCallback(async (id: number) => {
        var data = await get(id);
        setFormikValues({
            ...formikValues,
            id: data.id,
            detail: data.detail,
            notes: data.notes,
            date: convertLocal(data.date),
            refNo: data.refNo,
        });
    }, [formikValues]);
    useEffect(() => {
        const fetchData = async () => {
            handleEdit(editSaleID);
        };
        if (editSaleID > 0) {
            fetchData();
        }
    }, [editSaleID, handleEdit]);
    //#endregion




    const [products, setProducts] = useState<IProductProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            let b = await getDetailList({} as IProductFilterProps);
            setProducts(b || []);
        };
        fetchData();
    }, []);

    const handleAddNewRow = async (e: any, formik: FormikProps<ISaleProps>) => {
        if (e.key === 'Enter') {
            const p = products.find((x) => x.barcode == e.target.value)
            if (!p) {
                jzSwal.error("Product Not Found");
                return;
            }
            var f = AddNewDetail(p, formik);
            if (f) {
                e.target.value = '';
            }
        }
    }

    const AddNewDetail = (p: IProductProps, formik: FormikProps<ISaleProps>) => {
        if (!formik.values.detail) formik.values.detail = [];
        const currentDetails = [...formik.values.detail];
        const exists = currentDetails.find((x) => x.productId == p?.id)
        if (exists) {
            jzSwal.error("Product Already Added");
            return false;
        }

        if (!formik.values.detail) formik.values.detail = [];
        currentDetails.push({
            productId: p.id,
            productName: p.name,
            barcode: p.barcode,
            qty: 1,
            salePrice: p.salePrice
        } as ISaleDetailProps);
        formik.setValues({
            ...formik.values,
            detail: currentDetails,
        });
        return true;
    }

    const handleRemoveRow = (i: number, formik: FormikProps<ISaleProps>) => {
        const updatedRows = formik.values.detail.filter((_, index) => index !== i);
        formik.setValues({ ...formik.values, detail: updatedRows });
    };

    const handleSubmitForm = async (formik: FormikProps<ISaleProps>) => {
        setIsSaving(true);
        if (!formik.values.date) formik.values.date = new Date();
        formik.values.totalAmount = formik.values.detail?.reduce((total, i) => total + ((i.salePrice || 0) * (i.qty || 0)), 0);

        var r = await creatUpdate(formik.values);
        if (r.success) {
            jzSwal.success('Data Saved Successfully')
            formik.resetForm();
            formik.setValues(initValues);
        }
        setIsSaving(false);
    };


    const style = `
    .pos-item{
        border: 1px solid #6c757d;
        border-radius: 15px;
        cursor:pointer;
    }
    .pos-item:hover{
        background-color: #e2f1ff;
    }
    .itemsCard{
        height: 100%;
        max-height: 520px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .table-container {
      position: relative;
      height: 300px; /* Specify the desired height of the table container */
      overflow: auto;
    }

    .table-container thead {
      position: sticky;
      top: 0;
      background-color: #f8f9fa; /* Customize the header background color */
      z-index: 1;
    }

    .table-container tfoot {
      position: sticky;
      bottom: 0;
      background-color: #f8f9fa; /* Customize the footer background color */
      z-index: 1;
    }


    `;
    return (
        <PageWrapper title={demoPagesMenu.projectManagement.subMenu.list.text}>
            <style>{style}</style>
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            { title: 'POS', to: '/selectBank' }
                        ]}
                    />
                </SubHeaderLeft>
            </SubHeader>
            <Page>
                <>
                    <div className='row'>
                        <div className='col-8 mb-4'>
                            <div className='display-4 fw-bold py-3'>{t('menu:Sale') as ReactNode}</div>
                        </div>
                        <div className='col-4 text-end py-4'>
                            <button className='btn btn-primary ' onClick={() => navigate('/pos/salelist')} > Sale List </button>
                        </div>
                    </div>
                    <Formik
                        initialValues={formikValues}
                        enableReinitialize={true}
                        onSubmit={(values) => { }}
                        validate={(values) => {
                            const errors: Partial<ISaleProps> = {};
                            //if (!values.amount) {
                            //    errors.amount = 5;
                            //}
                            return errors;
                        }}
                    >
                        {(formiki) => {
                            const { values } = formiki;
                            return (
                                <>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="card p-2 h-100">
                                                <Form>
                                                    <div className="row">
                                                        <div className="col-md-6 my-2">
                                                            <div className="form-group">
                                                                <label className="form-label">Datetime</label>
                                                                <input value={dayjs(formiki.values.date).format(AppConst.Formats.datetimeForm)} onChange={(e) => formiki.setFieldValue('date', new Date(e.target.value))} id="date"
                                                                    type="datetime-local" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 my-2">
                                                            <div className="form-group">
                                                                <label className="form-label">
                                                                    Ref. No <b className="text-danger">*</b>
                                                                </label>
                                                                <input type="text" className="form-control" onChange={(e) => formiki.setFieldValue('refNo', e.target.value)} id="refNo" name="refNo" value={formiki.values.refNo} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <input type="text" placeholder="Product Code" className="form-control" onKeyUp={(e) => handleAddNewRow(e, formiki)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <FieldArray name="detail"
                                                        render={(arrayHelpers) => (
                                                            <div className="row jz-table-row">
                                                                <div className="col table-container">
                                                                    <table className="table jz-table table-bordered">
                                                                        <thead className="bg-primary text-light fw-bolder">
                                                                            <tr>
                                                                                <th>Sr.</th>
                                                                                <th className="w-75">Name</th>
                                                                                <th className="text-center w-25" >Qty</th>
                                                                                <th>Amt</th>
                                                                                <th></th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody id="detailBody">
                                                                            {values.detail?.map((d, i) => (
                                                                                <tr key={i}>
                                                                                    <td>{i + 1}</td>
                                                                                    <td>{d?.productName}<br /><span>Code : {d.barcode}</span> | <b>Rs.{d.salePrice}</b> </td>
                                                                                    <td> <input id={`detail.${i}.qty`} type="number" className="form-control text-center" value={d?.qty} onChange={formiki.handleChange} /> </td>
                                                                                    <td>{(d.salePrice || 0) * (d.qty || 0)}</td>
                                                                                    <td> <button type="button" onClick={() => handleRemoveRow(i, formiki)} className="btn btn-danger">X</button> </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                        <tfoot>
                                                                            <tr className="fw-bolder">
                                                                                <th></th>
                                                                                <th>Total</th>
                                                                                <th className="text-center" >{formiki.values.detail?.reduce((total, i) => total + i.qty, 0)}</th>
                                                                                <th>{formiki.values.detail?.reduce((total, i) => total + ((i.salePrice || 0) * (i.qty || 0)), 0)}</th>
                                                                                <td> </td>
                                                                            </tr>
                                                                        </tfoot>
                                                                    </table>
                                                                </div>
                                                            </div>)}
                                                    />

                                                    <div className="row">
                                                        <div className="col-md-12 my-2">
                                                            <div className="form-group">
                                                                <label className="form-label">Notes</label>
                                                                <textarea className="form-control" id="notes" placeholder="Enter ....." onChange={(e) => formiki.setFieldValue('notes', e.target.value)} value={formiki.values.notes} name="notes"></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="card p-2 itemsCard">
                                                <div className="row">
                                                    {products.map((p, i) => (
                                                        <div key={i} className="col-md-3 p-2" onClick={() => AddNewDetail(p, formiki)} >
                                                            <div className="p-2 pos-item" >
                                                                <div>
                                                                    <img style={{ width: 60, display: 'block', margin: 'auto' }} src={BASE_URL + p.pic} ></img>
                                                                </div>
                                                                <div className="text-center" >
                                                                    <span>{p.name} <br /> </span>
                                                                    <b> Rs. {p.salePrice}</b>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='container-fluid mt-3 card'>
                                        <div className='row'>
                                            <div className='col text-center p-4'>
                                                <button className="btn btn-success" onClick={() => handleSubmitForm(formiki)} ><Icon size='2x' icon='Save' ></Icon> {formiki.values.id > 0 ? ' Update' : ' Save'}</button> |
                                                <button className="btn btn-primary" onClick={() => printThis(formiki)} ><Icon size='2x' icon='Print' ></Icon> Print</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        }}
                    </Formik>
                    {isReadyToPrint && printBillPayment && (<POSPrint data={printBillPayment} />)}
                </>
            </Page >
        </PageWrapper >
    );
};

export default POS;
