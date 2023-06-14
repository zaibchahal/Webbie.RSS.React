export interface ILang {
    [key: string]: {
        text: string;
        lng: 'en' | 'ur' | 'de' | 'fr' | 'tr';
        icon: string;
    };
}

const LANG: ILang = {
    EN: {
        text: 'English',
        lng: 'en',
        icon: 'CustomUsa',
    },
    UR: {
        text: 'Urdu',
        lng: 'ur',
        icon: 'CustomPak',
    },
    DE: {
        text: 'Deutsche',
        lng: 'de',
        icon: 'CustomGermany',
    },
    FR: {
        text: 'Français',
        lng: 'fr',
        icon: 'CustomFrance',
    },
    TR: {
        text: 'Türkçe',
        lng: 'tr',
        icon: 'CustomTurkey',
    },
};

export const getLangWithKey = (key: ILang['key']['lng']): ILang['key'] => {
    // @ts-ignore
    return LANG[Object.keys(LANG).filter((f) => key.includes(LANG[f].lng))];
};

export default LANG;
