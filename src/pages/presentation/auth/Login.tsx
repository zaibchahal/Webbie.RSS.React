import React, { FC, useCallback, useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Logo from '../../../components/Logo';
import useDarkMode from '../../../hooks/useDarkMode';
import { useFormik } from 'formik';
import AuthContext from '../../../contexts/authContext';
import Spinner from '../../../components/bootstrap/Spinner';
import Alert from '../../../components/bootstrap/Alert';
import axios from 'axios';
import { getCookie, setCookie } from '../../../common/RssData/helper';
import { AppConst, authUrls } from '../../../common/RssData/constants';
import USERS from '../../../common/RssData/userSessionService';

interface ILoginHeaderProps {
	isNewUser?: boolean;
}
const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) => {
	if (isNewUser) {
		return (
			<>
				<div className='text-center h1 fw-bold mt-5'>Create Account,</div>
				<div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
			</>
		);
	}
	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Welcome,</div>
			<div className='text-center h4 text-muted mb-5'>Sign in to continue!</div>
		</>
	);
};

interface ILoginProps {
	isSignUp?: boolean;
}
const Login: FC<ILoginProps> = ({ isSignUp }) => {
	const { handleSetSession, handleSetProfileData } = useContext(AuthContext);

	const { darkModeStatus } = useDarkMode();

	const [signInPassword, setSignInPassword] = useState<boolean>(false);
	const [tenantChangeError, settenantChangeError] = useState<boolean>(false);
	const [tenantStatus, setTenantStatus] = useState<boolean>(!!isSignUp);
	const [tenantName, setTenantName] = useState('');
	const [invalidFeedback, setinvalidFeedback] = useState('');

	const navigate = useNavigate();
	const handleOnClick = useCallback(() => navigate('/'), [navigate]);
	useEffect(() => {
		const tenantIdFromCookie = getCookie(AppConst.TenantID);
		const tenantNameFromCookie = getCookie(AppConst.TenantName);
		if (parseInt(tenantIdFromCookie) > 0) {
			setTenantName(tenantNameFromCookie);
		} else {
			setTenantStatus(true);
		}
	}, []);

	const checkTenantAvailability = async (tenancyName: string) => {
		setIsLoading(true);
		try {
			const response = await axios.post(
				authUrls.IsTenantAvailable,
				{ tenancyName: tenancyName },
				{
					headers: {
						Accept: 'text/plain',
						'Content-Type': 'application/json-patch+json',
						'X-XSRF-TOKEN': 'null',
					},
					withCredentials: true,
				},
			);

			const data = await response.data;

			if (data.success && data.result.state == 1) {
				console.log('Tenant is available');
				setCookie(AppConst.TenantID, data.result.tenantId, 3000);
				setCookie(AppConst.TenantName, tenancyName, 3000);
				setSignInPassword(false);
				setTenantStatus(false);
				settenantChangeError(false);
			} else {
				console.log('Tenant is not available');
				settenantChangeError(true);
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};

	const SubmitLoginForm = async (values: any) => {
		setinvalidFeedback('');
		setIsLoading(true);
		try {
			const response = await axios.post(
				authUrls.TokenAuth_Authenticate,
				{
					userNameOrEmailAddress: values.loginuserName,
					password: values.loginPassword,
					rememberClient: true,
				},
				{
					headers: {
						Accept: 'text/plain',
						'Abp.TenantId': getCookie(AppConst.TenantID),
						'Content-Type': 'application/json-patch+json',
						'X-XSRF-TOKEN': 'null',
					},
					withCredentials: true,
				},
			);

			const data = await response.data;

			if (data.success) {
				if (handleSetSession) {
					handleSetSession(data.result);
				}
				if (handleSetProfileData) {
					handleSetProfileData(data.result.accessToken);
				}
				handleOnClick();
			} else {
				formik.setFieldError('loginPassword', data.error.message);
			}
		} catch (error: any) {
			console.log(error);
			if (error.response) setinvalidFeedback(error.response.data.error.message);
			else setinvalidFeedback(error.code + '  ' + error.message);
		}
		setIsLoading(false);
	};

	const handleOnChangeTenant = useCallback(() => {
		checkTenantAvailability(tenantName);
	}, [tenantName]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTenantName(e.target.value);
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			loginuserName: USERS.GRACE.userName,
			loginPassword: USERS.GRACE.password,
		},
		validate: (values) => {
			const errors: { loginuserName?: string; loginPassword?: string } = {};

			if (!values.loginuserName) {
				errors.loginuserName = 'Required';
			}

			if (!values.loginPassword) {
				errors.loginPassword = 'Required';
			}

			return errors;
		},
		validateOnChange: false,
		onSubmit: (values) => {
			SubmitLoginForm(values);
		},
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const handleContinue = () => {
		setSignInPassword(true);
	};

	return (
		<PageWrapper
			isProtected={false}
			title={tenantStatus ? 'Tenant' : 'Login'}
			className={classNames({ 'bg-dark': !tenantStatus, 'bg-light': tenantStatus })}>
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-5'>
									<Link
										to='/'
										className={classNames(
											'text-decoration-none  fw-bold display-2',
											{
												'text-dark': !darkModeStatus,
												'text-light': darkModeStatus,
											},
										)}>
										<Logo width={200} />
									</Link>
								</div>
								<div
									className={classNames('rounded-3', {
										'bg-l10-dark': !darkModeStatus,
										'bg-dark': darkModeStatus,
									})}>
									<div className='row row-cols-2 g-3 pb-3 px-3 mt-0'>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={tenantStatus}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setSignInPassword(false);
													setTenantStatus(false);
												}}>
												Login
											</Button>
										</div>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={!tenantStatus}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setSignInPassword(false);
													setTenantStatus(true);
												}}>
												Tenant ({tenantName})
											</Button>
										</div>
									</div>
								</div>

								<LoginHeader isNewUser={tenantStatus} />
								{!tenantStatus && (
									<>
										<Alert isLight icon='Lock' isDismissible>
											<div className='row'>
												<div className='col-12'>
													<strong>userName:</strong> {USERS.JOHN.userName}
												</div>
												<div className='col-12'>
													<strong>Password:</strong> {USERS.JOHN.password}
												</div>
											</div>
										</Alert>
									</>
								)}
								{tenantChangeError && (
									<>
										<Alert isLight color='danger' icon='Error' isDismissible>
											<div className='row'>
												<div className='col-12'>
													<strong>Not Found:</strong> Tenant not found for
													"{tenantName}"
												</div>
											</div>
										</Alert>
									</>
								)}
								<form className='row g-4'>
									{tenantStatus ? (
										<>
											<div className='col-12'>
												<FormGroup
													id='tenancyName'
													isFloating
													label='Your tenant'>
													<Input
														onChange={handleInputChange}
														value={tenantName}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<Button
													color='info'
													className='w-100 py-3'
													onClick={handleOnChangeTenant}>
													{isLoading && (
														<Spinner isSmall inButton isGrow />
													)}
													Change Tenant
												</Button>
											</div>
										</>
									) : (
										<>
											<div className='col-12'>
												<FormGroup
													id='loginuserName'
													isFloating
													label='Your email or userName'
													className={classNames({
														'd-none': signInPassword,
													})}>
													<Input
														autoComplete='userName'
														value={formik.values.loginuserName}
														isTouched={formik.touched.loginuserName}
														invalidFeedback={
															formik.errors.loginuserName
														}
														isValid={formik.isValid}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														onFocus={() => {
															formik.setErrors({});
														}}
													/>
												</FormGroup>
												{signInPassword && (
													<div className='text-center h4 mb-3 fw-bold'>
														Hi, {formik.values.loginuserName}.
													</div>
												)}
												<FormGroup
													id='loginPassword'
													isFloating
													label='Password'
													className={classNames({
														'd-none': !signInPassword,
													})}>
													<Input
														type='password'
														autoComplete='current-password'
														value={formik.values.loginPassword}
														isTouched={formik.touched.loginPassword}
														invalidFeedback={''}
														validFeedback='Looks good!'
														isValid={formik.isValid}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
													/>
												</FormGroup>
												<div className='text-danger'>{invalidFeedback}</div>
											</div>
											<div className='col-12'>
												{!signInPassword ? (
													<Button
														color='warning'
														className='w-100 py-3'
														isDisable={!formik.values.loginuserName}
														onClick={handleContinue}>
														{isLoading && (
															<Spinner isSmall inButton isGrow />
														)}
														Continue
													</Button>
												) : (
													<Button
														color='warning'
														className='w-100 py-3'
														onClick={formik.handleSubmit}>
														{isLoading && (
															<Spinner isSmall inButton isGrow />
														)}
														Login
													</Button>
												)}
											</div>
										</>
									)}

									{/* BEGIN :: Social Login */}
									{!signInPassword && (
										<>
											<div className='col-12 mt-3 text-center text-muted'>
												OR
											</div>
											<div className='col-12 mt-3'>
												<Button
													isOutline
													color={darkModeStatus ? 'light' : 'dark'}
													className={classNames('w-100 py-3', {
														'border-light': !darkModeStatus,
														'border-dark': darkModeStatus,
													})}
													icon='CustomApple'
													onClick={handleOnClick}>
													Sign in with Apple
												</Button>
											</div>
											<div className='col-12'>
												<Button
													isOutline
													color={darkModeStatus ? 'light' : 'dark'}
													className={classNames('w-100 py-3', {
														'border-light': !darkModeStatus,
														'border-dark': darkModeStatus,
													})}
													icon='CustomGoogle'
													onClick={handleOnClick}>
													Continue with Google
												</Button>
											</div>
										</>
									)}
									{/* END :: Social Login */}
								</form>
							</CardBody>
						</Card>
						<div className='text-center'>
							<a
								href='/'
								className={classNames('text-decoration-none me-3', {
									'link-light': tenantStatus,
									'link-dark': !tenantStatus,
								})}>
								Privacy policy
							</a>
							<a
								href='/'
								className={classNames('link-light text-decoration-none', {
									'link-light': tenantStatus,
									'link-dark': !tenantStatus,
								})}>
								Terms of use
							</a>
						</div>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
Login.propTypes = {
	isSignUp: PropTypes.bool,
};
Login.defaultProps = {
	isSignUp: false,
};

export default Login;
