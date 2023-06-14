import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageWrapper from '../layout/PageWrapper/PageWrapper';
import Page from '../layout/Page/Page';
import { demoPagesMenu } from '../menu';
import Card, { CardBody, CardHeader } from '../components/bootstrap/Card';
import Icon from '../components/icon/Icon';
import { ITransTypeProp, TransTypes } from '../common/RssData/TransTypes';
import { UpdateType } from '../@features/Rss/transType.slice';
import { useNavigate } from 'react-router-dom';
import { AppConst } from '../common/RssData/constants';
import { useTranslation } from 'react-i18next';

const RssDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation(['translation', 'menu']);
    const handleTypeSelect = (tr: ITransTypeProp) => {
        dispatch(UpdateType(tr));
        if (tr.id == 3) {
            navigate('/bill-Payment');
        } else {
            navigate('/selectBank');
        }
    }
    return (
        <PageWrapper title={demoPagesMenu.projectManagement.subMenu.list.text}>
            <Page>
                <div className='row'>
                    <div className='col-12 mb-4'>
                        <div className='display-4 fw-bold py-3'>{t('menu:SelectType') as ReactNode}</div>
                    </div>

                    {TransTypes.map((item, index) => (
                        <div key={index} className='col-md-3'>
                            <Card
                                onClick={() => handleTypeSelect(item)}
                                style={{ cursor: 'pointer' }}
                                shadow='none'
                                borderSize={1}
                                borderColor={item.color}
                                stretch
                                className='mb-0 text-center'>
                                <CardHeader className="text-center d-block">
                                    <Icon size='10x' icon={item.icon}></Icon>
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

export default RssDashboard;
