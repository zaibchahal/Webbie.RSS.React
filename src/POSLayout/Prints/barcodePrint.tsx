import { style } from '../../RssLayout/Prints/style';
import { barcodestyle } from './barcodestyle';
import React from 'react';
import { AppConst, BASE_URL } from '../../common/RssData/constants';
import dayjs from 'dayjs';
import NumberFormatter from '../../common/RssData/formster';
import { IProductProps } from '../../services/POS/productService';
import Barcode from "react-barcode";
const BarcodePrint = ({ data }: { data: IProductProps[] }) => {
    return (
        <div id="printablediv">
            <html>
                <head>
                    <style> {style}</style>
                    <style> {barcodestyle}</style>
                </head>
                <body>
                    <>
                        {data.map((d, i) => {
                            const elements = [];

                            for (var j = 0; j < (d.balance || 0); j++) {

                                elements.push(
                                    <div className="S25-50 sPrint" key={j}>
                                        <div className="name">
                                            <span>{d.name} {d.balance}</span>
                                        </div>
                                        <div className="barcode">
                                            <Barcode height={25} width={2} displayValue={false} value={d.barcode} format="CODE128" />
                                            <div className="code">
                                                <span>{d.barcode}</span>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="price">
                                                <span>
                                                    <b>Rs. {d.salePrice}</b>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return elements;
                        })
                        }
                    </>

                </body>
            </html>
        </div>
    );
};

export default BarcodePrint;
