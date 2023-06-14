import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import { demoPagesMenu } from '../../menu';
import Card, { CardBody, CardHeader } from '../../components/bootstrap/Card';
import Icon from '../../components/icon/Icon';
import { useNavigate } from 'react-router-dom';
import { RootState, store } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailList, getList, IBankAccountDetailProps, IBankAccountProps } from '../../services/bankAccountService';
import { Delete } from '../../services/baseService';
import { LoadAccounts, selectAccount } from '../../@features/Rss/bankAccounts.slice';
import { AppConst, BANKS_ACCOUNT_URLS, BANKS_URLS, BASE_URL } from '../../common/RssData/constants';
import { GetCurrencyName } from '../../common/RssData/TransTypes';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import dayjs from 'dayjs';
import NumberFormatter from '../../common/RssData/formster';
import { useTranslation } from 'react-i18next';

const ListBankAccounts = () => {
    const { t } = useTranslation(['translation', 'menu']);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedType = useSelector((state: RootState) => state.transType.Type);
    const selectedBank = useSelector((state: RootState) => state.banks.selectedBank);
    const [accounts, setAccounts] = useState<IBankAccountDetailProps[]>([]);

    useEffect(() => {

        const fetchData = async () => {
            let b = await getDetailList(selectedBank.id);
            setAccounts(b || []);
        };
        fetchData();
    }, [selectedBank]);

    useEffect(() => {
        dispatch(LoadAccounts({ bankID: selectedBank.id, accounts: accounts }));
    }, [dispatch, selectedBank, accounts]);

    const handleAccountSelect = (acc: IBankAccountDetailProps) => {
        dispatch(selectAccount(acc));
        navigate('/acc-transaction');
    }

    const handleDelete = async (item: IBankAccountDetailProps) => {
        var f = await Delete(BANKS_ACCOUNT_URLS.Delete + '?id=' + item.id);
        if (f) setAccounts((a) => a.filter((account) => account.id !== account.id));
    };
    return (
        <PageWrapper title={demoPagesMenu.projectManagement.subMenu.list.text}>
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            { title: selectedType.name, to: '/selectBank' },
                            { title: selectedBank.name, to: '/bank-accounts' },
                        ]}
                    />
                </SubHeaderLeft>
            </SubHeader>
            <Page>
                <div className='row'>
                    <div className='col-8 mb-4'>
                        <div className='display-4 fw-bold py-3'>{t('menu:ManageAccounts') as ReactNode}</div>
                        <div className='fs-6 fw-bold'>{selectedBank.name}</div>
                    </div>
                    <div className='col-4 text-end py-4'>

                        <button className='btn btn-outline-primary ' onClick={() => navigate('/selectBank')} > <Icon size='2x' icon='ArrowBack' ></Icon>  {t('menu:Back') as ReactNode} </button> |
                        <button className='btn btn-primary ' onClick={() => navigate('/bankAccount/create')} > <Icon size='2x' icon='Add' ></Icon> {t('menu:CreateNew') as ReactNode} </button>
                    </div>


                    <div className='col-12'>
                        <Card>
                            <CardBody>
                                <table className='table table-modern'>
                                    <thead>
                                        <tr>
                                            <th> Sr.</th>
                                            <th> Name </th>
                                            <th> Currency </th>
                                            <th> Balance </th>
                                            <th> Last Transaction </th>
                                            <th> Action </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accounts.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.title}</td>
                                                <td>{GetCurrencyName(item.currency)}</td>
                                                <td>{NumberFormatter(item.balance)}</td>
                                                <td>{item.lastTransaction ? dayjs(item.lastTransaction).format(AppConst.Formats.dateTime) : ''}</td>
                                                <td>
                                                    <button onClick={() => navigate(`/bankAccount/create/${item.id}`)} className="btn btn-outline-primary" > <Icon icon="Edit" ></Icon> </button>|
                                                    <button onClick={() => handleAccountSelect(item)} className="btn btn-outline-success" > <Icon icon="PieChart" ></Icon> </button>|
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
        </PageWrapper >
    );
};

export default ListBankAccounts;
