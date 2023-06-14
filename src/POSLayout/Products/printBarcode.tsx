import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import { demoPagesMenu, posMenus } from '../../menu';
import { useNavigate } from 'react-router-dom';
import { RootState, store } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import { FieldArray, Form, Formik, FormikProps, useFormik } from 'formik';
import '../../styles/style.css';
import { jzSwal } from '../../common/RssData/helper';
import Icon from '../../components/icon/Icon';
import { useTranslation } from 'react-i18next';
import { getDetailList, IProductFilterProps, IProductProps } from '../../services/POS/productService';
import { showPrint } from '../../RssLayout/Prints/transPrint';
import BarcodePrint from '../Prints/barcodePrint';

const StockCount = () => {
    const { t } = useTranslation(['translation', 'menu']);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    interface IItemPrintProps {
        detail: IProductProps[]
    }

    const initValues = {} as IItemPrintProps;
    //#region Edit

    const [formikValues, setFormikValues] = useState(initValues);





    const [products, setProducts] = useState<IProductProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            let b = await getDetailList({} as IProductFilterProps);
            setProducts(b || []);
        };
        fetchData();
    }, []);

    const handleAddNewRow = async (e: any, formik: FormikProps<IItemPrintProps>) => {
        if (e.key === 'Enter') {
            if (!formik.values.detail) formik.values.detail = [];
            const currentDetails = [...formik.values.detail];
            const p = products.find((x) => x.barcode == e.target.value)
            if (!p) {
                jzSwal.error("Product Not Found");
                return;
            }
            const exists = currentDetails.find((x) => x.id == p?.id)
            if (exists) {
                jzSwal.error("Product Already Added");
                return;
            }
            currentDetails.push(p);
            formik.setValues({
                ...formik.values,
                detail: currentDetails,
            });
            e.target.value = '';
        }
    }
    const handleRemoveRow = (i: number, formik: FormikProps<IItemPrintProps>) => {
        const updatedRows = formik.values.detail.filter((_, index) => index !== i);
        formik.setValues({ ...formik.values, detail: updatedRows });
    };

    //#region Print
    const [isReadyToPrint, setIsReadyToPrint] = useState(false);

    useEffect(() => {
        if (isReadyToPrint) {
            showPrint(true);
            setIsReadyToPrint(false);
        }
    }, [isReadyToPrint]);


    const handleSubmitForm = async (formik: FormikProps<IItemPrintProps>) => {
        console.log(isReadyToPrint);
        setIsReadyToPrint(true);
    };
    //#endregion




    return (
        <PageWrapper title={posMenus.products.subMenu.barcodePrint.text}>
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            { title: 'Barcode Print', to: '/selectBank' }
                        ]}
                    />
                </SubHeaderLeft>
            </SubHeader>
            <Page>
                <>

                    <Formik
                        initialValues={formikValues}
                        enableReinitialize={true}
                        onSubmit={(values) => { }}
                        validate={(values) => { }}
                    >
                        {(formiki) => {
                            const { values } = formiki;
                            return (
                                <>

                                    <div className='row'>
                                        <div className='col-8 mb-4'>
                                            <div className='display-4 fw-bold py-3'>{posMenus.products.subMenu.barcodePrint.text}</div>
                                        </div>
                                        <div className='col-4 text-end py-4'>
                                            <button className='btn btn-primary ' onClick={() => handleSubmitForm(formiki)} > <Icon size='2x' icon='Print' ></Icon>  {t('menu:Print') as ReactNode} </button>
                                        </div>
                                    </div>

                                    <Form className="formContainer">
                                        <div className="container">
                                            <FieldArray name="detail"
                                                render={(arrayHelpers) => (
                                                    <div className="row">
                                                        <div className="col-md-12 p-3 mb-2 bg-l10-brand-two">
                                                            <div className="form-group">
                                                                <label className="form-label">Scan Or Type Product Code and Press Enter to add New Product</label>
                                                                <input type="text" placeholder="Product Code" className="form-control" onKeyUp={(e) => handleAddNewRow(e, formiki)} />
                                                            </div>
                                                        </div>
                                                        <table className="table jz-table-bordered">
                                                            <thead className="bg-primary text-light fw-bolder">
                                                                <tr>
                                                                    <th></th>
                                                                    <th>Name</th>
                                                                    <th>Code</th>
                                                                    <th>Brand</th>
                                                                    <th>Category</th>
                                                                    <th>Sub-Category</th>
                                                                    <th>Prints</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody id="detailBody">
                                                                {values.detail?.map((d, i) => (
                                                                    <tr key={i}>
                                                                        <td>{i + 1}</td>
                                                                        <td>{d?.name}</td>
                                                                        <td>{d.barcode}</td>
                                                                        <td>{d.nBrand}</td>
                                                                        <td>{d.nCategory}</td>
                                                                        <td>{d.nSubCategory}</td>
                                                                        <td> <input id={`detail.${i}.balance`} type="number" className="form-control" value={d?.balance} onChange={formiki.handleChange} /> </td>
                                                                        <td> <button type="button" onClick={() => handleRemoveRow(i, formiki)} className="btn btn-danger">X</button> </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                            <tfoot>
                                                                <tr className="fw-bolder">
                                                                    <td></td>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th>Total</th>
                                                                    <th>{formiki.values.detail?.reduce((total, i) => total + (i.balance || 0), 0)}</th>
                                                                    <th></th>
                                                                    <td> </td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>)}
                                            />

                                        </div>

                                        {isReadyToPrint && formiki.values.detail && (<BarcodePrint data={formiki.values.detail} />)}
                                    </Form>
                                </>

                            );
                        }}
                    </Formik>

                </>
            </Page >
        </PageWrapper >
    );
};

export default StockCount;
