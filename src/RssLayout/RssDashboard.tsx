import React, { useEffect } from 'react';
import Humans from '../../../assets/img/scene4.png';
import HumansWebp from '../../../assets/img/scene4.webp';
import { useDispatch, useSelector } from 'react-redux';
import PageWrapper from '../layout/PageWrapper/PageWrapper';
import Button from '../components/bootstrap/Button';
import Page from '../layout/Page/Page';
import { demoPagesMenu } from '../menu';
import { RootState } from '../store';
import { UpdateSession, UpdateTest } from '../@features/Authentication/auth.slice';

const RssDashboard = () => {
	const dispatch = useDispatch();
	let myStore = useSelector((store: RootState) => store.session);
	useEffect(() => {
		dispatch(UpdateTest('store updated'));
	}, []);
	return (
		<PageWrapper title={demoPagesMenu.page404.text}>
			<Page>
				<div className='row d-flex align-items-center h-100'>
					<div className='col-12 d-flex flex-column justify-content-center align-items-center'>
						<Button
							className='px-5 py-3'
							color='primary'
							isLight
							icon='HolidayVillage'
							tag='a'
							href='/'>
							{myStore.test}
						</Button>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default RssDashboard;
