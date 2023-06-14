import React, { useCallback, useEffect, useState } from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import { demoPagesMenu } from '../../menu';
import Card, { CardBody, CardHeader } from '../../components/bootstrap/Card';
import Icon from '../../components/icon/Icon';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { creatUpdateCategory, getList, ICategoryProps } from '../../services/POS/categoryService';
import { LoadCategories } from '../../@features/POS/products.slice';
import { AppConst, BASE_URL, CATEGORY_URLS } from '../../common/RssData/constants';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import { Delete } from '../../services/baseService';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../components/bootstrap/Modal';
import Button from '../../components/bootstrap/Button';
import Spinner from '../../components/bootstrap/Spinner';
import { Form, useFormik } from 'formik';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Label from '../../components/bootstrap/forms/Label';
import Input from '../../components/bootstrap/forms/Input';
import { IFileProp, uploadFile } from '../../services/filehelperService';
import { jzSwal } from '../../common/RssData/helper';
import Select from '../../components/bootstrap/forms/Select';
import { Category } from '../../components/icon/material-icons';

const ListCategory = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [Categorys, setCategorys] = useState<ICategoryProps[]>([]);
    const [state, setState] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitForm = async (values: ICategoryProps) => {
        setIsSaving(true);
        await creatUpdateCategory(values);
        fetchData();
        handleCloseModal();
    };
    //#region Edit


    const handleEdit = async (id: number) => {
        var data = Categorys.find((b) => b.id == id);
        if (data) {
            formik.setValues({
                ...formik.values,
                code: data.code,
                name: data.name,
                slug: data.slug,
                isActive: data.isActive,
                id: data.id,
                notes: data.notes,
                pic: data.pic,
            });
            console.log(data);
            handleOpenModal();
        } else
            jzSwal.error("Not Found");
    }
    //#endregion

    const handleImageChange = async (e: any) => {
        setIsLoading(true);
        const file = e.target.files[0];
        const pic = await uploadFile({ file: file, prevFile: formik.values.pic, subFolder: AppConst.SubFolders.Category } as IFileProp);
        formik.setFieldValue('pic', pic);
        setIsLoading(false);
    };
    const formik = useFormik({
        initialValues: { id: 0 } as ICategoryProps,
        enableReinitialize: true,
        validate: (values) => {
            const errors: Partial<ICategoryProps> = {};
            if (!values.name) {
                errors.name = 'Name is required';
            }
            return errors;
        },
        onSubmit: (values) => {
            handleSubmitForm(values);
        },
    });

    const handleOpenModal = async () => {
        setState(true);
    };

    const handleCloseModal = () => {
        formik.resetForm();
        setState(false);
        setIsSaving(false);
    }


    const fetchData = useCallback(async () => {
        let b = await getList();
        setCategorys(b || []);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        dispatch(LoadCategories(Categorys));
    }, [dispatch, Categorys]);

    const handleDelete = async (item: ICategoryProps) => {
        var f = await Delete(CATEGORY_URLS.Delete + '?id=' + item.id);
        if (f) setCategorys((b) => b.filter((c) => c.id !== item.id));
    };
    return (
        <PageWrapper title={demoPagesMenu.projectManagement.subMenu.list.text}>
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            { title: 'Manage Categorys', to: '/page-layouts' },
                        ]}
                    />
                </SubHeaderLeft>
            </SubHeader>
            <Page>
                <div className='row'>
                    <div className='col-8 mb-4'>
                        <div className='display-4 fw-bold py-3'>Categories List</div>
                    </div>
                    <div className='col-4 text-end py-4'>
                        <button className='btn btn-primary ' onClick={() => handleOpenModal()} > <Icon size='2x' icon='Add' ></Icon> Create New </button>
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
                                            <th> Parent </th>
                                            <th> Action </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {Categorys.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td><img src={BASE_URL + item.pic} style={{ height: 20 }} /></td>
                                                <td>{item.code}</td>
                                                <td>{item.name}</td>
                                                <td>{item.parentCatName}</td>
                                                <td>
                                                    <button onClick={() => handleEdit(item.id)} className="btn btn-outline-primary" > <Icon icon="Edit" ></Icon> </button>|
                                                    <button onClick={() => handleDelete(item)} className="btn btn-outline-danger" > <Icon icon="Delete" ></Icon> </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </div>
                    <Modal
                        isOpen={state}
                        setIsOpen={handleCloseModal}
                        titleId='exampleModalLabel'
                        isCentered={true}
                        size={'lg'}
                        fullScreen='sm'
                        isStaticBackdrop={true}
                        isAnimation={true}>
                        <ModalHeader setIsOpen={handleCloseModal}>
                            <ModalTitle id='exampleModalLabel'>Define Category</ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            <div className="container">
                                <div className="row g-4 mb-4">
                                    <div className='col-6'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Name</Label>
                                            <Input
                                                id='name'
                                                placeholder='Name'
                                                onChange={formik.handleChange}
                                                value={formik.values.name}
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.name}
                                                invalidFeedback={formik.errors.name}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className='col-6'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Code</Label>
                                            <Input
                                                id='code'
                                                placeholder='Code'
                                                onChange={formik.handleChange}
                                                value={formik.values.code}
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.code}
                                                invalidFeedback={formik.errors.code}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className='col-6'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Slug</Label>
                                            <Input
                                                id='slug'
                                                onChange={formik.handleChange}
                                                value={formik.values.slug}
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.slug}
                                                invalidFeedback={formik.errors.slug}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className='col-6'>
                                        <Input id='pic' type='hidden' onChange={formik.handleChange} value={formik.values.pic} />
                                        <FormGroup>
                                            <Label htmlFor='file'>Image</Label>
                                            <Input
                                                id='file'
                                                type='file'
                                                accept='image/*'
                                                ariaDescribedby='addon1'
                                                onChange={handleImageChange}
                                            />
                                        </FormGroup>

                                        {isLoading ? (
                                            <Spinner size='3rem' inButton isGrow />
                                        ) : formik.values.pic &&
                                        (<img src={BASE_URL + formik.values.pic} style={{ height: 200 }} className='img-thumbnail' ></img>)
                                        }
                                    </div>
                                    {(!(Categorys.find((b) => b.parentCatID == formik.values.id)) || formik.values.id == 0) &&
                                        (
                                            <div className='col-6'>
                                                <FormGroup>
                                                    <Label htmlFor='name'>Parent Category</Label>
                                                    <Select
                                                        id='parentCatID' placeholder='-- Select --' list={Categorys.filter(x => !(x.parentCatID > 0)).map((b) => ({
                                                            value: b.id.toString(),
                                                            label: b.name,
                                                        }))} ariaLabel='' className="form-control"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.parentCatID?.toString()}
                                                        isValid={formik.isValid} />
                                                </FormGroup>
                                            </div>
                                        )}
                                    <div className='col-12'>
                                        <FormGroup>
                                            <Label htmlFor='notes'>Description</Label>
                                            <Input
                                                id='notes'
                                                placeholder='Short Description ....'
                                                onChange={formik.handleChange}
                                                value={formik.values.notes}
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.notes}
                                                invalidFeedback={formik.errors.notes}
                                            />
                                        </FormGroup>
                                    </div>
                                </div>

                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color='info'
                                isOutline
                                className='border-0'
                                onClick={() => { handleCloseModal() }}>
                                Close
                            </Button>
                            <Button color='info' icon='Save' onClick={formik.handleSubmit} >
                                {isSaving && (
                                    <Spinner isSmall inButton isGrow />
                                )}
                                {formik.values.id > 0 ? ' Update' : ' Save'}
                            </Button>
                        </ModalFooter>
                    </Modal>

                </div>
            </Page>
        </PageWrapper>
    );
};

export default ListCategory;
