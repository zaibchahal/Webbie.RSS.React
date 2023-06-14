import React, { useCallback, useEffect, useState } from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import { demoPagesMenu } from '../../menu';
import Card, { CardBody, CardHeader } from '../../components/bootstrap/Card';
import Icon from '../../components/icon/Icon';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailList, IProductFilterProps, IProductProps } from '../../services/POS/productService';
import { LoadProducts } from '../../@features/POS/products.slice';
import { BASE_URL, PRODUCT_URLS } from '../../common/RssData/constants';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import { Delete } from '../../services/baseService';

const ListProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [products, setProducts] = useState<IProductProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            let b = await getDetailList({} as IProductFilterProps);
            setProducts(b || []);
        };
        fetchData();
    }, []);

    useEffect(() => {
        dispatch(LoadProducts(products));
    }, [dispatch, products]);

    const handleDelete = async (item: IProductProps) => {
        var f = await Delete(PRODUCT_URLS.Delete + '?id=' + item.id);
        if (f) setProducts((b) => b.filter((product) => product.id !== item.id));
    };
    return (
        <PageWrapper title={demoPagesMenu.projectManagement.subMenu.list.text}>
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            { title: 'Manage Products', to: '/page-layouts' },
                        ]}
                    />
                </SubHeaderLeft>
            </SubHeader>
            <Page>
                <div className='row'>
                    <div className='col-8 mb-4'>
                        <div className='display-4 fw-bold py-3'>Products List</div>
                    </div>
                    <div className='col-4 text-end py-4'>
                        <button className='btn btn-primary ' onClick={() => navigate('/product/create')} > <Icon size='2x' icon='Add' ></Icon> Create New </button>
                    </div>


                    <div className='col-12'>
                        <Card>
                            <CardBody>
                                <table className='table table-modern'>
                                    <thead>
                                        <tr>
                                            <th> Sr.</th>
                                            <th> Image </th>
                                            <th> Code </th>
                                            <th> Name </th>
                                            <th> Brand </th>
                                            <th> Category </th>
                                            <th> Cost </th>
                                            <th> Price </th>
                                            <th> Quantity </th>
                                            <th> Min Qty </th>
                                            <th> Action </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {products.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td><img src={BASE_URL + item.pic} style={{ height: 20 }} /></td>
                                                <td>{item.barcode}</td>
                                                <td>{item.name}</td>
                                                <td>{item.nBrand}</td>
                                                <td>{item.nCategory}</td>
                                                <td>{item.costPrice}</td>
                                                <td>{item.salePrice}</td>
                                                <td>{item.balance}</td>
                                                <td>{item.minInvLevel}</td>
                                                <td>
                                                    <button onClick={() => navigate(`/product/create/${item.id}`)} className="btn btn-outline-primary" > <Icon icon="Edit" ></Icon> </button>|
                                                    <button onClick={() => handleDelete(item)} className="btn btn-outline-danger" > <Icon icon="Delete" ></Icon> </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </div>

                </div>
            </Page>
        </PageWrapper>
    );
};

export default ListProduct;
