import { style } from '../../RssLayout/Prints/style';
import React from 'react';
import { AppConst, BASE_URL } from '../../common/RssData/constants';
import dayjs from 'dayjs';
import NumberFormatter from '../../common/RssData/formster';
import Image from '../../assets/rss/code.jpeg';
import { ISaleProps } from '../../services/POS/posService';

const POSPrint = ({ data }: { data: ISaleProps }) => {
    return (
        <div id="printablediv">
            <html>
                <head>
                    <style> {style}</style>
                </head>
                <body>
                    <div id="SaleInvoice3Inch" style={{ width: 'auto' }}>
                        <div className="setReceiptWidth" >
                            <div className="rpt-container">
                                <>

                                    <img className="logo" src={BASE_URL + '/Common/Images/app-logo-on-light.svg'} />

                                    <div className="rpt-card"  >
                                        <h3 className="h3Style" > Sultan Brothers Trading </h3>
                                        <h4 className="h4Style" > Model Town, Gujranwala, Punjab </h4>
                                    </div>

                                    <div style={{ textAlign: 'center', background: 'rgb(200, 224, 235)', padding: '6px 6px' }} >
                                        <h2 className="h2Style" >
                                            Receipt
                                        </h2>
                                    </div>


                                    <div className="rpt-card" >
                                        <h4 className="h4Style t-left">
                                            <strong>Date: </strong> {dayjs(data.date).format(AppConst.Formats.dateTime)}
                                        </h4>
                                    </div>

                                    <div className="rpt-block">
                                        <table className="rpt-table">
                                            <thead className="bg-primary text-light fw-bolder">
                                                <tr className="borderedtr" >
                                                    <th>Sr.</th>
                                                    <th className="w-75 t-left">Name</th>
                                                    <th className="t-center w-25" >Qty</th>
                                                    <th className="t-center" >Amt</th>
                                                </tr>
                                            </thead>
                                            <tbody id="detailBody">
                                                {data.detail.map((d, i) => {
                                                    return (
                                                        <tr className="borderedtr" key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>{d?.productName}<br /><span>Code : {d.barcode}</span> | <b>Rs.{d.salePrice}</b> </td>
                                                            <td className="t-center" >{d.qty}</td>
                                                            <td className="t-center" > {(d.salePrice || 0) * (d.qty || 0)}</td>
                                                        </tr>
                                                    )
                                                })
                                                }

                                            </tbody>
                                            <tfoot>
                                                <tr className="fw-bolder">
                                                    <th></th>
                                                    <th className="t-left">Total</th>
                                                    <th className="t-center" >{data.detail?.reduce((total, i) => total + i.qty, 0)}</th>
                                                    <th className="t-center" >{data.detail?.reduce((total, i) => total + ((i.salePrice || 0) * (i.qty || 0)), 0)}</th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>

                                    <div className="rpt-footer-imgs">
                                        <img className="rpt-img" src={Image} />
                                    </div>
                                    <div className="double-line"></div>
                                    <div className="rpt-card">
                                        <h4 className="h4Style"> This is your Official Receipt </h4>
                                        <h4 className="h4Style"> <strong>Thank you come again</strong> </h4>
                                    </div>                                </>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        </div>
    );
};

export default POSPrint;
