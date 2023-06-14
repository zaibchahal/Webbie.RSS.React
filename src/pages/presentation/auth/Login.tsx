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
import { getCookie, setCookie, coerceToArrayBuffer, coerceToBase64Url } from '../../../common/RssData/helper';
import { AppConst, authUrls } from '../../../common/RssData/constants';
import USERS from '../../../common/RssData/userSessionService';
import { useToasts } from 'react-toast-notifications';
import Toasts from '../../../components/bootstrap/Toasts';
import { useDispatch } from 'react-redux';
import { UpdateSession } from '../../../@features/Authentication/auth.slice';
import api from '../../../services/baseService';

interface ILoginHeaderProps {
    isNewUser?: boolean;
}
const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) => {
    if (isNewUser) {
        return (
            <>
                <div className='text-center h1 fw-bold mt-5'>Select Tenant</div>
                <div className='text-center h4 text-muted mb-5'>Select Your Tenant to get started!</div>
            </>
        );
    } else {
        return (
            <>
                <div className='text-center h1 fw-bold mt-5'>Welcome,</div>
                <div className='text-center h4 text-muted mb-5'>Sign in to continue!</div>
            </>
        );
    }
};

interface ILoginProps {
    isSignUp?: boolean;
}
const Login: FC<ILoginProps> = ({ isSignUp }) => {
    const { handleSetSession, handleSetProfileData } = useContext(AuthContext);
    const { darkModeStatus } = useDarkMode();
    const { addToast } = useToasts();
    const [signInPassword, setSignInPassword] = useState<boolean>(false);
    const [tenantStatus, setTenantStatus] = useState<boolean>(!!isSignUp);
    const [tenantName, setTenantName] = useState('');
    const [invalidFeedback, setinvalidFeedback] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        const tenantIdFromCookie = getCookie(AppConst.TenantID);
        const tenantNameFromCookie = getCookie(AppConst.TenantName);
        if (parseInt(tenantIdFromCookie) > 0) {
            setTenantName(tenantNameFromCookie);
        } else {
            setTenantStatus(true);
        }
    }, []);

    const showErrorAlert = useCallback((msg: any, e: any) => {
        let footermsg = '';
        if (e) { footermsg = e.toString(); }
        addToast(
            <Toasts title={msg} icon='Error' iconColor='danger' > {footermsg} </Toasts>,
            { autoDismiss: true, },
        )
    }, [addToast])

    const checkTenantAvailability = useCallback(async (tenancyName: string) => {
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
            } else {
                showErrorAlert("Not Found", "No tenant found for this name")
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }, [showErrorAlert]);


    const SubmitLoginForm = async (values: any) => {
        setinvalidFeedback('');
        setIsLoading(true);
        try {
            const response = await api.post(
                authUrls.TokenAuth_Authenticate,
                {
                    userNameOrEmailAddress: values.loginuserName,
                    password: values.loginPassword,
                    rememberClient: true,
                },
            );

            const data = await response.data;

            if (data.success) {
                await MakeCredentialOptions(data.result.accessToken)
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
    }, [tenantName, checkTenantAvailability]);

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
        StartFidoAuthentitcation();
    };

    const handleAddDeviceFido = () => {
        setSignInPassword(true);
    };


    //#region Register Credentials

    async function MakeCredentialOptions(accToken: string) {
        // send to server for registering
        let makeCredentialOptions;
        setIsLoading(true);
        try {
            const response = await axios.post(authUrls.MakeCredentialOptions, {}, {
                headers: {
                    Accept: 'text/plain',
                    "Abp.TenantId": getCookie(AppConst.TenantID),
                    "Content-Type": 'application/json-patch+json',
                    "X-XSRF-TOKEN": 'null',
                    Authorization: `Bearer ${accToken}`,
                }
            });

            const data = await response.data;

            makeCredentialOptions = JSON.parse(data.result.options);
            if (makeCredentialOptions.status !== "ok") {
                console.log("Error creating credential options");
                return;
            }
            createNewCredentialon(makeCredentialOptions, data.result.token);

        } catch (error: any) {
            console.log(error);
            if (error.response) setinvalidFeedback(error.response.data.error.message);
            else setinvalidFeedback(error.code + '  ' + error.message);
        }
    }

    async function createNewCredentialon(makeCredentialOptions: any, token: any) {
        makeCredentialOptions.extensions.credProps = true;
        makeCredentialOptions.challenge = coerceToArrayBuffer(makeCredentialOptions.challenge);
        makeCredentialOptions.user.id = coerceToArrayBuffer(makeCredentialOptions.user.id);
        makeCredentialOptions.excludeCredentials = makeCredentialOptions.excludeCredentials.map((c: any) => {
            c.id = coerceToArrayBuffer(c.id);
            return c;
        });

        if (makeCredentialOptions.authenticatorSelection.authenticatorAttachment === null) makeCredentialOptions.authenticatorSelection.authenticatorAttachment = undefined;

        let newCredential;
        try {
            newCredential = await navigator.credentials.create({
                publicKey: makeCredentialOptions
            });
        } catch (e) {
            showErrorAlert("Unable to create new Credentials", e);
            setIsLoading(false);
        } finally {
        }

        registerNewCredential(newCredential, token);
    }

    async function registerNewCredential(newCredential: any, token: any) {
        // Move data into Arrays incase it is super long
        let attestationObject = new Uint8Array(newCredential.response.attestationObject);
        let clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
        let rawId = new Uint8Array(newCredential.rawId);

        const data = {
            id: newCredential.id,
            rawId: coerceToBase64Url(rawId),
            type: newCredential.type,
            extensions: newCredential.getClientExtensionResults(),
            response: {
                AttestationObject: coerceToBase64Url(attestationObject),
                clientDataJSON: coerceToBase64Url(clientDataJSON)
            }
        };

        const response = await api.post(authUrls.MakeCredential + '?jdata=' + JSON.stringify(data) + '&token=' + token, {});
        const res = await response.data.result;

        if (res.status !== "ok") {
            showErrorAlert(res.errorMessage, null);
            return;
        } else {
            setSignInPassword(false);
        }
        setIsLoading(false);
    }


    //#endregion


    //#region Login By Credentials
    async function StartFidoAuthentitcation() {
        setIsLoading(true);
        const response = await api.post(authUrls.AssertionOptionsPost + "?username=" + formik.values.loginuserName, {});
        var result = await response.data.result;

        // show options error to user
        if (!result.options) {
            showErrorAlert(result.errorMessage, "Error creating assertion options");
            setIsLoading(false);
            return;
        }
        const makeAssertionOptions = JSON.parse(result.options);
        makeAssertionOptions.challenge = coerceToArrayBuffer(makeAssertionOptions.challenge);
        // fix escaping. Change this to coerce
        makeAssertionOptions.allowCredentials.forEach(function (listItem: any) {
            listItem.id = coerceToArrayBuffer(listItem.id);
        });

        // ask browser for credentials (browser will ask connected authenticators)
        let credential;
        try {
            credential = await navigator.credentials.get({ publicKey: makeAssertionOptions })
        } catch (err: any) {
            showErrorAlert("Error Creating Credentials", err.message ? err.message : err);
            setIsLoading(false);
            return;
        } finally {
        }
        verifyAssertionWithServer(credential, result.token);
    }


    async function verifyAssertionWithServer(assertedCredential: any, token: string) {
        try {

            // Move data into Arrays incase it is super long
            let authData = new Uint8Array(assertedCredential.response.authenticatorData);
            let clientDataJSON = new Uint8Array(assertedCredential.response.clientDataJSON);
            let rawId = new Uint8Array(assertedCredential.rawId);
            let sig = new Uint8Array(assertedCredential.response.signature);
            const data = {
                id: assertedCredential.id,
                rawId: coerceToBase64Url(rawId),
                type: assertedCredential.type,
                extensions: assertedCredential.getClientExtensionResults(),
                response: {
                    authenticatorData: coerceToBase64Url(authData),
                    clientDataJSON: coerceToBase64Url(clientDataJSON),
                    signature: coerceToBase64Url(sig)
                }
            };


            const response = await api.post(authUrls.AuthenticateFido + "?jdata=" + JSON.stringify(data) + '&token=' + token, {});

            const res = await response.data;
            if (res.success) {
                if (handleSetSession) {
                    handleSetSession(res.result, dispatch);
                }
                if (handleSetProfileData) {
                    handleSetProfileData(res.result.accessToken, dispatch);
                }
                console.log("login successfull", res.result);
                navigate('/');
            } else {
                showErrorAlert("Request to server failed", res.error);
                setIsLoading(false);
            }
        } catch (err) {
            showErrorAlert("Log In Failed", err);
        }
    }

    //#endregion

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
                                {!tenantStatus && false && (
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
                                                        Verify & Add
                                                    </Button>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* BEGIN :: Social Login */}
                                    {!signInPassword && !tenantStatus && (
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
                                                    icon='Lock'
                                                    isDisable={!formik.values.loginuserName}
                                                    onClick={handleAddDeviceFido}>
                                                    Add account on this device
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
