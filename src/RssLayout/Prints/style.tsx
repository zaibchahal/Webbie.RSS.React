
export const style =
    `

@page {
    size: auto;
    margin: 0mm;
}

#printablediv {
    /*display: none*/
}

.rpt-container {
    border: 1px dashed;
    padding: 2px
}

.setReceiptWidth {
    width: 6.1cm;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    border: none;
    margin: 0mm;
    font-size: 11px;
    font-weight: normal;
    padding-left: 5mm;
}

.logo {
    width: 100px;
    margin: 5px auto;
    display: block
}

.h2Style {
    font-size: 1.5em !important;
    margin: 0;
}

.h3Style {
    font-size: 1.17em !important;
    margin: 0;
}

.h5Style {
    font-size: 0.83em !important;
    font-weight: normal;
    margin: 0;
}

.h4Style {
    font-size: 11px !important;
    font-weight: normal;
    margin: 0;
}

.rpt-card {
    text-align: center;
    background: rgba(218, 232, 239, 0.18);
    padding: 5px 5px;
}

.rpt-block {
    border: 1px dashed;
    margin: 10px 5px
}

th, td {
    padding: 2px;
    font-size: 10px;
}

.t-left {
    text-align: left;
}

.t-right {
    text-align: right;
}
.t-center {
    text-align: center;
}

.fs-tid {
    font-size: 13px;
    font-weight: 700;
}

.double-line {
    border-top: 1.5px dashed;
    width: 100%;
    border-bottom: 1.5px dashed;
    padding: 1px;
}

.rpt-table {
    width: 100%
}

.rpt-footer-imgs {
    display: flex;
}

.rpt-img {
    width: 100%;
}

.borderedtr td,.borderedtr th{
    border-bottom:1px dashed
}

`;
