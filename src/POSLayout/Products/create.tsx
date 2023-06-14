import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Card, { CardActions, CardBody, CardFooter, CardFooterLeft, CardFooterRight, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState, store } from '../../store';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Label from '../../components/bootstrap/forms/Label';
import Button from '../../components/bootstrap/Button';
import Spinner from '../../components/bootstrap/Spinner';
import { IFileProp, uploadFile } from '../../services/filehelperService';
import { AppConst, BASE_URL } from '../../common/RssData/constants';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import { creatUpdateProduct, get, IProductProps } from '../../services/POS/productService';
import Select from '../../components/bootstrap/forms/Select';
import { productTypes } from '../../common/PosData/constants';
import Textarea from '../../components/bootstrap/forms/Textarea';
import { Checkbox } from '../../stories/components/bootstrap/forms/Checks.stories';

const CreateBank = () => {
    const { id } = useParams();
    const ProductsSlice = useSelector((state: RootState) => state.Products);
    const brands = ProductsSlice.Brands;
    const categories = ProductsSlice.Categories;

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [product, setProduct] = useState<IProductProps>({ id: id || 0, name: '', } as IProductProps);


    useEffect(() => {
        const fetchData = async () => {
            if (id && parseInt(id) > 0) {
                let b = await get(parseInt(id));
                setProduct(b);
            }
        };
        fetchData();
    }, [id]);

    const handleImageChange = async (e: any) => {
        setIsLoading(true);
        const file = e.target.files[0];
        const pic = await uploadFile({ file: file, prevFile: formik.values.pic, subFolder: AppConst.SubFolders.Product } as IFileProp);
        formik.setFieldValue('pic', pic);
        setIsLoading(false);
    };
    const handleSubmitForm = async (values: IProductProps) => {
        setIsSaving(true);
        await creatUpdateProduct(values);
        navigate('/product-definition');
    };

    const formik = useFormik({
        initialValues: product,
        enableReinitialize: true,
        validate: (values) => {
            const errors: Partial<IProductProps> = {};
            if (!values.name) {
                errors.name = 'Name is required';
            }
            return errors;
        },
        onSubmit: (values) => {
            try { values.hideInShop = (values.hideInShop as any).indexOf('on') >= 0 ? true : false; } catch { }
            handleSubmitForm(values);
        },
    });


    return (
        <PageWrapper title='Create Product'>
            <SubHeader>
                <SubHeaderLeft>
                    <Breadcrumb
                        list={[
                            { title: 'Product List', to: '/product-definition' },
                            { title: 'Create New', to: '/product/create/' },
                        ]}
                    />
                </SubHeaderLeft>
            </SubHeader>
            <Page>
                <div className='row'>
                    <div className='col-12 mb-4'>
                        <Card stretch tag='form' onSubmit={formik.handleSubmit}>
                            <CardHeader>
                                <CardLabel icon='DriveFileRename'>
                                    <CardTitle>Define Product</CardTitle>
                                </CardLabel>
                                <CardActions> </CardActions>
                            </CardHeader>
                            <CardBody>
                                <div className='row mb-4 g-4'>
                                    <div className='col-4'>
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
                                    <div className='col-4'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Product Code</Label>
                                            <Input
                                                id='barcode'
                                                placeholder='Code'
                                                onChange={formik.handleChange}
                                                value={formik.values.barcode}
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.barcode}
                                                invalidFeedback={formik.errors.barcode}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className='col-4'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Product Type</Label>
                                            <Select
                                                id='type' placeholder='-- Select --' list={productTypes} ariaLabel='' className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.type}
                                                isValid={formik.isValid} />
                                        </FormGroup>
                                    </div>
                                    <div className='col-4'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Cost Price</Label>
                                            <Input
                                                id='costPrice'
                                                type='number'
                                                placeholder='Cost Price'
                                                onChange={formik.handleChange}
                                                value={formik.values.costPrice}
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.costPrice}
                                                invalidFeedback={formik.errors.costPrice}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className='col-4'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Sale Price</Label>
                                            <Input
                                                id='salePrice'
                                                placeholder='Sale Price'
                                                type='number'
                                                onChange={formik.handleChange}
                                                value={formik.values.salePrice}
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.salePrice}
                                                invalidFeedback={formik.errors.salePrice}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className='col-4'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Min. Inventory Level</Label>
                                            <Input
                                                id='minInvLevel'
                                                type='number'
                                                onChange={formik.handleChange}
                                                value={formik.values.minInvLevel}
                                                isValid={formik.isValid}
                                                isTouched={formik.touched.minInvLevel}
                                                invalidFeedback={formik.errors.minInvLevel}
                                            />
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className='row g-4 mb-4'>
                                    <div className='col-4'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Brand</Label>
                                            <Select
                                                id='brandID' placeholder='-- Select --' list={brands.map((b) => ({
                                                    value: b.id,
                                                    label: b.name,
                                                }))} ariaLabel='' className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.brandID?.toString()}
                                                isValid={formik.isValid} />
                                        </FormGroup>
                                    </div>
                                    <div className='col-4'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Category</Label>
                                            <Select
                                                id='catID' placeholder='-- Select --' list={categories.filter(x => !x.parentCatID).map((b) => ({
                                                    value: b.id,
                                                    label: b.name,
                                                }))} ariaLabel='' className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.catID?.toString()}
                                                isValid={formik.isValid} />
                                        </FormGroup>
                                    </div>
                                    <div className='col-4'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Sub-Category</Label>
                                            <Select
                                                id='subCatID' placeholder='-- Select --' list={categories.filter(x => x.parentCatID == formik.values.catID).map((b) => ({
                                                    value: b.id,
                                                    label: b.name,
                                                }))} ariaLabel='' className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.subCatID?.toString()}
                                                isValid={formik.isValid} />
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className='row g-4'>
                                    <div className='col-6'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Notes</Label>
                                            <Textarea id='notes' className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.notes}
                                                isValid={formik.isValid} />
                                        </FormGroup>
                                    </div>
                                    <div className='col-6'>
                                        <FormGroup>
                                            <Label htmlFor='name'>Invoice Notes</Label>
                                            <Textarea id='invNotes' className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.invNotes}
                                                isValid={formik.isValid} />
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className='row g-4'>
                                    <div className='col-4'>
                                        <Input id='pic' type='hidden' onChange={formik.handleChange} value={formik.values.pic} />
                                        <FormGroup>
                                            <Label htmlFor='name'>Image</Label>
                                            <Input
                                                id='name'
                                                type='file'
                                                accept='image/*'
                                                ariaDescribedby='addon1'
                                                onChange={handleImageChange}
                                            />
                                        </FormGroup>

                                        {isLoading ? (
                                            <Spinner size='3rem' inButton isGrow />
                                        ) :
                                            (<img src={BASE_URL + formik.values.pic} style={{ height: 200 }} className='img-thumbnail' ></img>)
                                        }
                                    </div>
                                    <div className='col-4'>
                                        <FormGroup className="mt-4">
                                            <Label htmlFor='hideInShop' className="fs-3">
                                                <input type="checkbox" id='hideInShop' style={{ height: 20, width: 20 }}
                                                    onChange={formik.handleChange}
                                                    defaultChecked={formik.values.hideInShop}
                                                /> Hide In Shop
                                            </Label>
                                        </FormGroup>
                                    </div>
                                </div>
                            </CardBody>
                            <CardFooter>
                                <CardFooterLeft>
                                    <Button
                                        type='reset'
                                        color='info'
                                        isOutline
                                        onClick={() => navigate('/product-definition')}>
                                        Back To List
                                    </Button>
                                </CardFooterLeft>
                                <CardFooterRight>
                                    <Button
                                        type='submit'
                                        color='info'
                                        onClick={() => { }}>
                                        {isSaving && (
                                            <Spinner isSmall inButton isGrow />
                                        )}
                                        {formik.values.id > 0 ? 'Update' : 'Save'}
                                    </Button>
                                </CardFooterRight>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </Page>
        </PageWrapper>
    );
};

export default CreateBank;

function useParam(): { id: any; } {
    throw new Error('Function not implemented.');
}
