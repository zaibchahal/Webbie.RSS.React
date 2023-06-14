
export const barcodestyle =
    `
        .S25-50 {
            height: 1in !important;
            max-height: 1in !important;
            min-height: 1in !important;
            width: 2in !important;
            max-width: 2in !important;
            min-width: 2in !important;
        }

        .S38-58 {
            height: 1.5938in !important;
            max-height: 1.5938in !important;
            min-height: 1.5938in !important;
            width: 2.25in !important;
            max-width: 2.25in !important;
            min-width: 2.25in !important;
        }

        .S38-28 {
            height: 1in !important;
            max-height: 1in !important;
            min-height: 1in !important;
            width: 1.5in !important;
            max-width: 1.5in !important;
            min-width: 1.5in !important;
        }


        .sPrint span {
            font-size: 12px;
            line-height: 10px;
            font-family: monospace;
        }

        .sPrint {
            background-color: #ffffff;
            text-align: center;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            overflow:hidden;
        }


            .sPrint .barcode {
                display: grid;
                place-items: center;
                text-align: center;
                margin-bottom: 5px;
            }

            .sPrint .price {
                margin-right: 5px;
                border: 1px solid;
                padding: 5px;
                height: fit-content;
                float: right;
                font-family: Digital-7,DS-Digital,monospace
            }
            .sPrint .price span {
                font-family: Digital-7,DS-Digital,monospace
            }

            .sPrint .date {
                height: fit-content;
                float: left;
            }

        .printDiv {
            background-color: #e9e9e9;
        }

        .sPrint object, .sPrint svg {
            display: block;
            /*margin: 5px auto 0px auto;*/
            /*height: 25px;*/
            /*width: 80%;  */
        }

        body {
            margin: 0px
        }


        dl {
            width: 90px;
            overflow: hidden;
            padding: 0;
            margin: 0;
            font-size: 10px;
            font-weight: 600;
            font-family: monospace
        }

        dt {
            float: left;
            width: 30%;
            padding: 0;
            margin: 0
        }

        dd {
            float: left;
            width: 70%;
            padding: 0;
            margin: 0
        }

        .S38-58 span {
            font-size: 18px;
            line-height: 14px;
            font-family: monospace;
        }


        .S38-58 .price span {
            font-size: 35px;
            line-height: 30px;
        }

        .hidePrice .price {
            display: none;
        }

        .S38-28 .price {
            margin-right: 2px;
            padding: 2px;
        }

        .S38-28 dl {
            width: 85px;
            font-size: 9px;
        }
`;
