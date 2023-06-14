import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import { demoPagesMenu } from '../../menu';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppConst, AppEnums, BASE_URL, SALE_URLS } from '../../common/RssData/constants';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import { FieldArray, Form, Formik, FormikProps, useFormik } from 'formik';
import Input from '../../components/bootstrap/forms/Input';
import { get, getList, ISaleDetailProps, ISaleFilterProps, ISaleProps } from '../../services/POS/posService';
import NumberFormatter, { convertLocal, getLocal } from '../../common/RssData/formster';
import '../../styles/style.css';
import { jzSwal } from '../../common/RssData/helper';
import { DateRangePicker2 } from '../../components/rss/daterange2';
import Icon from '../../components/icon/Icon';
import { useTranslation } from 'react-i18next';
import { Delete } from '../../services/baseService';
import { SetSaleID } from '../../@features/POS/edit';
//import DateRangePicker from 'rsuite/DateRangePicker';

const Purchase = () => {
    const { t } = useTranslation(['translation', 'menu']);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [Sale, setSale] = useState<ISaleProps[]>([]);
    const [startDate, setStartDate] = useState<string>(new Date().toJSON());
    const [endDate, setEndDate] = useState<string>(new Date().toJSON());


    const handleDelete = async (id: number) => {
        var f = await Delete(SALE_URLS.Delete + '?id=' + id);
        if (f) setSale((b) => b.filter((x) => x.id !== id));
    };

    const handleEdit = async (id: number) => {
        dispatch(SetSaleID(id));
        navigate('/pos');
    };

    const handleSearchForm = async () => {
        const trans = await getList({
            refNo: '',
            startDate: startDate,
            endDate: endDate
        } as ISaleFilterProps);
        setSale(trans);
    };


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
                            { title: 'Sale List', to: '/selectBank' }
                        ]}
                    />
                </SubHeaderLeft>
            </SubHeader>
            <Page>
                <>
                    <div className='row'>
                        <div className='col-8 mb-4'>
                            <div className='display-4 fw-bold py-3'>{t('menu:SaleList') as ReactNode}</div>
                        </div>
                        <div className='col-4 text-end py-4'>
                            <button className='btn btn-primary ' onClick={() => navigate('/pos')} > <Icon size='2x' icon='Add' ></Icon>  {t('menu:CreateNew') as ReactNode} </button>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="bg-l10-info border-bottom-1 my-5 p-3">
                            <div className="row">
                                <div className="col-md-6">
                                    <DateRangePicker2 onDatesSelected={(s: Date, e: Date) => { setStartDate(s.toJSON()); setEndDate(e.toJSON()) }} />
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
                                        <th> Customer</th>
                                        <th> Total Qty</th>
                                        <th> Total Amount</th>
                                        <th> Notes</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Sale.map((tr, i) => (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{getLocal(tr.date).format(AppConst.Formats.dateTime)}</td>
                                            <td>{tr.customerName || 'Walk-In'}</td>
                                            <td>{tr.totalQty}</td>
                                            <td>{tr.totalAmount}</td>
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

                </>
            </Page >
        </PageWrapper >
    );
};

export default Purchase;
