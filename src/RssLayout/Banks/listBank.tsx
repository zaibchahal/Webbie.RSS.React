import React, { useCallback, useEffect, useState } from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import { demoPagesMenu } from '../../menu';
import Card, { CardBody, CardHeader } from '../../components/bootstrap/Card';
import Icon from '../../components/icon/Icon';
import { ITransTypeProp, TransTypes } from '../../common/RssData/TransTypes';
import { UpdateType } from '../../@features/Rss/transType.slice';
import { useNavigate } from 'react-router-dom';
import { RootState, store } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { getList, IBankProps } from '../../services/bankService';
import { LoadBanks } from '../../@features/Rss/banks.slice';
import { BANKS_URLS, BASE_URL } from '../../common/RssData/constants';
import Swal from 'sweetalert2'
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import { Delete } from '../../services/baseService';

const ListBank = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedType = useSelector((state: RootState) => state.transType.Type);
    const cbanks = useSelector((state: RootState) => state.banks.Banks)[selectedType.id.toString()];
    const [banks, setBanks] = useState<IBankProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            let b = await getList(selectedType.id.toString());
            setBanks(b || []);
        };
        fetchData();
    }, [selectedType]);

    useEffect(() => {
        dispatch(LoadBanks({ type: selectedType.id.toString(), banks: banks }));
    }, [selectedType, dispatch, banks]);

    const handleDelete = async (item: IBankProps) => {
        var f = await Delete(BANKS_URLS.Delete + '?id=' + item.id);
        if (f) setBanks((b) => b.filter((bank) => bank.id !== item.id));
    };
    return (
        <PageWrapper title={demoPagesMenu.projectManagement.subMenu.list.text}>
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
                    <div className='col-8 mb-4'>
                        <div className='display-4 fw-bold py-3'>Manage Banks</div>
                        <div className='fs-6 fw-bold'>{selectedType.name}</div>
                    </div>
                    <div className='col-4 text-end py-4'>

                        <button className='btn btn-outline-primary ' onClick={() => navigate('/selectBank')} > <Icon size='2x' icon='ArrowBack' ></Icon> Back To Banks </button> |
                        <button className='btn btn-primary ' onClick={() => navigate('/bank/create')} > <Icon size='2x' icon='Add' ></Icon> Create New </button>
                    </div>


                    <div className='col-12'>
                        <Card>
                            <CardBody>
                                <table className='table table-modern'>
                                    <thead>
                                        <tr>
                                            <th> Sr.</th>
                                            <th> Image </th>
                                            <th> Name </th>
                                            <th> Action </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {banks.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td><img src={BASE_URL + item.pic} style={{ height: 30 }} /></td>
                                                <td>{item.name}</td>
                                                <td>
                                                    <button onClick={() => navigate(`/bank/create/${item.id}`)} className="btn btn-outline-primary" > <Icon icon="Edit" ></Icon> </button>|
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

export default ListBank;
