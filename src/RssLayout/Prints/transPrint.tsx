import { style } from './style';
import React from 'react';
import { AppConst, BASE_URL } from '../../common/RssData/constants';
import { IAccTransactionProps } from '../../services/accTransactionService';
import dayjs from 'dayjs';
import NumberFormatter from '../../common/RssData/formster';
import Image from '../../assets/rss/code.jpeg';



export const showPrint = (notClose?: boolean) => {
    if (typeof document !== 'undefined') {
        let printContents = document.getElementById('printablediv');
        if (printContents) {
            var mywindow = window.open('', 'PRINT', 'height=1200,width=800');
            if (mywindow) {
                mywindow.document.write(printContents.innerHTML);
                mywindow.document.close();
                mywindow.onload = function () {
                    if (mywindow) {
                        mywindow.focus();
                        mywindow.print();
                        if (!notClose)
                            mywindow.close();
                    }
                };
            }
        }
    }
};

const TransPrint = ({ data }: { data: IAccTransactionProps }) => {
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
                                </div>

                                <div className="rpt-block">
                                    <table className="rpt-table">
                                        <tr>
                                            <th className="t-left fs-tid" >TID :</th>
                                            <td className="t-right fs-tid">{data.tid}</td>
                                        </tr>
                                        <tr>
                                            <td className="t-left">Number :</td>
                                            <td className="t-right">{data.number}</td>
                                        </tr>
                                        <tr>
                                            <td className="t-left">Amount :</td>
                                            <td className="t-right">Rs. {NumberFormatter(data.amount)} </td>
                                        </tr>
                                        <tr>
                                            <td className="t-left">Commission :</td>
                                            <td className="t-right">Rs. {NumberFormatter(data.comm)}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div className="rpt-footer-imgs">
                                    <img className="rpt-img" src={Image} />
                                </div>
                                <div className="double-line"></div>
                                <div className="rpt-card">
                                    <h4 className="h4Style"> This is your Official Receipt </h4>
                                    <h4 className="h4Style"> <strong>Thank you come again</strong> </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        </div>
    );
};

export default TransPrint;
