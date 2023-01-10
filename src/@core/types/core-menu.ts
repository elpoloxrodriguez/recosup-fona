// prettier-ignore
export interface CoreMenuItem {
    id           : string;
    title?       : string;
    nombre       : string;
    url?         : string;
    type         : 'section' | 'collapsible' | 'item';
    role?        : Array<string>;
    translate?   : string;
    icono?        : string;
    disabled?    : boolean;
    hidden?      : boolean;
    classes?     : string;
    exactMatch?  : boolean;
    externalUrl? : boolean;
    openInNewTab?: boolean;
    badge?       : {
        title?    : string;
        translate?: string;
        classes?    : string;
    };
    children?: CoreMenuItem[];
}

export interface CoreMenu extends CoreMenuItem {
  children?: CoreMenuItem[];
}
