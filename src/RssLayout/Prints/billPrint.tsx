import { style } from './style';
import React from 'react';
import { AppConst, BASE_URL } from '../../common/RssData/constants';
import dayjs from 'dayjs';
import NumberFormatter from '../../common/RssData/formster';
import Image from '../../assets/rss/code.jpeg';
import { IBillPaymentProps } from '../../services/billPaymentService';

const BillPaymentPrint = ({ data }: { data: IBillPaymentProps }) => {
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
                                            <strong>Date: </strong> {dayjs(data.creationTime).format(AppConst.Formats.dateTime)}
                                        </h4>
                                        <h4 className="h4Style t-left">
                                            <strong>Received: </strong>Rs. {NumberFormatter(data.cashReceived)}
                                        </h4>
                                        <h4 className="h4Style t-left">
                                            <strong>Returned: </strong>Rs. {NumberFormatter(data.cashReturn)}
                                        </h4>
                                    </div>
                                    {data.detail.map((d, i) => {
                                        return (
                                            <div className="rpt-block" key={i}>
                                                <table className="rpt-table">
                                                    <tr><th className="t-center" colSpan={2}>{d.billType}</th></tr>
                                                    <tr>
                                                        <th className="t-left fs-tid" >Ref No :</th>
                                                        <td className="t-right fs-tid">{d.refNo}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="t-left">Last Date :</td>
                                                        <td className="t-right">{dayjs(d.billLastDate).format(AppConst.Formats.date)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="t-left">Amount :</td>
                                                        <td className="t-right">Rs. {NumberFormatter(d.billAmount)} </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="t-left">Fees :</td>
                                                        <td className="t-right">Rs. {NumberFormatter(d.fees)}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        )
                                    })
                                    }

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

export default BillPaymentPrint;
