import { TColor } from "../../type/color-type";

export interface ITransTypeProp {
    id: number,
    name: string,
    color: TColor,
    icon: string
}


export const TransTypes = [
    { id: 1, name: "Main Account", color: 'primary' as TColor, icon: 'Business' },
    { id: 2, name: "Till Account", color: 'success' as TColor, icon: 'AccountBalance' },
    { id: 3, name: "Bill Payment", color: 'info' as TColor, icon: 'AccountBalanceWallet' },
    { id: 4, name: "EasyLoad", color: 'primary' as TColor, icon: 'Payment' },
];

export const Currencies = [
    { value: "02svsf", text: "Pakistani Rupee" },
    { value: "09nqf", text: "United States Dollar" },
    { value: "02l6h", text: "Euro" },
    { value: "01nv4h", text: "Pound sterling" },
    { value: "0hn4_", text: "Chinese Yuan" },
    { value: "02d1cm", text: "Saudi Riyal" },
    { value: "05lf7w", text: "Qatari Riyal" },
];
export const billTypes = [
    { value: "LESCO", text: "LESCO" },
    { value: "GEPCO", text: "GEPCO" },
    { value: "SNGPL", text: "SNGPL" },
    { value: "PTCL", text: "PTCL" },
    { value: "OTHER", text: "OTHER" }
];

export const GetCurrencyName = (code: string) => {
    return Currencies.find((c) => c.value == code)?.text;
}
