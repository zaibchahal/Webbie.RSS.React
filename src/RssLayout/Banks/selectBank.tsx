import React, { ReactNode, useEffect, useState } from 'react';
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
import { LoadBanks, selectBank } from '../../@features/Rss/banks.slice';
import { BASE_URL } from '../../common/RssData/constants';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import CommonLayoutRightSubheader from '../../pages/_layout/_subheaders/CommonLayoutRightSubheader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import { useTranslation } from 'react-i18next';

const SelectBank = () => {
    const { t } = useTranslation(['translation', 'menu']);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedType = useSelector((state: RootState) => state.transType.Type);
    const cbanks = useSelector((state: RootState) => state.banks.Banks)[selectedType.id.toString()];
    const [banks, setBanks] = useState<IBankProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            let b: IBankProps[] = cbanks;
            if (!b) {
                b = await getList(selectedType.id.toString());
                dispatch(LoadBanks({ type: selectedType.id.toString(), banks: b }));
            }
            setBanks(b || []);
        };
        fetchData();
    }, [cbanks, dispatch, selectedType.id]);

    const handleBankSelect = (b: IBankProps) => {
        dispatch(selectBank(b));
        navigate('/bank-accounts');
    }
    return (
        <PageWrapper title={demoPagesMenu.projectManagement.subMenu.list.text}>
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            { title: selectedType.name, to: '/page-layouts' },
                        ]}
                    />
                </SubHeaderLeft>
            </SubHeader>
            <Page>
                <div className='row'>
                    <div className='col-8 mb-4'>
                        <div className='display-4 fw-bold py-3'>{t('menu:SelectBank') as ReactNode}</div>
                        <div className='fs-6 fw-bold'>{selectedType.name}</div>
                    </div>
                    <div className='col-4 text-end py-4'>
                        <button className='btn btn-primary ' onClick={() => navigate('/manage-Bank')} > <Icon size='2x' icon='Settings' ></Icon> Manage Banks </button>
                    </div>

                    {banks.map((item, index) => (
                        <div key={index} className='col-md-3'>
                            <Card
                                onClick={() => handleBankSelect(item)}
                                style={{ cursor: 'pointer' }}
                                shadow='none'
                                borderSize={1}
                                borderColor='primary'
                                stretch
                                className='mb-0 text-center'>
                                <CardHeader className="text-center d-block">
                                    <img src={BASE_URL + item.pic} style={{ height: 130 }} />
                                </CardHeader>
                                <CardBody>
                                    <span className="text-gray-800 fw-bold fs-2 d-block">{item.name}</span>
                                </CardBody>
                            </Card>
                        </div>
                    ))}
                </div>
            </Page>
        </PageWrapper>
    );
};

export default SelectBank;
